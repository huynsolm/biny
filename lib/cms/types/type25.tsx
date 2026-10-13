import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 25와 같은 HTML을 만든다: 이미지 위에 제목과 글이 붙는 목록. 선택 변형은 한 줄에 놓는 칸 수(원본 값 col-lg-3 / col-lg-4)다.
// 원본은 3칸일 때 PC 이미지에 w-100, 4칸일 때 img-fluid를 쓰고, 모바일 이미지는 PC 이미지가 있을 때만 보여 준다.
const COLUMNS = ["col-lg-3", "col-lg-4"];

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
        { value: "col-lg-3", label: "4개" },
        { value: "col-lg-4", label: "3개" },
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
    perRow: "col-lg-3",
    contents: [1, 2, 3, 4].map((n) => ({ ...imageDefaults, title: `칸 ${n} 제목`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .type25 .cms-column-list { row-gap: 20px; }
    .type25 .cms-visual { margin-bottom: 10px; }
    .type25 .cms-description-box { display: flex; flex-direction: column; gap: 4px; }
    .type25 .cms-description-box .cms-title { font-size: 1.0625rem; }
  `,
  View: ({ values }) => {
    const selected = COLUMNS.includes(str(values.perRow)) ? str(values.perRow) : "col-lg-3";
    return (
      <section className="cms type25 type-bg">
        <div className="cms-inner">
          <CmsHeader values={values} />
          <div className="cms-list-wrap">
            <ul className="cms-column-list text-type-2 row">
              {items(values.contents).map((item, index) => (
                <li key={index} className={`cms-list-item col-6 ${selected}`}>
                  <div className="cms-visual">
                    <Img
                      value={item.image}
                      kind="pc"
                      className={selected === "col-lg-3" ? "img-fluid d-none d-lg-block" : "w-100 d-none d-lg-block"}
                    />
                    <Img
                      value={item.imageMobile}
                      kind="mobile"
                      className="w-100 d-block d-lg-none"
                      gate={str(item.image).trim() !== ""}
                    />
                  </div>
                  <div className="cms-description-box">
                    {str(item.title).trim() !== "" && <p className="cms-title" {...richProps(item.title)} />}
                    {str(item.text).trim() !== "" && <p className="cms-description" {...richProps(item.text)} />}
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
