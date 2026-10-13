import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 21과 같은 HTML을 만든다: 왼쪽 정렬 머리글, 이미지 한 장 옆에 테두리 목록.
// 원본은 머리글의 큰 글이 비면 넣지 않고, 모바일 이미지는 PC 이미지가 있을 때만 보여 준다.
const type21: CmsType = {
  id: "type21",
  number: "21",
  label: "타입 21 · 왼쪽 정렬 머리글 + 이미지 옆 테두리 목록",
  fields: [titleField, ...imageFields(), listField("contents", "목록", "목록", [{ kind: "rich", key: "text", label: "글" }])],
  defaults: {
    title: titleDefault,
    ...imageDefaults,
    contents: [1, 2, 3, 4].map((n) => ({ text: `목록 ${n}` })),
  },
  css: `
    .type21 .cms-header.left-type { text-align: left; }
    .type21 .cms-column-wrap { row-gap: 20px; align-items: center; }
    .type21 .cms-border-list { row-gap: 8px; }
    .type21 .cms-border-list .cms-title { padding: 4px 12px; border: 1px solid #3a6ea5; font-size: 1rem; }
  `,
  View: ({ values }) => (
    <section className="cms type21">
      <div className="cms-inner">
        <CmsHeader values={values} hideEmptyBig extraClass="left-type" />
        <div className="cms-column-wrap box-type row">
          <div className="cms-visual col-12 col-lg-5">
            <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
            <Img
              value={values.imageMobile}
              kind="mobile"
              className="w-100 d-block d-lg-none"
              gate={str(values.image).trim() !== ""}
            />
          </div>
          <div className="cms-box col-12 col-lg-7">
            <div className="cms-list-wrap">
              <ul className="cms-border-list text-type-2 row">
                {items(values.contents).map((item, index) => (
                  <li key={index} className="cms-list-item col-6 col-lg-auto">
                    <div className="cms-description-box">
                      {str(item.text).trim() !== "" && <p className="cms-title" {...richProps(item.text)} />}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
};

export { type21 };
