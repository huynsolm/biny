import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 20: 이미지 한 장 옆에 상자(작은 글 + 큰 글)와 테두리 목록이 놓인다.
// 원본은 contents[0]의 smTit/tit만 상자에 쓰므로 두 글은 최상위 필드로 펴고, contents는 목록의 글만 맡는다.
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
    .demo-type20 .demo-column-wrap { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: end; }
    .demo-type20 .demo-em-box { padding: 16px; background: #eef3f9; border-left: 4px solid #3a6ea5; }
    .demo-type20 .demo-em-box .demo-eyebrow { margin: 0; }
    .demo-type20 .demo-border-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .demo-type20 .demo-border-list .demo-list-item { padding: 6px 12px; border: 1px solid #3a6ea5; }
    .demo-type20 .demo-border-list .demo-title { font-size: 1rem; }
    @media (min-width: 48rem) {
      .demo-type20 .demo-column-wrap { grid-template-columns: minmax(0, 1fr) minmax(0, 3fr); gap: 28px; }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type20">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-column-wrap">
          <Pictures image={values.image} imageMobile={values.imageMobile} />
          <div className="demo-box">
            <div className="demo-description-box demo-em-box">
              <p className="demo-eyebrow">{str(values.smTit)}</p>
              <p className="demo-title">{str(values.tit)}</p>
            </div>
            <div className="demo-list-wrap">
              <ul className="demo-border-list">
                {items(values.contents)
                  .filter((item) => str(item.text).trim() !== "")
                  .map((item, index) => (
                    <li key={index} className="demo-list-item">
                      <div className="demo-description-box">
                        <p className="demo-title" {...richProps(item.text)} />
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
