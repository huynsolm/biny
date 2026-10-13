import { items, richProps, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 12와 같은 HTML을 만든다: 어두운 바탕의 3칸 목록. 칸마다 아이콘(PC/모바일)과 글이 있다.
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
    .type12 .cms-column-list { row-gap: 16px; }
    .type12 .cms-inner-box { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 20px; border: 1px solid #3b4a5c; background: #26323f; }
    .type12 .cms-icon img { width: 64px; height: auto; }
  `,
  View: ({ values }) => (
    <section className="cms type12 type-bg bg-image-2 text-white">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-list-wrap">
          <ul className="cms-column-list item-bg-box text-type-1 row">
            {items(values.contents).map((item, index) => (
              <li key={index} className="cms-list-item col-12 col-lg-4">
                <div className="cms-inner-box">
                  <div className="cms-icon">
                    <Img value={item.image} kind="pc" className="d-none d-lg-block" />
                    <Img value={item.imageMobile} kind="mobile" className="d-block d-lg-none" />
                  </div>
                  <div className="cms-description-box">
                    <p className="cms-description" {...richProps(item.text)} />
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
