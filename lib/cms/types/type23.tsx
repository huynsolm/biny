import { richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, titleDefault, titleField } from "./parts";

// 원본 타입 23과 같은 HTML을 만든다: 제목 아래 가운데 정렬 글(있으면)과 이미지 한 장. 큰 제목이나 글이 비어 있으면 넣지 않는다.
// 원본은 모바일 이미지를 PC 이미지가 있을 때만 보여 준다.
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
    .type23 .text-center .cms-description { font-size: 1.0625rem; }
  `,
  View: ({ values }) => (
    <section className="cms type23">
      <div className="cms-inner">
        <CmsHeader values={values} hideEmptyBig />
        {str(values.text).trim() !== "" && (
          <div className="cms-description-box text-center">
            <p className="cms-description" {...richProps(values.text)} />
          </div>
        )}
        <div className="cms-visual">
          <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
          <Img
            value={values.imageMobile}
            kind="mobile"
            className="w-100 d-block d-lg-none"
            gate={str(values.image).trim() !== ""}
          />
        </div>
      </div>
    </section>
  ),
};

export { type23 };
