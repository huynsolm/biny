import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 24: 이미지 한 장 아래에 번호가 붙은 목록. 항목마다 제목과 설명이 있고 비어 있으면 넣지 않는다.
// 번호는 CSS 카운터로 붙인다.
const type24: CmsType = {
  id: "type24",
  number: "24",
  label: "타입 24 · 이미지 한 장 + 번호 목록",
  fields: [
    titleField,
    ...imageFields(),
    listField("contents", "항목", "항목", [
      { kind: "rich", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    ...imageDefaults,
    contents: [1, 2, 3].map((n) => ({ tit: `항목 ${n} 제목`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .demo-type24 { background: #eef3f9; }
    .demo-type24 .demo-ordered-list { counter-reset: demo-order; display: flex; flex-direction: column; gap: 16px; }
    .demo-type24 .demo-ordered-list .demo-list-item { counter-increment: demo-order; display: flex; gap: 14px; align-items: flex-start; }
    .demo-type24 .demo-ordered-list .demo-list-item::before { content: counter(demo-order); flex: none; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #3a6ea5; color: #ffffff; font-size: 0.875rem; font-weight: 600; }
    .demo-type24 .demo-description-box { display: flex; flex-direction: column; gap: 2px; }
    .demo-type24 .demo-description-box .demo-title { font-size: 1.0625rem; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type24">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <Pictures image={values.image} imageMobile={values.imageMobile} />
        <div className="demo-list-wrap">
          <ol className="demo-ordered-list">
            {items(values.contents).map((item, index) => (
              <li key={index} className="demo-list-item">
                <div className="demo-description-box">
                  {str(item.tit).trim() !== "" && <p className="demo-title" {...richProps(item.tit)} />}
                  {str(item.text).trim() !== "" && <p className="demo-desc" {...richProps(item.text)} />}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  ),
};

export { type24 };
