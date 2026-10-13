import { CHECKLIST, type ItemStatus } from "./checklist";

export type QaPage = {
  id: string;
  name: string;
  note: string;
  statuses: Record<string, ItemStatus>;
};

export type QaState = { version: 1; pages: QaPage[] };

export const MAX_PAGES = 20;
export const NAME_MAX = 40;
export const NOTE_MAX = 200;

// 샘플 이름은 일반적인 이름만 쓴다. 실제 고객이나 병원 이름은 넣지 않는다.
const SAMPLE_PAGES: { id: string; name: string }[] = [
  { id: "sample-main", name: "샘플 메인" },
  { id: "sample-consult", name: "샘플 상담 안내" },
  { id: "sample-location", name: "샘플 오시는 길" },
];

export function createSampleState(): QaState {
  return {
    version: 1,
    pages: SAMPLE_PAGES.map(({ id, name }) => ({
      id,
      name,
      note: "",
      statuses: Object.fromEntries(CHECKLIST.map((item) => [item.id, "todo" as const])),
    })),
  };
}

export function getStatus(page: QaPage, itemId: string): ItemStatus {
  return page.statuses[itemId] ?? "todo";
}

function updatePage(state: QaState, pageId: string, update: (page: QaPage) => QaPage): QaState {
  return { ...state, pages: state.pages.map((p) => (p.id === pageId ? update(p) : p)) };
}

export function setStatus(
  state: QaState,
  pageId: string,
  itemId: string,
  status: ItemStatus,
): QaState {
  return updatePage(state, pageId, (p) => ({ ...p, statuses: { ...p.statuses, [itemId]: status } }));
}

export function setNote(state: QaState, pageId: string, note: string): QaState {
  return updatePage(state, pageId, (p) => ({ ...p, note: note.slice(0, NOTE_MAX) }));
}

export function addPage(state: QaState, name: string, id: string): QaState {
  const trimmed = name.trim().slice(0, NAME_MAX);
  if (trimmed === "" || state.pages.length >= MAX_PAGES || state.pages.some((p) => p.id === id)) {
    return state;
  }
  return { ...state, pages: [...state.pages, { id, name: trimmed, note: "", statuses: {} }] };
}

export function removePage(state: QaState, pageId: string): QaState {
  return { ...state, pages: state.pages.filter((p) => p.id !== pageId) };
}

export function isPublishable(page: QaPage): boolean {
  return CHECKLIST.every((item) => {
    const status = getStatus(page, item.id);
    return status === "pass" || status === "na";
  });
}

export function summarize(
  state: QaState,
  selectedId: string | null,
): {
  total: number;
  publishable: number;
  selected: { pass: number; fail: number; todo: number; na: number } | null;
} {
  const page = selectedId === null ? undefined : state.pages.find((p) => p.id === selectedId);
  let selected: { pass: number; fail: number; todo: number; na: number } | null = null;
  if (page) {
    selected = { pass: 0, fail: 0, todo: 0, na: 0 };
    for (const item of CHECKLIST) selected[getStatus(page, item.id)] += 1;
  }
  return { total: state.pages.length, publishable: state.pages.filter(isPublishable).length, selected };
}
