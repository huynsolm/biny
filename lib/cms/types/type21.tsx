import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 21: 왼쪽 정렬 머리글, 이미지 한 장 옆에 테두리 목록. 비어 있는 목록 글은 넣지 않는다.
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
    .demo-type21 .demo-column-wrap { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: center; }
    .demo-type21 .demo-border-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .demo-type21 .demo-border-list .demo-list-item { padding: 6px 12px; border: 1px solid #3a6ea5; }
    .demo-type21 .demo-border-list .demo-title { font-size: 1rem; }
    @media (min-width: 48rem) {
      .demo-type21 .demo-column-wrap { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 28px; }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type21">
      <div className="demo-inner">
        <div className="demo-left">
          <TitleBlock values={values} />
        </div>
        <div className="demo-column-wrap">
          <Pictures image={values.image} imageMobile={values.imageMobile} />
          <div className="demo-box">
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

export { type21 };
