import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 15와 같은 HTML을 만든다: 이미지가 위에 놓인 3칸 목록. 칸마다 제목과, 하위 목록이 있으면 글머리 목록을, 없으면 문단을 보여 준다.
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
    .type15 .cms-column-list { row-gap: 20px; }
    .type15 .cms-visual { margin-bottom: 12px; }
    .type15 .cms-description-box { display: flex; flex-direction: column; gap: 6px; }
    .type15 .cms-title { font-size: 1.125rem; }
    .type15 .cms-bullet-list { padding-left: 1.1rem; list-style: disc; }
  `,
  View: ({ values }) => (
    <section className="cms type15">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ul className="cms-column-list text-type-1 row">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="cms-list-item col-12 col-lg-4">
                  <div className="cms-visual">
                    <Img value={item.image} kind="pc" className="img-fluid d-none d-lg-block" />
                    <Img value={item.imageMobile} kind="mobile" className="w-100 d-block d-lg-none" />
                  </div>
                  <div className="cms-description-box">
                    <p className="cms-title">{str(item.tit)}</p>
                    {subtexts.length > 0 ? (
                      <ul className="cms-bullet-list no-margin">
                        {subtexts.map((sub, subIndex) => (
                          <li key={subIndex} className="cms-list-item">
                            <p className="cms-description">{str(sub.text)}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="cms-description" {...richProps(item.text)} />
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
