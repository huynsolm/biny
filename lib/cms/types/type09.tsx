import { items, richProps, str, type CmsType } from "../type";
import { CheckCircleSvg, CmsHeader, listField, titleDefault, titleField } from "./parts";

// 원본 타입 09와 같은 HTML을 만든다: 체크 표시가 붙은 항목 목록. 선택 변형은 한 줄에 놓는 항목 수(원본 열 클래스)다.
const COLUMNS = ["col-12", "col-6", "col-4"];

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
        { value: "col-12", label: "1개" },
        { value: "col-6", label: "2개" },
        { value: "col-4", label: "3개" },
      ],
    },
    listField("contents", "항목", "항목", [{ kind: "rich", key: "text", label: "글" }]),
  ],
  defaults: {
    title: titleDefault,
    perRow: "col-6",
    contents: [1, 2, 3, 4].map((n) => ({ text: `항목 ${n}` })),
  },
  css: `
    .type09 .cms-column-list { row-gap: 16px; }
    .type09 .cms-list-item > .cms-inner-box { height: 100%; padding: 16px 0; border: 1px solid #d5dce4; background: #ffffff; align-items: flex-start; margin: 0; }
    .type09 .cms-figure svg .cls-1 { fill: #3a6ea5; }
  `,
  View: ({ values }) => {
    const column = COLUMNS.includes(str(values.perRow)) ? str(values.perRow) : "col-12";
    return (
      <section className="cms type09 type-bg">
        <div className="cms-inner">
          <CmsHeader values={values} />
          <div className="cms-list-wrap">
            <ul className="cms-column-list item-bg-box text-type-3 row justify-content-start">
              {items(values.contents).map((item, index) => (
                <li key={index} className={`cms-list-item ${column}`}>
                  <div className="cms-inner-box row">
                    <div className="cms-figure check col-auto">
                      <CheckCircleSvg />
                    </div>
                    <div className="cms-description-box col">
                      <p className="cms-description" {...richProps(item.text)} />
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
