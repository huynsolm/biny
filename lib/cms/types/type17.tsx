import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, listField, titleDefault, titleField } from "./parts";

// 원본 타입 17과 같은 HTML을 만든다: 제목 칸과 설명 칸이 한 줄씩 이어지는 행 목록. 선택 변형은 제목 칸의 열 클래스(원본 값)다.
const WIDTHS = ["col-auto", "col-2"];

const type17: CmsType = {
  id: "type17",
  number: "17",
  label: "타입 17 · 제목 + 설명 행 목록 (제목 칸 폭 선택)",
  fields: [
    titleField,
    {
      kind: "select",
      key: "titleWidth",
      label: "제목 칸 폭",
      options: [
        { value: "col-auto", label: "글자 길이만큼" },
        { value: "col-2", label: "넓게" },
      ],
    },
    listField("contents", "행", "행", [
      { kind: "text", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    titleWidth: "col-auto",
    contents: [1, 2, 3, 4].map((n) => ({ tit: `제목 ${n}`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .type17 .cms-row-list { border-top: 2px solid #1d2733; }
    .type17 .cms-list-item { padding: 14px 0; border-bottom: 1px solid #d5dce4; }
    .type17 .cms-description-box { align-items: baseline; row-gap: 4px; }
    .type17 .cms-description-box .cms-title { font-size: 1.0625rem; }
  `,
  View: ({ values }) => {
    const width = WIDTHS.includes(str(values.titleWidth)) ? str(values.titleWidth) : "col-auto";
    return (
      <section className="cms type17">
        <div className="cms-inner">
          <CmsHeader values={values} />
          <div className="cms-list-wrap">
            <ol className="cms-row-list text-type-1">
              {items(values.contents).map((item, index) => (
                <li key={index} className="cms-list-item">
                  <div className="cms-description-box row">
                    <p className={`cms-title ${width}`}>{str(item.tit)}</p>
                    <p className="cms-description col" {...richProps(item.text)} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  },
};

export { type17 };
