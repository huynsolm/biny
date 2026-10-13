import { richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, titleDefault, titleField } from "./parts";

// 원본 타입 23: 제목 아래 가운데 정렬 글(있으면)과 이미지 한 장. 큰 제목이나 글이 비어 있으면 넣지 않는다.
const type23: CmsType = {
  id: "type23",
  number: "23",
  label: "타입 23 · 제목 + 가운데 정렬 글 + 이미지 한 장",
  fields: [titleField, { kind: "rich", key: "text", label: "가운데 정렬 글 (비우면 없음)" }, ...imageFields()],
  defaults: {
    title: titleDefault,
    text: "가운데에 놓을 설명을 입력해 보세요.",
    ...imageDefaults,
  },
  css: `
    .demo-type23 .demo-center { text-align: center; }
    .demo-type23 .demo-center .demo-desc { font-size: 1.0625rem; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type23">
      <div className="demo-inner">
        <TitleBlock values={values} />
        {str(values.text).trim() !== "" && (
          <div className="demo-description-box demo-center">
            <p className="demo-desc" {...richProps(values.text)} />
          </div>
        )}
        <Pictures image={values.image} imageMobile={values.imageMobile} />
      </div>
    </section>
  ),
};

export { type23 };
