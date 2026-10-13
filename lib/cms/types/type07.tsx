import { items, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 07과 같은 HTML을 만든다: 이미지 한 장과 글머리 목록을 나란히. 원본은 contents[0]만 쓰므로 필드를 평평하게 편다.
const type07: CmsType = {
  id: "type07",
  number: "07",
  label: "타입 07 · 이미지 + 글머리 목록",
  fields: [
    titleField,
    ...imageFields(),
    listField("subtext", "글머리", "글머리", [{ kind: "text", key: "text", label: "글" }], 1, 8),
  ],
  defaults: {
    title: titleDefault,
    ...imageDefaults,
    subtext: [1, 2, 3].map((n) => ({ text: `내용 ${n}` })),
  },
  css: `
    .type07 .cms-column-wrap { align-items: center; }
    .type07 .cms-visual { margin-bottom: 16px; }
    .type07 .cms-bullet-list { display: flex; flex-direction: column; gap: 12px; padding-left: 1.1rem; list-style: disc; }
  `,
  View: ({ values }) => (
    <section className="cms type07 type-bg bg-color-3">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-column-wrap box-type row">
          <div className="cms-visual col-12 col-lg-6">
            <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
            <Img value={values.imageMobile} kind="mobile" className="w-100 d-block d-lg-none" />
          </div>
          <div className="cms-list-wrap col-12 col-lg-6">
            <ul className="cms-bullet-list list-style-1 cms-spread-list">
              {items(values.subtext).map((sub, index) => (
                <li key={index} className="cms-list-item">
                  <div className="cms-description-box">
                    <p className="cms-description">{str(sub.text)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  ),
};

export { type07 };
