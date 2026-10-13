import { DEFAULT_IMAGE_SRC } from "../html";
import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, HexagonSvg, Img, listField, titleDefault, titleField } from "./parts";

// 원본 타입 16과 같은 HTML을 만든다: 제목 + 큰 이미지(PC) / 도형 안의 글(모바일) + 이미지 아이콘이 붙은 2칸 목록.
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
    .type16 .cms-figure.hexagon { position: relative; width: 12rem; height: 10.6rem; margin: 0 auto; }
    .type16 .cms-figure.hexagon svg { display: block; width: 100%; height: 100%; }
    .type16 .cms-figure.hexagon .cls-1 { fill: #3a6ea5; }
    .type16 .cms-figure-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 0 20px; text-align: center; color: #ffffff; }
    .type16 .cms-figure-text .cms-title { font-size: 1.125rem; color: #ffffff; }
    .type16 .cms-column-list { row-gap: 20px; }
    .type16 .cms-icon { margin-bottom: 10px; }
    .type16 .cms-icon img { width: 56px; height: auto; }
    .type16 .cms-description-box { display: flex; flex-direction: column; gap: 4px; }
    .type16 .cms-description-box .cms-title { font-size: 1.125rem; }
    @media (min-width: 992px) {
      .type16 .cms-column-list > .cms-list-item { flex: 0 0 25%; width: 25%; }
    }
  `,
  View: ({ values }) => (
    <section className="cms type16">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-visual">
          <Img value={values.imagePc} kind="pc" className="img-fluid d-none d-lg-block" />
          <div className="cms-figure hexagon d-block d-lg-none">
            <HexagonSvg />
            <div className="cms-figure-text">
              <p className="cms-title">{str(values.imageTit)}</p>
            </div>
          </div>
        </div>
        <div className="cms-list-wrap cms-desktop-rs-only">
          <ul className="cms-column-list text-type-1 row">
            {items(values.contents).map((item, index) => (
              <li key={index} className="cms-list-item col-6">
                <div className="cms-icon">
                  <Img value={item.icon} kind="pc" className="" />
                </div>
                <div className="cms-description-box">
                  <p className="cms-title">{str(item.tit)}</p>
                  <p className="cms-description" {...richProps(item.text)} />
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
