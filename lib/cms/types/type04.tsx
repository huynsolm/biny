import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 04와 같은 HTML을 만든다: 항목 사이에 화살표(between-arrow)가 있는 이미지와 글 목록. 항목 제목은 글자만 받는다.
const type04: CmsType = {
  id: "type04",
  number: "04",
  label: "타입 04 · 이미지와 글, 항목 사이 화살표",
  fields: [
    titleField,
    listField("contents", "항목", "항목", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "text", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
      ...imageFields(),
    ]),
  ],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3].map((n) => ({ num: `0${n}`, tit: `항목 ${n} 제목`, text: "설명을 입력해 보세요.", ...imageDefaults })),
  },
  css: `
    .type04 .cms-tile-list { display: flex; flex-direction: column; gap: 44px; }
    .type04 .between-arrow > .cms-list-item { position: relative; }
    .type04 .between-arrow > .cms-list-item + .cms-list-item::before { content: ""; position: absolute; top: -32px; left: 50%; width: 14px; height: 14px; border-right: 3px solid #3a6ea5; border-bottom: 3px solid #3a6ea5; transform: translateX(-50%) rotate(45deg); }
    .type04 .cms-box-inner { display: flex; flex-direction: column; gap: 6px; }
    .type04 .cms-box-inner .cms-title { font-size: 1.25rem; }
  `,
  View: ({ values }) => (
    <section className="cms type04">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ol className="cms-tile-list between-arrow text-type-2">
            {items(values.contents).map((item, index) => (
              <li key={index} className="cms-list-item row align-items-center">
                <div className="cms-visual col-lg-6">
                  <Img value={item.image} kind="pc" className="img-fluid d-none d-lg-block" />
                  <Img value={item.imageMobile} kind="mobile" className="img-fluid d-block d-lg-none" />
                </div>
                <div className="cms-description-box col-lg-6">
                  <div className="cms-box-inner">
                    <p className="cms-eyebrow">{str(item.num)}</p>
                    <p className="cms-title">{str(item.tit)}</p>
                    <p className="cms-description" {...richProps(item.text)} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  ),
};

export { type04 };
