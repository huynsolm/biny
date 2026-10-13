import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 18: 이미지가 위에 놓이고 그 아래 번호, 제목, 설명이 붙는 3칸 목록. 비어 있는 글은 넣지 않는다.
// 선택 변형은 글 스타일이다. (원본 값은 text-type-1 / text-type-3였고, 의미에 맞게 plain / framed로 쓴다.)
const STYLES = ["plain", "framed"];

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
        { value: "plain", label: "일반" },
        { value: "framed", label: "번호에 위아래 선" },
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
    textStyle: "plain",
    contents: [1, 2, 3].map((n) => ({ ...imageDefaults, num: `0${n}`, tit: `칸 ${n} 제목`, text: "설명을 입력해 보세요." })),
  },
  css: `
    .demo-type18 .demo-img-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 24px; }
    .demo-type18 .demo-img-list > .demo-list-item { display: flex; flex-direction: column; gap: 12px; }
    .demo-type18 .demo-visual-text { display: flex; flex-direction: column; gap: 4px; }
    .demo-type18 .demo-visual-text .demo-title { font-size: 1.125rem; }
    .demo-type18 .demo-text-framed .demo-visual-text .demo-eyebrow { align-self: flex-start; min-width: 3rem; padding: 4px 8px; border-top: 1px solid #3a6ea5; border-bottom: 1px solid #3a6ea5; }
    .demo-type18 .demo-text-framed .demo-visual-text .demo-desc { font-weight: 600; color: #1d2733; }
  `,
  View: ({ values }) => {
    const style = STYLES.includes(str(values.textStyle)) ? str(values.textStyle) : "plain";
    return (
      <section className="demo-block demo-type18">
        <div className="demo-inner">
          <TitleBlock values={values} />
          <div className="demo-list-wrap">
            <ol className={`demo-img-list demo-text-${style}`}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="demo-list-item">
                  <Pictures image={item.image} imageMobile={item.imageMobile} />
                  <div className="demo-visual-text">
                    {str(item.num).trim() !== "" && <p className="demo-eyebrow" {...richProps(item.num)} />}
                    {str(item.tit).trim() !== "" && <p className="demo-title" {...richProps(item.tit)} />}
                    {str(item.text).trim() !== "" && <p className="demo-desc" {...richProps(item.text)} />}
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
