import { items, richProps, type CmsType } from "../type";
import { CmsHeader, listField, titleDefault, titleField } from "./parts";

// 원본 타입 11과 같은 HTML을 만든다: 어두운 바탕의 글머리 목록.
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
    .type11 .cms-bullet-list { display: flex; flex-direction: column; gap: 10px; }
    .type11 .cms-bullet-list .cms-list-item { padding: 14px 16px; border: 1px solid #3b4a5c; border-left: 4px solid #9db8d6; }
  `,
  View: ({ values }) => (
    <section className="cms type11 type-bg bg-image-2 text-white">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ul className="cms-bullet-list list-bg-box">
            {items(values.contents).map((item, index) => (
              <li key={index} className="cms-list-item">
                <div className="cms-description-box">
                  <p className="cms-description" {...richProps(item.text)} />
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
