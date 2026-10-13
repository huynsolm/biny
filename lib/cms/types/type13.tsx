import { richProps, items, str, type CmsType } from "../type";
import { TableRows, TitleBlock, listField, tableCss, titleDefault, titleField } from "./parts";

// 원본 타입 13: 번호 + 글 + 체크 표시가 한 줄로 이어지는 표 모양 목록, 그리고 아래에 강조 상자(선택).
const type13: CmsType = {
  id: "type13",
  number: "13",
  label: "타입 13 · 번호 + 글 + 체크 표 목록 (아래 강조 상자)",
  fields: [
    titleField,
    listField("contents", "행", "행", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "rich", key: "text", label: "글" },
    ]),
    { kind: "rich", key: "bottomText", label: "아래 강조 문구 (비우면 상자 없음)" },
  ],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3].map((n) => ({ num: `0${n}`, text: `${n}번째 내용을 입력해 보세요.` })),
    bottomText: "마무리 문구를 입력해 보세요.",
  },
  css: `${tableCss("demo-type13")}
    .demo-type13 .demo-em-box { padding: 16px; background: #eef3f9; border-left: 4px solid #3a6ea5; }
    .demo-type13 .demo-em-box .demo-desc { color: #1d2733; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type13">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <TableRows rows={items(values.contents)} />
        </div>
        {str(values.bottomText).trim() !== "" && (
          <div className="demo-description-box demo-em-box">
            <p className="demo-desc" {...richProps(values.bottomText)} />
          </div>
        )}
      </div>
    </section>
  ),
};

export { type13 };
