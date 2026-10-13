import { items, richProps, type CmsType } from "../type";
import { TitleBlock, listField, titleDefault, titleField } from "./parts";

// 원본 타입 11: 어두운 바탕의 글머리 목록. 항목마다 글 한 줄(문단)이 상자에 담긴다.
const type11: CmsType = {
  id: "type11",
  number: "11",
  label: "타입 11 · 어두운 바탕의 글머리 목록",
  fields: [titleField, listField("contents", "항목", "항목", [{ kind: "rich", key: "text", label: "글" }])],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3].map((n) => ({ text: `항목 ${n} 내용을 입력해 보세요.` })),
  },
  css: `
    .demo-type11 { background: #1d2733; border-color: #1d2733; color: #ffffff; }
    .demo-type11 .demo-header { border-top-color: #ffffff; }
    .demo-type11 .demo-eyebrow { color: #9db8d6; }
    .demo-type11 .demo-bullet-list { display: flex; flex-direction: column; gap: 10px; }
    .demo-type11 .demo-bullet-list .demo-list-item { padding: 14px 16px; border: 1px solid #3b4a5c; border-left: 4px solid #9db8d6; }
    .demo-type11 .demo-desc { color: #e6ebf0; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type11">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ul className="demo-bullet-list">
            {items(values.contents).map((item, index) => (
              <li key={index} className="demo-list-item">
                <div className="demo-description-box">
                  <p className="demo-desc" {...richProps(item.text)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  ),
};

export { type11 };
