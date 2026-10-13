/* eslint-disable @next/next/no-img-element -- HTML 소스를 만들기 위한 데모 마크업이라 next/image를 쓰지 않는다 */
import { DEFAULT_IMAGE_SRC } from "../html";
import { items, pcImage, richProps, str, type CmsType } from "../type";
import { TitleBlock, listField, titleDefault, titleField } from "./parts";

// 원본 타입 16: 제목 + 큰 이미지(PC) / 도형 안의 글(모바일) + 이미지 아이콘이 붙은 2칸 목록.
// 큰 이미지는 PC에서만, 도형은 모바일에서만 보인다. 항목의 아이콘은 한 장이다.
const type16: CmsType = {
  id: "type16",
  number: "16",
  label: "타입 16 · PC 큰 이미지 / 모바일 도형 + 아이콘 2칸 목록",
  fields: [
    titleField,
    { kind: "text", key: "imageTit", label: "모바일 도형 안의 글" },
    { kind: "image", key: "imagePc", label: "PC 큰 이미지 주소", device: "pc" },
    listField("contents", "칸", "칸", [
      { kind: "text", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
      { kind: "image", key: "icon", label: "아이콘 이미지 주소" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    imageTit: "핵심 문구",
    imagePc: DEFAULT_IMAGE_SRC,
    contents: [1, 2, 3, 4].map((n) => ({ tit: `칸 ${n}`, text: "설명을 입력해 보세요.", icon: DEFAULT_IMAGE_SRC })),
  },
  css: `
    .demo-type16 .demo-hexagon { display: flex; align-items: center; justify-content: center; width: 12rem; max-width: 100%; margin: 0 auto; aspect-ratio: 1.13 / 1; text-align: center; background: #3a6ea5; color: #ffffff; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); }
    .demo-type16 .demo-hexagon .demo-title { padding: 0 20px; font-size: 1.125rem; }
    .demo-type16 .demo-column-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .demo-type16 .demo-column-list > .demo-list-item { display: flex; flex-direction: column; gap: 10px; }
    .demo-type16 .demo-icon img { width: 56px; height: auto; }
    .demo-type16 .demo-description-box { display: flex; flex-direction: column; gap: 4px; }
    .demo-type16 .demo-description-box .demo-title { font-size: 1.125rem; }
    @media (min-width: 48rem) {
      .demo-type16 .demo-mobile-only { display: none; }
      .demo-type16 .demo-column-list { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type16">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-visual">
          {str(values.imagePc).trim() !== "" && <img className="demo-pc-only" src={pcImage(values.imagePc)} alt="" />}
          <div className="demo-figure demo-hexagon demo-mobile-only">
            <div className="demo-figure-text">
              <p className="demo-title">{str(values.imageTit)}</p>
            </div>
          </div>
        </div>
        <div className="demo-list-wrap">
          <ul className="demo-column-list">
            {items(values.contents).map((item, index) => (
              <li key={index} className="demo-list-item">
                {str(item.icon).trim() !== "" && (
                  <div className="demo-icon">
                    <img src={pcImage(item.icon)} alt="" />
                  </div>
                )}
                <div className="demo-description-box">
                  <p className="demo-title">{str(item.tit)}</p>
                  <p className="demo-desc" {...richProps(item.text)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  ),
};

export { type16 };
