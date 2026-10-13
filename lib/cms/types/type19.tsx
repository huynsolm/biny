import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, HexagonSvg, listField, titleDefault, titleField } from "./parts";

// 원본 타입 19와 같은 HTML을 만든다: 육각형 안에 번호와 글이 들어가고, 항목 사이가 선으로 이어지는 가로 목록.
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
    .type19 .cms-figure-list { row-gap: 20px; justify-content: flex-start; }
    .type19 .cms-list-item { display: flex; justify-content: center; }
    .type19 .cms-figure.hexagon { position: relative; width: 11rem; max-width: 100%; height: 9.7rem; }
    .type19 .cms-figure.hexagon svg { display: block; width: 100%; height: 100%; }
    .type19 .cms-figure.hexagon .cls-1 { fill: #3a6ea5; }
    .type19 .cms-figure-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 14px; text-align: center; color: #ffffff; }
    .type19 .cms-figure-text .cms-eyebrow { margin: 0; color: #cfe0f3; }
    .type19 .cms-figure-text .cms-description { color: #ffffff; font-weight: 600; }
    @media (min-width: 992px) {
      .type19 .item-between-border > .cms-list-item { position: relative; }
      .type19 .item-between-border > .cms-list-item + .cms-list-item::before { content: ""; position: absolute; top: 50%; left: -2.5rem; width: 5rem; height: 1px; background: #3a6ea5; }
    }
  `,
  View: ({ values }) => (
    <section className="cms type19">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ol className="cms-figure-list item-between-border text-type-2 row justify-content-left">
            {items(values.contents).map((item, index) => (
              <li key={index} className="cms-list-item col-6 col-lg">
                <div className="cms-figure hexagon">
                  <HexagonSvg />
                  <div className="cms-figure-text">
                    <p className="cms-eyebrow">{str(item.num)}</p>
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

export { type19 };
