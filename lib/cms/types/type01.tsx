/* eslint-disable @next/next/no-img-element -- HTML 소스를 만들기 위한 데모 마크업이라 next/image를 쓰지 않는다 */
import { DEFAULT_IMAGE_SRC, DEFAULT_MOBILE_IMAGE_SRC } from "../html";
import { mobileImage, pcImage, richProps, str, type CmsType } from "../type";

// 원본 타입 01의 구조(제목, 이미지 PC/모바일, 설명)를 따른다. 클래스와 CSS, 문구는 새로 썼다.
// 원본처럼 이미지 주소가 비어 있으면 그 이미지는 넣지 않는다.
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
    .demo-type01 .demo-inner { display: flex; flex-direction: column; gap: 16px; }
    .demo-type01 .demo-title { margin: 0; font-size: 1.5rem; font-weight: 300; line-height: 1.3; }
    .demo-type01 .demo-visual img { width: 100%; height: auto; }
    .demo-type01 .demo-desc { margin: 0; font-size: 1.0625rem; color: #4a5766; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type01">
      <div className="demo-inner">
        <div className="demo-header">
          <p className="demo-title" {...richProps(values.title)} />
        </div>
        <div className="demo-visual">
          {str(values.image).trim() !== "" && <img className="demo-pc-only" src={pcImage(values.image)} alt="" />}
          {str(values.imageMobile).trim() !== "" && (
            <img className="demo-mobile-only" src={mobileImage(values.imageMobile)} alt="" />
          )}
        </div>
        <div className="demo-description-box">
          <p className="demo-desc" {...richProps(values.description)} />
        </div>
      </div>
    </section>
  ),
};

export { type01 };
