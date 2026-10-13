import { items, type CmsType } from "../type";
import { TableRows, TitleBlock, listField, tableCss, titleDefault, titleField } from "./parts";

// 원본 타입 14: 타입 13과 같은 표 모양 목록이고 아래 강조 상자가 없다.
const type14: CmsType = {
  id: "type14",
  number: "14",
  label: "타입 14 · 번호 + 글 + 체크 표 목록",
  fields: [
    titleField,
    listField("contents", "행", "행", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "rich", key: "text", label: "글" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3, 4].map((n) => ({ num: `0${n}`, text: `${n}번째 내용을 입력해 보세요.` })),
  },
  css: tableCss("demo-type14"),
  View: ({ values }) => (
    <section className="demo-block demo-type14">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <TableRows rows={items(values.contents)} />
        </div>
      </div>
    </section>
  ),
};

export { type14 };
