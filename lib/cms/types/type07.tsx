import { items, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 07: 제목 + 이미지 한 장과 글머리 목록을 나란히. 원본은 contents[0] 하나만 쓰므로 필드를 평평하게 편다.
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
    .demo-type07 { background: #f4f7fb; }
    .demo-type07 .demo-column-wrap { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: center; }
    .demo-type07 .demo-bullet-list { display: flex; flex-direction: column; gap: 12px; padding-left: 1.1rem; list-style: disc; }
    .demo-type07 .demo-bullet-list .demo-list-item { color: #1d2733; }
    @media (min-width: 48rem) {
      .demo-type07 .demo-column-wrap { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type07">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-column-wrap">
          <Pictures image={values.image} imageMobile={values.imageMobile} />
          <div className="demo-list-wrap">
            <ul className="demo-bullet-list">
              {items(values.subtext).map((sub, index) => (
                <li key={index} className="demo-list-item">
                  <div className="demo-description-box">
                    <p className="demo-desc">{str(sub.text)}</p>
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
