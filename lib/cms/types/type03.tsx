import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 03: 제목 + 이미지와 글이 번갈아 놓이는 목록(지그재그). 선택 변형은 시작 방향(일반/반전)이다.
const LAYOUTS = ["normal", "reverse"];

const type03: CmsType = {
  id: "type03",
  number: "03",
  label: "타입 03 · 이미지와 글 지그재그 목록",
  fields: [
    titleField,
    {
      kind: "select",
      key: "layout",
      label: "배치",
      options: [
        { value: "normal", label: "일반 (이미지가 왼쪽부터)" },
        { value: "reverse", label: "반전 (이미지가 오른쪽부터)" },
      ],
    },
    listField("contents", "항목", "항목", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "rich", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
      ...imageFields(),
    ]),
  ],
  defaults: {
    title: titleDefault,
    layout: "normal",
    contents: [1, 2].map((n) => ({ num: `0${n}`, tit: `항목 ${n} 제목`, text: "설명을 입력해 보세요.", ...imageDefaults })),
  },
  css: `
    .demo-type03 .demo-tile-list { display: flex; flex-direction: column; gap: 24px; }
    .demo-type03 .demo-list-item { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: center; }
    .demo-type03 .demo-box-inner { display: flex; flex-direction: column; gap: 6px; }
    .demo-type03 .demo-box-inner .demo-title { font-size: 1.25rem; }
    @media (min-width: 48rem) {
      .demo-type03 .demo-list-item { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
      .demo-type03 .demo-zigzag .demo-list-item:nth-child(even) .demo-visual { order: 2; }
      .demo-type03 .demo-zigzag.demo-reverse .demo-list-item:nth-child(odd) .demo-visual { order: 2; }
      .demo-type03 .demo-zigzag.demo-reverse .demo-list-item:nth-child(even) .demo-visual { order: 0; }
    }
  `,
  View: ({ values }) => {
    const reverse = LAYOUTS.includes(str(values.layout)) && str(values.layout) === "reverse";
    return (
      <section className="demo-block demo-type03">
        <div className="demo-inner">
          <TitleBlock values={values} />
          <div className="demo-list-wrap">
            <ol className={reverse ? "demo-tile-list demo-zigzag demo-reverse" : "demo-tile-list demo-zigzag"}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="demo-list-item">
                  <Pictures image={item.image} imageMobile={item.imageMobile} />
                  <div className="demo-description-box">
                    <div className="demo-box-inner">
                      <p className="demo-eyebrow">{str(item.num)}</p>
                      <p className="demo-title" {...richProps(item.tit)} />
                      <p className="demo-desc" {...richProps(item.text)} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  },
};

export { type03 };
