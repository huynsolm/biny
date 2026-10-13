/* eslint-disable @next/next/no-img-element -- HTML 소스를 만들기 위한 데모 마크업이라 next/image를 쓰지 않는다 */
import { items, mobileImage, pcImage, richProps, str, type CmsType } from "../type";
import { TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 06: 어두운 바탕의 칸 목록. 칸마다 아이콘(PC/모바일), 글, 그리고 있으면 글머리 목록(하위 목록)이 있다.
// 하위 목록이 있는 칸은 글을 굵게 보여 주고, 없는 칸은 일반 글로 보여 준다.
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
    .demo-type06 { background: #1d2733; border-color: #1d2733; color: #ffffff; }
    .demo-type06 .demo-header { border-top-color: #ffffff; }
    .demo-type06 .demo-eyebrow { color: #9db8d6; }
    .demo-type06 .demo-column-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: 16px; }
    .demo-type06 .demo-inner-box { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 16px; border: 1px solid #3b4a5c; }
    .demo-type06 .demo-icon img { width: 56px; height: auto; }
    .demo-type06 .demo-desc { color: #d7dee6; }
    .demo-type06 .demo-desc strong { color: #ffffff; }
    .demo-type06 .demo-bullet-list { margin: 8px 0 0; padding-left: 1.1rem; list-style: disc; }
    .demo-type06 .demo-bullet-list .demo-list-item { color: #d7dee6; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type06">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ul className="demo-column-list">
            {items(values.contents).map((item, index) => {
              const subtexts = items(item.subtext);
              return (
                <li key={index} className="demo-list-item">
                  <div className="demo-inner-box">
                    <div className="demo-icon">
                      {str(item.image).trim() !== "" && <img className="demo-pc-only" src={pcImage(item.image)} alt="" />}
                      {str(item.imageMobile).trim() !== "" && (
                        <img className="demo-mobile-only" src={mobileImage(item.imageMobile)} alt="" />
                      )}
                    </div>
                    {subtexts.length > 0 ? (
                      <div className="demo-description-box">
                        <p className="demo-desc">
                          <strong {...richProps(item.text)} />
                        </p>
                        <ul className="demo-bullet-list">
                          {subtexts.map((sub, subIndex) => (
                            <li key={subIndex} className="demo-list-item demo-desc">
                              {str(sub.text)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="demo-description-box">
                        <p className="demo-desc" {...richProps(item.text)} />
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
