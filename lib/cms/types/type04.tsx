import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 04: 제목 + 이미지와 글 목록. 항목 사이에 화살표가 놓인다. 항목 제목은 글자만 받는다.
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
    .demo-type04 .demo-tile-list { display: flex; flex-direction: column; gap: 44px; }
    .demo-type04 .demo-list-item { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: center; }
    .demo-type04 .demo-list-item + .demo-list-item::before { content: ""; position: absolute; top: -32px; left: 50%; width: 14px; height: 14px; border-right: 3px solid #3a6ea5; border-bottom: 3px solid #3a6ea5; transform: translateX(-50%) rotate(45deg); }
    .demo-type04 .demo-box-inner { display: flex; flex-direction: column; gap: 6px; }
    .demo-type04 .demo-box-inner .demo-title { font-size: 1.25rem; }
    @media (min-width: 48rem) {
      .demo-type04 .demo-list-item { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type04">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ol className="demo-tile-list demo-arrows">
            {items(values.contents).map((item, index) => (
              <li key={index} className="demo-list-item">
                <Pictures image={item.image} imageMobile={item.imageMobile} />
                <div className="demo-description-box">
                  <div className="demo-box-inner">
                    <p className="demo-eyebrow">{str(item.num)}</p>
                    <p className="demo-title">{str(item.tit)}</p>
                    <p className="demo-desc" {...richProps(item.text)} />
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
