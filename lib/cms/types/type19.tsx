import { items, richProps, str, type CmsType } from "../type";
import { TitleBlock, listField, titleDefault, titleField } from "./parts";

// 원본 타입 19: 육각형 안에 번호와 글이 들어가고, 항목 사이가 선으로 이어지는 가로 목록.
// 원본의 육각형 SVG 경로는 가져오지 않고 CSS clip-path로 새로 그렸다.
const type19: CmsType = {
  id: "type19",
  number: "19",
  label: "타입 19 · 육각형 번호 목록 (항목 사이 선)",
  fields: [
    titleField,
    listField("contents", "항목", "항목", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "rich", key: "text", label: "글" },
    ]),
  ],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3, 4].map((n) => ({ num: `0${n}`, text: `${n}단계` })),
  },
  css: `
    .demo-type19 .demo-figure-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .demo-type19 .demo-list-item { position: relative; display: flex; justify-content: center; }
    .demo-type19 .demo-hexagon { display: flex; align-items: center; justify-content: center; width: 100%; max-width: 11rem; aspect-ratio: 1.13 / 1; text-align: center; background: #3a6ea5; color: #ffffff; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); }
    .demo-type19 .demo-figure-text { display: flex; flex-direction: column; gap: 2px; padding: 0 14px; }
    .demo-type19 .demo-hexagon .demo-eyebrow { margin: 0; color: #cfe0f3; }
    .demo-type19 .demo-hexagon .demo-desc { color: #ffffff; font-weight: 600; }
    @media (min-width: 48rem) {
      .demo-type19 .demo-figure-list { grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); }
      .demo-type19 .demo-list-item + .demo-list-item::before { content: ""; position: absolute; top: 50%; right: calc(50% + 5.5rem); width: calc(100% - 11rem); height: 1px; background: #3a6ea5; }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type19">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ol className="demo-figure-list">
            {items(values.contents).map((item, index) => (
              <li key={index} className="demo-list-item">
                <div className="demo-figure demo-hexagon">
                  <div className="demo-figure-text">
                    <p className="demo-eyebrow">{str(item.num)}</p>
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

export { type19 };
