import { richProps, items, str, type CmsType } from "../type";
import { TitleBlock, listField, titleDefault, titleField } from "./parts";

// 원본 타입 02: 제목 + 항목 목록. 항목마다 도형 안의 글(작은 글, 핵심 글)과 아래 설명이 있다.
// 원본의 오각형 SVG 경로는 가져오지 않고 CSS clip-path로 새로 그렸다.
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
    .demo-type02 { background: #f4f7fb; }
    .demo-type02 .demo-figure-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 20px; }
    .demo-type02 .demo-figure { display: flex; align-items: center; justify-content: center; aspect-ratio: 1 / 0.96; padding: 24px 16px; text-align: center; background: #3a6ea5; color: #ffffff; clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%); }
    .demo-type02 .demo-figure-text { display: flex; flex-direction: column; gap: 4px; }
    .demo-type02 .demo-figure .demo-eyebrow { margin: 0; color: #cfe0f3; }
    .demo-type02 .demo-figure .demo-desc { color: #ffffff; font-weight: 600; }
    .demo-type02 .demo-description-box { margin-top: 12px; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type02">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ol className="demo-figure-list">
            {items(values.items).map((item, index) => (
              <li key={index} className="demo-list-item">
                <div className="demo-figure">
                  <div className="demo-figure-text">
                    <p className="demo-eyebrow">{str(item.stit)}</p>
                    <p className="demo-desc">{str(item.text)}</p>
                  </div>
                </div>
                <div className="demo-description-box">
                  <p className="demo-desc" {...richProps(item.description)} />
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
