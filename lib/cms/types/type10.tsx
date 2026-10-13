import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, HexagonSvg, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 10과 같은 HTML을 만든다: 제목 + 큰 이미지 한 장 + 육각형 번호 목록. 원본은 contents[0]의 이미지만 쓰므로 최상위로 편다.
const type10: CmsType = {
  id: "type10",
  number: "10",
  label: "타입 10 · 큰 이미지 + 육각형 번호 목록",
  fields: [
    titleField,
    ...imageFields(),
    listField("contents", "항목", "항목", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "text", key: "title", label: "핵심 단어" },
      { kind: "text", key: "sTitle", label: "소제목" },
      { kind: "rich", key: "text", label: "설명" },
      listField("subtext", "목록", "목록", [{ kind: "text", key: "text", label: "글" }], 0, 8),
    ]),
  ],
  defaults: {
    title: titleDefault,
    ...imageDefaults,
    contents: [
      { num: "01", title: "핵심 단어", sTitle: "소제목", text: "설명을 입력해 보세요.", subtext: [{ text: "목록 1" }, { text: "목록 2" }] },
      { num: "02", title: "핵심 단어", sTitle: "소제목", text: "설명을 입력해 보세요.", subtext: [] },
      { num: "03", title: "핵심 단어", sTitle: "소제목", text: "설명을 입력해 보세요.", subtext: [] },
    ],
  },
  css: `
    .type10 .cms-figure-list { display: flex; flex-direction: column; gap: 24px; }
    .type10 .cms-figure.hexagon { position: relative; width: 12rem; height: 10.6rem; margin-bottom: 12px; }
    .type10 .cms-figure.hexagon svg { display: block; width: 100%; height: 100%; }
    .type10 .cms-figure.hexagon .cls-1 { fill: #3a6ea5; }
    .type10 .cms-figure-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #ffffff; }
    .type10 .cms-figure-text .cms-eyebrow { margin: 0; color: #cfe0f3; }
    .type10 .cms-figure-text .cms-title { font-size: 1.125rem; color: #ffffff; }
    .type10 .cms-border-list { margin-top: 12px; row-gap: 8px; }
    .type10 .cms-border-list .cms-list-item { padding-top: 0; }
    .type10 .cms-border-list .cms-title { padding: 4px 12px; border: 1px solid #3a6ea5; font-size: 1rem; }
  `,
  View: ({ values }) => (
    <section className="cms type10">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-visual mobile-expanded">
          <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
          <Img value={values.imageMobile} kind="mobile" className="w-100 d-block d-lg-none" />
        </div>
        <div className="cms-list-wrap">
          <ol className="cms-figure-list text-type-1">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="cms-list-item">
                  <div className="row align-items-center">
                    <div className="cms-figure hexagon col-lg-auto">
                      <HexagonSvg />
                      <div className="cms-figure-text">
                        <p className="cms-eyebrow">{str(item.num)}</p>
                        <p className="cms-title">{str(item.title)}</p>
                      </div>
                    </div>
                    <div className="cms-description-box col-lg">
                      <p className="cms-eyebrow">{str(item.sTitle)}</p>
                      <p className="cms-description" {...richProps(item.text)} />
                      {subtexts.length > 0 && (
                        <ul className="cms-border-list text-type-2 row">
                          {subtexts.map((sub, subIndex) => (
                            <li key={subIndex} className="cms-list-item col-6 col-lg-auto">
                              <p className="cms-title">{str(sub.text)}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  ),
};

export { type10 };
