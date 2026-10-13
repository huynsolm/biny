import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 24와 같은 HTML을 만든다: 이미지 한 장 아래에 번호가 붙은 목록. 항목마다 제목과 설명이 있고 비어 있으면 넣지 않는다.
// 번호는 CSS 카운터로 붙인다. 이 타입만 모바일 이미지가 PC 이미지와 따로 보인다(원본 그대로).
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
    .type24 .cms-ordered-list { counter-reset: cms-order; display: flex; flex-direction: column; gap: 16px; }
    .type24 .cms-ordered-list .cms-list-item { counter-increment: cms-order; display: flex; gap: 14px; align-items: flex-start; }
    .type24 .cms-ordered-list .cms-list-item::before { content: counter(cms-order); flex: none; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #3a6ea5; color: #ffffff; font-size: 0.875rem; font-weight: 600; }
    .type24 .cms-description-box { display: flex; flex-direction: column; gap: 2px; }
    .type24 .cms-description-box .cms-title { font-size: 1.0625rem; }
  `,
  View: ({ values }) => (
    <section className="cms type24 type-bg bg-color-2">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-visual">
          <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
          <Img value={values.imageMobile} kind="mobile" className="w-100 d-block d-lg-none" />
        </div>
        <div className="cms-list-wrap cms-desktop-rs-only">
          <ol className="cms-ordered-list">
            {items(values.contents).map((item, index) => (
              <li key={index} className="cms-list-item">
                <div className="cms-description-box">
                  {str(item.tit).trim() !== "" && <p className="cms-title" {...richProps(item.tit)} />}
                  {str(item.text).trim() !== "" && <p className="cms-description" {...richProps(item.text)} />}
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
