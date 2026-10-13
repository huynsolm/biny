import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 15: 이미지가 위에 놓인 3칸 목록. 칸마다 제목과, 하위 목록이 있으면 글머리 목록을, 없으면 문단을 보여 준다.
const type15: CmsType = {
  id: "type15",
  number: "15",
  label: "타입 15 · 이미지 3칸 목록 (글머리 또는 문단)",
  fields: [
    titleField,
    listField("contents", "칸", "칸", [
      { kind: "text", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "문단 (글머리가 없을 때 보여요)" },
      ...imageFields(),
      listField("subtext", "글머리", "글머리", [{ kind: "text", key: "text", label: "글" }], 0, 8),
    ]),
  ],
  defaults: {
    title: titleDefault,
    contents: [
      { tit: "칸 1", text: "설명을 입력해 보세요.", ...imageDefaults, subtext: [{ text: "글머리 1" }, { text: "글머리 2" }] },
      { tit: "칸 2", text: "글머리가 없으면 이 문단이 보여요.", ...imageDefaults, subtext: [] },
      { tit: "칸 3", text: "설명을 입력해 보세요.", ...imageDefaults, subtext: [{ text: "글머리 1" }] },
    ],
  },
  css: `
    .demo-type15 .demo-column-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 20px; }
    .demo-type15 .demo-column-list > .demo-list-item { display: flex; flex-direction: column; gap: 12px; }
    .demo-type15 .demo-description-box { display: flex; flex-direction: column; gap: 6px; }
    .demo-type15 .demo-title { font-size: 1.125rem; }
    .demo-type15 .demo-bullet-list { padding-left: 1.1rem; list-style: disc; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type15">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ul className="demo-column-list">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="demo-list-item">
                  <Pictures image={item.image} imageMobile={item.imageMobile} />
                  <div className="demo-description-box">
                    <p className="demo-title">{str(item.tit)}</p>
                    {subtexts.length > 0 ? (
                      <ul className="demo-bullet-list">
                        {subtexts.map((sub, subIndex) => (
                          <li key={subIndex} className="demo-list-item demo-desc">
                            {str(sub.text)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="demo-desc" {...richProps(item.text)} />
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

export { type15 };
