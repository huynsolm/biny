import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, PentagonSvg, listField, titleDefault, titleField } from "./parts";

// 원본 타입 02와 같은 HTML을 만든다: 오각형 SVG 안에 작은 글과 핵심 글, 그 아래 설명.
const type02: CmsType = {
  id: "type02",
  number: "02",
  label: "타입 02 · 도형 안에 핵심 글 + 설명 목록",
  fields: [
    titleField,
    listField("items", "항목", "항목", [
      { kind: "text", key: "stit", label: "작은 글" },
      { kind: "text", key: "text", label: "핵심 글" },
      { kind: "rich", key: "description", label: "설명" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    items: [1, 2, 3].map((n) => ({ stit: `항목 ${n}`, text: "핵심 문구", description: "설명을 입력해 보세요." })),
  },
  css: `
    .type02 .cms-list-item { margin-bottom: 24px; text-align: center; }
    .type02 .cms-figure { position: relative; width: 100%; max-width: 286px; margin: 0 auto 12px; }
    .type02 .cms-figure-svg { display: block; width: 100%; height: auto; }
    .type02 .cms-figure-svg .cls-1 { fill: #3a6ea5; }
    .type02 .cms-figure-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 0 16px; }
    .type02 .cms-figure-text .cms-eyebrow { margin: 0; color: #cfe0f3; }
    .type02 .cms-figure-text .cms-description { color: #ffffff; font-weight: 600; }
  `,
  View: ({ values }) => (
    <section className="cms type02 type-bg">
      <div className="cms-inner">
        <CmsHeader values={values} eyebrowSpace />
        <div className="cms-list-wrap">
          <ol className="cms-figure-list text-type-1 row justify-content-center">
            {items(values.items).map((item, index) => (
              <li key={index} className="cms-list-item col-6 col-lg-4">
                <div className="cms-figure pentagon">
                  <PentagonSvg />
                  <div className="cms-figure-text">
                    <p className="cms-eyebrow">{str(item.stit)}</p>
                    <p className="cms-description">{str(item.text)}</p>
                  </div>
                </div>
                <div className="cms-description-box">
                  <p className="cms-description" {...richProps(item.description)} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  ),
};

export { type02 };
