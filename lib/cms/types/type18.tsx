import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 18과 같은 HTML을 만든다: 이미지가 위에 놓이고 그 아래 번호, 제목, 설명이 붙는 3칸 목록. 비어 있는 글은 넣지 않는다.
// 선택 변형은 글 스타일(원본 값 text-type-1 / text-type-3)이다. 원본은 모바일 이미지를 PC 이미지가 있을 때만 보여 준다.
const STYLES = ["text-type-1", "text-type-3"];

const type18: CmsType = {
  id: "type18",
  number: "18",
  label: "타입 18 · 이미지 + 번호·제목·설명 3칸 목록 (글 스타일 선택)",
  fields: [
    titleField,
    {
      kind: "select",
      key: "textStyle",
      label: "글 스타일",
      options: [
        { value: "text-type-1", label: "일반" },
        { value: "text-type-3", label: "번호에 위아래 선" },
      ],
    },
    listField("contents", "칸", "칸", [
      ...imageFields(),
      { kind: "rich", key: "num", label: "번호" },
      { kind: "rich", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    textStyle: "text-type-1",
    contents: [1, 2, 3].map((n) => ({ ...imageDefaults, num: `0${n}`, tit: `칸 ${n} 제목`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .type18 .cms-img-list { row-gap: 24px; }
    .type18 .cms-visual { margin-bottom: 12px; }
    .type18 .cms-visual-text { display: flex; flex-direction: column; gap: 4px; }
    .type18 .cms-visual-text .cms-title { font-size: 1.125rem; }
    .type18 .text-type-3 .cms-visual-text .cms-eyebrow { align-self: flex-start; min-width: 3rem; padding: 4px 8px; border-top: 1px solid #3a6ea5; border-bottom: 1px solid #3a6ea5; }
    .type18 .text-type-3 .cms-visual-text .cms-description { font-weight: 600; color: #1d2733; }
  `,
  View: ({ values }) => {
    const style = STYLES.includes(str(values.textStyle)) ? str(values.textStyle) : "text-type-1";
    return (
      <section className="cms type18">
        <div className="cms-inner">
          <CmsHeader values={values} />
          <div className="cms-list-wrap">
            <ol className={`cms-img-list  ${style} row`}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="cms-list-item col-6 col-lg-4">
                  <div className="cms-visual">
                    <Img value={item.image} kind="pc" className="img-fluid d-none d-lg-block" />
                    <Img
                      value={item.imageMobile}
                      kind="mobile"
                      className="w-100 d-block d-lg-none"
                      gate={str(item.image).trim() !== ""}
                    />
                  </div>
                  <div className="cms-visual-text">
                    {str(item.num).trim() !== "" && <p className="cms-eyebrow" {...richProps(item.num)} />}
                    {str(item.tit).trim() !== "" && <p className="cms-title" {...richProps(item.tit)} />}
                    {str(item.text).trim() !== "" && <p className="cms-description" {...richProps(item.text)} />}
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

export { type18 };
