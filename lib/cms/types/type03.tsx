import { items, richProps, str, type CmsType } from "../type";
import { CmsHeader, Img, imageDefaults, imageFields, listField, titleDefault, titleField } from "./parts";

// 원본 타입 03과 같은 HTML을 만든다. 선택 변형은 원본 값 그대로 ""(일반) / "reverse"(반전)이고,
// 원본처럼 목록 클래스 끝에 이 값이 붙는다(일반이면 끝에 공백이 남는다). 목록에 없는 값은 일반으로 바꾼다.
const LAYOUTS = ["", "reverse"];

const type03: CmsType = {
  id: "type03",
  number: "03",
  label: "타입 03 · 이미지와 글 지그재그 목록",
  fields: [
    titleField,
    {
      kind: "select",
      key: "layout",
      label: "배치",
      options: [
        { value: "", label: "일반 (이미지가 왼쪽부터)" },
        { value: "reverse", label: "반전 (이미지가 오른쪽부터)" },
      ],
    },
    listField("contents", "항목", "항목", [
      { kind: "text", key: "num", label: "번호" },
      { kind: "rich", key: "tit", label: "제목" },
      { kind: "rich", key: "text", label: "설명" },
      ...imageFields(),
    ]),
  ],
  defaults: {
    title: titleDefault,
    layout: "",
    contents: [1, 2].map((n) => ({ num: `0${n}`, tit: `항목 ${n} 제목`, text: "설명을 입력해 보세요.", ...imageDefaults })),
  },
  css: `
    .type03 .cms-tile-list { display: flex; flex-direction: column; gap: 24px; }
    .type03 .cms-box-inner { display: flex; flex-direction: column; gap: 6px; }
    .type03 .cms-box-inner .cms-title { font-size: 1.25rem; }
    @media (min-width: 992px) {
      .type03 .array-zigzag > .cms-list-item:nth-child(even) .cms-visual { order: 2; }
      .type03 .array-zigzag.reverse > .cms-list-item:nth-child(odd) .cms-visual { order: 2; }
      .type03 .array-zigzag.reverse > .cms-list-item:nth-child(even) .cms-visual { order: 0; }
    }
  `,
  View: ({ values }) => {
    const selected = LAYOUTS.includes(str(values.layout)) ? str(values.layout) : "";
    return (
      <section className="cms type03">
        <div className="cms-inner">
          <CmsHeader values={values} />
          <div className="cms-list-wrap">
            <ol className={`cms-tile-list array-zigzag text-type-1 ${selected}`}>
              {items(values.contents).map((item, index) => (
                <li key={index} className="cms-list-item row align-items-center">
                  <div className="cms-visual col-lg-6">
                    <Img value={item.image} kind="pc" className="img-fluid d-none d-lg-block" />
                    <Img value={item.imageMobile} kind="mobile" className="img-fluid d-block d-lg-none" />
                  </div>
                  <div className="cms-description-box col-lg-6">
                    <div className="cms-box-inner">
                      <p className="cms-eyebrow type-number">{str(item.num)}</p>
                      <p className="cms-title" {...richProps(item.tit)} />
                      <p className="cms-description" {...richProps(item.text)} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  },
};

export { type03 };
