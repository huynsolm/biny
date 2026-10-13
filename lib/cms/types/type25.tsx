import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 25: 이미지 위에 제목과 글이 붙는 목록. 선택 변형은 한 줄에 놓는 칸 수(4개/3개)이고 열 수 수정자로 반영한다.
const PER_ROW = ["3", "4"];

const type25: CmsType = {
  id: "type25",
  number: "25",
  label: "타입 25 · 이미지 + 제목·글 목록 (한 줄에 3~4개)",
  fields: [
    titleField,
    {
      kind: "select",
      key: "perRow",
      label: "한 줄에 놓을 칸 수",
      options: [
        { value: "4", label: "4개" },
        { value: "3", label: "3개" },
      ],
    },
    listField("contents", "칸", "칸", [
      ...imageFields(),
      { kind: "rich", key: "title", label: "제목" },
      { kind: "rich", key: "text", label: "글" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    perRow: "4",
    contents: [1, 2, 3, 4].map((n) => ({ ...imageDefaults, title: `칸 ${n} 제목`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .demo-type25 .demo-column-list > .demo-list-item { display: flex; flex-direction: column; gap: 10px; }
    .demo-type25 .demo-description-box { display: flex; flex-direction: column; gap: 4px; }
    .demo-type25 .demo-description-box .demo-title { font-size: 1.0625rem; }
  `,
  View: ({ values }) => {
    const perRow = PER_ROW.includes(str(values.perRow)) ? str(values.perRow) : "4";
    return (
      <section className="demo-block demo-type25">
        <div className="demo-inner">
          <TitleBlock values={values} />
          <div className="demo-list-wrap">
            <ul className={`demo-column-list demo-cols-${perRow}`}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="demo-list-item">
                  <Pictures image={item.image} imageMobile={item.imageMobile} />
                  <div className="demo-description-box">
                    {str(item.title).trim() !== "" && <p className="demo-title" {...richProps(item.title)} />}
                    {str(item.text).trim() !== "" && <p className="demo-desc" {...richProps(item.text)} />}
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

export { type25 };
