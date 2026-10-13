import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 22: 이미지 아래에 제목과 짧은 목록이 붙는 4칸 목록. 비어 있는 제목과 하위 목록은 넣지 않는다.
const type22: CmsType = {
  id: "type22",
  number: "22",
  label: "타입 22 · 이미지 4칸 목록 (제목 + 짧은 목록)",
  fields: [
    titleField,
    listField("contents", "칸", "칸", [
      ...imageFields(),
      { kind: "rich", key: "title", label: "제목" },
      listField("subtext", "짧은 목록", "목록", [{ kind: "text", key: "text", label: "글" }], 0, 8),
    ]),
  ],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3, 4].map((n) => ({
      ...imageDefaults,
      title: `칸 ${n}`,
      subtext: n <= 2 ? [{ text: "짧은 설명 1" }, { text: "짧은 설명 2" }] : [],
    })),
  },
  css: `
    .demo-type22 .demo-img-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .demo-type22 .demo-img-list > .demo-list-item { display: flex; flex-direction: column; gap: 10px; }
    .demo-type22 .demo-visual-text { display: flex; flex-direction: column; gap: 6px; }
    .demo-type22 .demo-visual-text .demo-title { font-size: 1.0625rem; }
    .demo-type22 .demo-unstyled-list { color: #4a5766; font-size: 0.9375rem; }
    @media (min-width: 48rem) {
      .demo-type22 .demo-img-list { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type22">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ul className="demo-img-list">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="demo-list-item">
                  <Pictures image={item.image} imageMobile={item.imageMobile} />
                  <div className="demo-visual-text">
                    {str(item.title).trim() !== "" && <p className="demo-title" {...richProps(item.title)} />}
                    {subtexts.length > 0 && (
                      <ul className="demo-unstyled-list">
                        {subtexts.map((sub, subIndex) => (
                          <li key={subIndex}>{str(sub.text)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  ),
};

export { type22 };
