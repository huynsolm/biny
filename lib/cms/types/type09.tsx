import { items, richProps, str, type CmsType } from "../type";
import { TitleBlock, listField, titleDefault, titleField } from "./parts";

// 원본 타입 09: 체크 표시가 붙은 항목 목록. 선택 변형은 한 줄에 놓는 항목 수(1·2·3개)이고 열 수 수정자로 반영한다.
const PER_ROW = ["1", "2", "3"];

const type09: CmsType = {
  id: "type09",
  number: "09",
  label: "타입 09 · 체크 표시 목록 (한 줄에 1~3개)",
  fields: [
    titleField,
    {
      kind: "select",
      key: "perRow",
      label: "한 줄에 놓을 항목 수",
      options: [
        { value: "1", label: "1개" },
        { value: "2", label: "2개" },
        { value: "3", label: "3개" },
      ],
    },
    listField("contents", "항목", "항목", [{ kind: "rich", key: "text", label: "글" }]),
  ],
  defaults: {
    title: titleDefault,
    perRow: "2",
    contents: [1, 2, 3, 4].map((n) => ({ text: `항목 ${n}` })),
  },
  css: `
    .demo-type09 { background: #f4f7fb; }
    .demo-type09 .demo-inner-box { display: flex; gap: 12px; align-items: flex-start; height: 100%; padding: 16px; border: 1px solid #d5dce4; background: #ffffff; }
    .demo-type09 .demo-description-box { flex: 1; min-width: 0; }
  `,
  View: ({ values }) => {
    const perRow = PER_ROW.includes(str(values.perRow)) ? str(values.perRow) : "1";
    return (
      <section className="demo-block demo-type09">
        <div className="demo-inner">
          <TitleBlock values={values} />
          <div className="demo-list-wrap">
            <ul className={`demo-column-list demo-cols-${perRow}`}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="demo-list-item">
                  <div className="demo-inner-box">
                    <div className="demo-figure demo-check" aria-hidden="true"></div>
                    <div className="demo-description-box">
                      <p className="demo-desc" {...richProps(item.text)} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  },
};

export { type09 };
