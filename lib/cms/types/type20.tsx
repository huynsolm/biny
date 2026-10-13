import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 20과 같은 HTML을 만든다: 이미지 한 장 옆에 상자(작은 글 + 큰 글)와 테두리 목록이 놓인다.
// 원본은 contents[0]의 smTit/tit만 상자에 쓰므로 두 글은 최상위 필드로 펴고, contents는 목록의 글만 맡는다.
// 원본은 머리글의 큰 글이 비면 넣지 않고, 모바일 이미지는 PC 이미지가 있을 때만 보여 준다.
const type20: CmsType = {
  id: "type20",
  number: "20",
  label: "타입 20 · 이미지 옆 강조 상자 + 테두리 목록",
  fields: [
    titleField,
    ...imageFields(),
    { kind: "text", key: "smTit", label: "상자의 작은 글" },
    { kind: "text", key: "tit", label: "상자의 큰 글" },
    listField("contents", "목록", "목록", [{ kind: "rich", key: "text", label: "글" }]),
  ],
  defaults: {
    title: titleDefault,
    ...imageDefaults,
    smTit: "작은 글",
    tit: "강조할 문구를 입력해 보세요",
    contents: [1, 2, 3, 4].map((n) => ({ text: `목록 ${n}` })),
  },
  css: `
    .type20 .cms-column-wrap { row-gap: 20px; }
    .type20 .em-box-2 { padding: 16px; background: #eef3f9; border-left: 4px solid #3a6ea5; }
    .type20 .em-box-2 .cms-eyebrow { margin: 0; }
    .type20 .cms-border-list { margin-top: 12px; row-gap: 8px; }
    .type20 .cms-border-list .cms-title { padding: 4px 12px; border: 1px solid #3a6ea5; font-size: 1rem; }
  `,
  View: ({ values }) => (
    <section className="cms type20">
      <div className="cms-inner">
        <CmsHeader values={values} hideEmptyBig />
        <div className="cms-column-wrap box-type row align-items-lg-end">
          <div className="cms-visual col-4 col-lg-3">
            <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
            <Img
              value={values.imageMobile}
              kind="mobile"
              className="w-100 d-block d-lg-none"
              gate={str(values.image).trim() !== ""}
            />
          </div>
          <div className="cms-box col-8 col-lg-9">
            <div className="cms-description-box em-box-2">
              <p className="cms-eyebrow">{str(values.smTit)}</p>
              <p className="cms-title">{str(values.tit)}</p>
            </div>
            <div className="cms-list-wrap">
              <ul className="cms-border-list text-type-1 row">
                {items(values.contents).map((item, index) => (
                  <li key={index} className="cms-list-item col-6 col-lg-3">
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

export { type20 };
