import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 06과 같은 HTML을 만든다: 어두운 바탕의 4칸 목록. 칸마다 아이콘(PC/모바일)과 글이 있고,
// 하위 목록이 있는 칸은 글을 굵게 보여 주며 글머리 목록을 붙이고, 없는 칸은 일반 글만 보여 준다.
const type06: CmsType = {
  id: "type06",
  number: "06",
  label: "타입 06 · 아이콘 칸 목록 (어두운 바탕)",
  fields: [
    titleField,
    listField("contents", "칸", "칸", [
      { kind: "rich", key: "text", label: "글" },
      ...imageFields(),
      listField("subtext", "글머리", "글머리", [{ kind: "text", key: "text", label: "글" }], 0, 8),
    ]),
  ],
  defaults: {
    title: titleDefault,
    contents: [
      { text: "칸 1", ...imageDefaults, subtext: [{ text: "세부 내용 1" }, { text: "세부 내용 2" }] },
      { text: "칸 2", ...imageDefaults, subtext: [] },
      { text: "칸 3", ...imageDefaults, subtext: [{ text: "세부 내용 1" }] },
      { text: "칸 4", ...imageDefaults, subtext: [] },
    ],
  },
  css: `
    .type06 .cms-column-list > .cms-list-item { margin-bottom: 16px; }
    .type06 .cms-inner-box { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 16px; border: 1px solid #3b4a5c; }
    .type06 .cms-icon img { width: 56px; height: auto; }
    .type06 .cms-description strong { color: #ffffff; }
    .type06 .cms-bullet-list.no-margin { margin: 8px 0 0; padding-left: 1.1rem; list-style: disc; }
  `,
  View: ({ values }) => (
    <section className="cms type06 type-bg bg-image-1 text-white">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ul className="cms-column-list item-bg-box text-type-1 row">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="cms-list-item col-6 col-lg-3">
                  <div className="cms-inner-box">
                    <div className="cms-icon">
                      <Img value={item.image} kind="pc" className="d-none d-lg-block" />
                      <Img value={item.imageMobile} kind="mobile" className="d-block d-lg-none" />
                    </div>
                    {subtexts.length > 0 ? (
                      <div className="cms-description-box">
                        <p className="cms-description">
                          <strong {...richProps(item.text)} />
                        </p>
                        <ul className="cms-bullet-list no-margin">
                          {subtexts.map((sub, subIndex) => (
                            <li key={subIndex} className="cms-list-item cms-description">
                              {str(sub.text)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="cms-description-box">
                        <p className="cms-description" {...richProps(item.text)} />
                      </div>
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

export { type06 };
