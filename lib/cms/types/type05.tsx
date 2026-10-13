import type { CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, titleDefault, titleField } from "./parts";

// 원본 타입 05와 같은 HTML을 만든다: 제목 + 큰 이미지 한 장(PC/모바일).
const type05: CmsType = {
  id: "type05",
  number: "05",
  label: "타입 05 · 제목 + 이미지 한 장",
  fields: [titleField, ...imageFields()],
  defaults: { title: titleDefault, ...imageDefaults },
  css: `
    .type05 .cms-visual img { width: 100%; height: auto; }
  `,
  View: ({ values }) => (
    <section className="cms type05 type-bg bg-color-1">
      <div className="cms-inner">
        <CmsHeader values={values} />
        <div className="cms-visual">
          <Img value={values.image} kind="pc" className="img-fluid d-none d-lg-block" />
          <Img value={values.imageMobile} kind="mobile" className="w-100 d-block d-lg-none" />
        </div>
      </div>
    </section>
  ),
};

export { type05 };
