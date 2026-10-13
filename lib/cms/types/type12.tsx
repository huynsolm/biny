/* eslint-disable @next/next/no-img-element -- HTML 소스를 만들기 위한 데모 마크업이라 next/image를 쓰지 않는다 */
import { items, mobileImage, pcImage, richProps, str, type CmsType } from "../type";
import { TitleBlock, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 12: 어두운 바탕의 3칸 목록. 칸마다 아이콘(PC/모바일)과 글이 있다.
const type12: CmsType = {
  id: "type12",
  number: "12",
  label: "타입 12 · 어두운 바탕의 아이콘 3칸 목록",
  fields: [
    titleField,
    listField("contents", "칸", "칸", [{ kind: "rich", key: "text", label: "글" }, ...imageFields()]),
  ],
  defaults: {
    title: titleDefault,
    contents: [1, 2, 3].map((n) => ({ text: `칸 ${n} 내용을 입력해 보세요.`, ...imageDefaults })),
  },
  css: `
    .demo-type12 { background: #1d2733; border-color: #1d2733; color: #ffffff; }
    .demo-type12 .demo-header { border-top-color: #ffffff; }
    .demo-type12 .demo-eyebrow { color: #9db8d6; }
    .demo-type12 .demo-column-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 16px; }
    .demo-type12 .demo-inner-box { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 20px; border: 1px solid #3b4a5c; background: #26323f; }
    .demo-type12 .demo-icon img { width: 64px; height: auto; }
    .demo-type12 .demo-desc { color: #e6ebf0; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type12">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <div className="demo-list-wrap">
          <ul className="demo-column-list">
            {items(values.contents).map((item, index) => (
              <li key={index} className="demo-list-item">
                <div className="demo-inner-box">
                  <div className="demo-icon">
                    {str(item.image).trim() !== "" && <img className="demo-pc-only" src={pcImage(item.image)} alt="" />}
                    {str(item.imageMobile).trim() !== "" && (
                      <img className="demo-mobile-only" src={mobileImage(item.imageMobile)} alt="" />
                    )}
                  </div>
                  <div className="demo-description-box">
                    <p className="demo-desc" {...richProps(item.text)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  ),
};

export { type12 };
