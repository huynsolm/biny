import { DEFAULT_IMAGE_SRC, escapeHtml, safeImageSrc } from "./html";

export type ComponentTypeId = "title" | "media" | "cards";

export type Card = { title: string; description: string };

export type CmsValues = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cards: Card[];
};

export type FieldId = "title" | "description" | "imageSrc" | "imageAlt" | "cards";

export const COMPONENT_TYPES: { id: ComponentTypeId; label: string; fields: FieldId[] }[] = [
  { id: "title", label: "제목 + 설명", fields: ["title", "description"] },
  { id: "media", label: "이미지 + 텍스트", fields: ["imageSrc", "imageAlt", "title", "description"] },
  { id: "cards", label: "카드 목록", fields: ["title", "cards"] },
];

export const LIMITS = {
  title: 60,
  description: 300,
  cardTitle: 60,
  cardDescription: 120,
  imageSrc: 200,
  imageAlt: 120,
};

export const MIN_CARDS = 2;
export const MAX_CARDS = 4;

// 안내형 일반 문구만 쓴다. 실제 병원, 고객, 서비스 이름은 넣지 않는다.
export const DEFAULT_VALUES: CmsValues = {
  title: "제목을 입력해 보세요",
  description: "입력한 내용이 HTML 소스와 미리보기에 바로 반영돼요.",
  imageSrc: DEFAULT_IMAGE_SRC,
  imageAlt: "샘플 이미지",
  cards: [
    { title: "첫 번째 카드", description: "카드 설명을 입력해 보세요." },
    { title: "두 번째 카드", description: "카드는 2개에서 4개까지 만들 수 있어요." },
  ],
};

export function clampCards(cards: Card[]): Card[] {
  const kept = cards.slice(0, MAX_CARDS);
  while (kept.length < MIN_CARDS) kept.push({ title: "", description: "" });
  return kept;
}

const cap = (value: string, limit: number) => value.slice(0, limit);
const isBlank = (value: string) => value.trim() === "";

// 비어 있는 요소는 출력하지 않는다. text는 이미 상한으로 자른 값이다.
function textLine(indent: string, tag: string, className: string, text: string): string[] {
  return isBlank(text) ? [] : [`${indent}<${tag} class="${className}">${escapeHtml(text)}</${tag}>`];
}

function renderTitle(v: CmsValues): string[] {
  return [
    '<section class="demo-block demo-title">',
    ...textLine("  ", "h2", "demo-heading", cap(v.title, LIMITS.title)),
    ...textLine("  ", "p", "demo-desc", cap(v.description, LIMITS.description)),
    "</section>",
  ];
}

function renderMedia(v: CmsValues): string[] {
  const src = escapeHtml(safeImageSrc(cap(v.imageSrc, LIMITS.imageSrc)));
  const alt = escapeHtml(cap(v.imageAlt, LIMITS.imageAlt));
  return [
    '<section class="demo-block demo-media">',
    `  <img class="demo-image" src="${src}" alt="${alt}">`,
    '  <div class="demo-body">',
    ...textLine("    ", "h2", "demo-heading", cap(v.title, LIMITS.title)),
    ...textLine("    ", "p", "demo-desc", cap(v.description, LIMITS.description)),
    "  </div>",
    "</section>",
  ];
}

function renderCards(v: CmsValues): string[] {
  const items = clampCards(v.cards).flatMap((card) => [
    '    <li class="demo-card">',
    ...textLine("      ", "h3", "demo-card-title", cap(card.title, LIMITS.cardTitle)),
    ...textLine("      ", "p", "demo-card-desc", cap(card.description, LIMITS.cardDescription)),
    "    </li>",
  ]);
  return [
    '<section class="demo-block demo-cards">',
    ...textLine("  ", "h2", "demo-heading", cap(v.title, LIMITS.title)),
    '  <ul class="demo-card-list">',
    ...items,
    "  </ul>",
    "</section>",
  ];
}

export function renderHtml(type: ComponentTypeId, values: CmsValues): string {
  const lines = type === "title" ? renderTitle(values) : type === "media" ? renderMedia(values) : renderCards(values);
  return lines.join("\n");
}
