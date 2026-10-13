import { items, richProps, str, type CmsType } from "../type";
import { TitleBlock, listField, titleDefault, titleField } from "./parts";

// 원본 타입 17: 제목 칸과 설명 칸이 한 줄씩 이어지는 행 목록. 선택 변형은 제목 칸의 폭이다.
// (원본 값은 col-auto / col-2였고, 이 데모에서는 의미에 맞게 auto / wide로 쓴다.)
const WIDTHS = ["auto", "wide"];

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
        { value: "auto", label: "글자 길이만큼" },
        { value: "wide", label: "넓게" },
      ],
    },
    listField("contents", "행", "행", [
      { kind: "text", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    titleWidth: "auto",
    contents: [1, 2, 3, 4].map((n) => ({ tit: `제목 ${n}`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .demo-type17 .demo-row-list { display: flex; flex-direction: column; border-top: 2px solid #1d2733; }
    .demo-type17 .demo-list-item { padding: 14px 0; border-bottom: 1px solid #d5dce4; }
    .demo-type17 .demo-description-box { display: grid; grid-template-columns: minmax(0, 1fr); gap: 4px 24px; }
    .demo-type17 .demo-description-box .demo-title { font-size: 1.0625rem; }
    @media (min-width: 40rem) {
      .demo-type17 .demo-title-auto .demo-description-box { grid-template-columns: max-content minmax(0, 1fr); }
      .demo-type17 .demo-title-wide .demo-description-box { grid-template-columns: 12rem minmax(0, 1fr); }
    }
  `,
  View: ({ values }) => {
    const width = WIDTHS.includes(str(values.titleWidth)) ? str(values.titleWidth) : "auto";
    return (
      <section className="demo-block demo-type17">
        <div className="demo-inner">
          <TitleBlock values={values} />
          <div className="demo-list-wrap">
            <ol className={`demo-row-list demo-title-${width}`}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="demo-list-item">
                  <div className="demo-description-box">
                    <p className="demo-title">{str(item.tit)}</p>
                    <p className="demo-desc" {...richProps(item.text)} />
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
