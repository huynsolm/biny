import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 22와 같은 HTML을 만든다: 이미지 아래에 제목과 짧은 목록이 붙는 4칸 목록. 비어 있는 제목과 하위 목록은 넣지 않는다.
// 원본은 모바일 이미지를 PC 이미지가 있을 때만 보여 준다.
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
    .type22 .cms-img-list { row-gap: 20px; }
    .type22 .cms-visual { margin-bottom: 10px; }
    .type22 .cms-visual-text { display: flex; flex-direction: column; gap: 6px; }
    .type22 .cms-visual-text .cms-title { font-size: 1.0625rem; }
    .type22 .list-unstyled { color: #4a5766; font-size: 0.9375rem; }
  `,
  View: ({ values }) => (
    <section className="cms type22">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ul className="cms-img-list text-bottom text-type-2 row">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="cms-list-item col-6 col-lg-3">
                  <div className="cms-visual">
                    <Img value={item.image} kind="pc" className="img-fluid d-none d-lg-block" />
                    <Img
                      value={item.imageMobile}
                      kind="mobile"
                      className="w-100 d-block d-lg-none"
                      gate={str(item.image).trim() !== ""}
                    />
                  </div>
                  <div className="cms-visual-text">
                    {str(item.title).trim() !== "" && <p className="cms-title" {...richProps(item.title)} />}
                    {subtexts.length > 0 && (
                      <ul className="list-unstyled">
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
