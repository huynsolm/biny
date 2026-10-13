import { DEFAULT_IMAGE_SRC, DEFAULT_MOBILE_IMAGE_SRC } from "../html";
import { richProps, type CmsType } from "../type";
import { Img } from "./parts";

// 원본 타입 01과 같은 HTML을 만든다(클래스 이름, 요소 중첩, 이미지가 비어 있으면 넣지 않는 조건).
// 머리글은 이 타입만 top-border 없이 cms-thin-title 하나다. 이미지 alt는 원본의 의미 없는 "box" 대신 빈 값이다.
const type01: CmsType = {
  id: "type01",
  number: "01",
  label: "타입 01 · 이미지 한 장 + 제목 + 설명",
  fields: [
    { kind: "rich", key: "title", label: "제목" },
    { kind: "image", key: "image", label: "PC 이미지 주소", device: "pc" },
    { kind: "image", key: "imageMobile", label: "모바일 이미지 주소", device: "mobile" },
    { kind: "rich", key: "description", label: "설명" },
  ],
  defaults: {
    title: "제목을 입력해 보세요",
    image: DEFAULT_IMAGE_SRC,
    imageMobile: DEFAULT_MOBILE_IMAGE_SRC,
    description: "입력한 내용이 HTML 소스와 미리보기에 바로 반영돼요.",
  },
  css: `
    .type01 .cms-inner { gap: 16px; }
    .type01 .cms-visual img { width: 100%; height: auto; }
  `,
  View: ({ values }) => (
    <section className="cms type01">
      <div className="cms-inner">
        <div className="cms-header">
          <p className="cms-thin-title" {...richProps(values.title)} />
        </div>
        <div className="cms-visual">
          <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
          <Img value={values.imageMobile} kind="mobile" className="w-100 d-block d-lg-none" />
        </div>
        <div className="cms-description-box">
          <p className="cms-description larger" {...richProps(values.description)} />
        </div>
      </div>
    </section>
  ),
};

export { type01 };
