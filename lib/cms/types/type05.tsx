import type { CmsType } from "../type";
import { Pictures, TitleBlock, imageDefaults, imageFields, titleDefault, titleField } from "./parts";

// 원본 타입 05: 제목 + 큰 이미지 한 장(PC/모바일).
const type05: CmsType = {
  id: "type05",
  number: "05",
  label: "타입 05 · 제목 + 이미지 한 장",
  fields: [titleField, ...imageFields()],
  defaults: { title: titleDefault, ...imageDefaults },
  css: `
    .demo-type05 { background: #eef3f9; }
  `,
  View: ({ values }) => (
    <section className="demo-block demo-type05">
      <div className="demo-inner">
        <TitleBlock values={values} />
        <Pictures image={values.image} imageMobile={values.imageMobile} />
      </div>
    </section>
  ),
};

export { type05 };
