import { items, richProps, str, type CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 10: 제목 + 큰 이미지 한 장 + 육각형 번호 목록. 원본은 contents[0]의 이미지만 위쪽에 쓰므로 이미지는 최상위로 편다.
// 항목마다 육각형 안의 글(번호, 핵심 단어)과 오른쪽 설명(소제목, 설명, 있으면 테두리 목록)이 있다.
// 원본의 육각형 SVG 경로는 가져오지 않고 CSS clip-path로 새로 그렸다.
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
    .demo-type10 .demo-figure-list { display: flex; flex-direction: column; gap: 24px; }
    .demo-type10 .demo-list-item { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: center; }
    .demo-type10 .demo-hexagon { display: flex; align-items: center; justify-content: center; width: 12rem; max-width: 100%; aspect-ratio: 1.13 / 1; text-align: center; background: #3a6ea5; color: #ffffff; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); }
    .demo-type10 .demo-figure-text { display: flex; flex-direction: column; gap: 2px; padding: 0 16px; }
    .demo-type10 .demo-hexagon .demo-eyebrow { margin: 0; color: #cfe0f3; }
    .demo-type10 .demo-hexagon .demo-desc { color: #ffffff; font-weight: 600; }
    .demo-type10 .demo-border-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .demo-type10 .demo-border-list .demo-list-item { display: block; padding: 6px 12px; border: 1px solid #3a6ea5; }
    .demo-type10 .demo-border-list .demo-title { font-size: 1rem; }
    @media (min-width: 48rem) {
      .demo-type10 .demo-list-item { grid-template-columns: 12rem minmax(0, 1fr); gap: 24px; }
    }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type10">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <Pictures image={values.image} imageMobile={values.imageMobile} />
        <div className="demo-list-wrap">
          <ol className="demo-figure-list">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="demo-list-item">
                  <div className="demo-figure demo-hexagon">
                    <div className="demo-figure-text">
                      <p className="demo-eyebrow">{str(item.num)}</p>
                      <p className="demo-desc">{str(item.title)}</p>
                    </div>
                  </div>
                  <div className="demo-description-box">
                    <p className="demo-eyebrow">{str(item.sTitle)}</p>
                    <p className="demo-desc" {...richProps(item.text)} />
                    {subtexts.length > 0 && (
                      <div className="demo-list-wrap">
                        <ul className="demo-border-list">
                          {subtexts.map((sub, subIndex) => (
                            <li key={subIndex} className="demo-list-item">
                              <div className="demo-description-box">
                                <p className="demo-title">{str(sub.text)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
