/* eslint-disable @next/next/no-img-element -- HTML 소스를 만들기 위한 데모 마크업이라 next/image를 쓰지 않는다 */
import { DEFAULT_IMAGE_SRC, DEFAULT_MOBILE_IMAGE_SRC } from "../html";
import type { Field, ListField, Values } from "../schema";
import { items, mobileImage, pcImage, richProps, str } from "../type";

// 모든 타입이 같은 모양의 제목(작은 글 + 큰 글 한 쌍)을 쓴다. 원본의 title: [{ small, big }]에 해당한다.
export const titleField: ListField = {
  kind: "list",
  key: "title",
  label: "제목",
  itemLabel: "제목",
  min: 1,
  max: 1,
  fields: [
    { kind: "text", key: "small", label: "작은 글" },
    { kind: "text", key: "big", label: "큰 글" },
  ],
};

// 반복 목록의 입력 정의를 짧게 쓰기 위한 도우미. 맨 위 목록은 1~12개, 하위 목록은 min/max를 직접 준다.
export function listField(key: string, label: string, itemLabel: string, fields: Field[], min = 1, max = 12): ListField {
  return { kind: "list", key, label, itemLabel, min, max, fields };
}

export const titleDefault: Values[] = [{ small: "작은 제목", big: "제목을 입력해 보세요" }];

// PC/모바일 이미지 한 쌍의 입력 정의. 비워 두면 그 이미지는 넣지 않는다.
export function imageFields(pcKey = "image", mobileKey = "imageMobile"): Field[] {
  return [
    { kind: "image", key: pcKey, label: "PC 이미지 주소", device: "pc" },
    { kind: "image", key: mobileKey, label: "모바일 이미지 주소", device: "mobile" },
  ];
}

export const imageDefaults = { image: DEFAULT_IMAGE_SRC, imageMobile: DEFAULT_MOBILE_IMAGE_SRC };

// 타입 13과 14가 같이 쓰는 표 모양 목록(원본 마크업): 번호 칸, 글 칸, 체크 칸.
export function TableRows({ rows }: { rows: Values[] }) {
  return (
    <ul className="cms-table-list">
      {rows.map((row, index) => (
        <li key={index} className="cms-list-item">
          <div className="cms-inner-box row">
            <div className="cms-fixed-cell cms-description-box col-auto">
              <p className="cms-description">{str(row.num)}</p>
            </div>
            <div className="cms-description-box col">
              <p className="cms-description" {...richProps(row.text)} />
            </div>
            <div className="cms-fixed-cell col-auto">
              <div className="cms-figure check">
                <CheckSvg />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// 표 목록의 레이아웃 CSS. cls는 "type13"처럼 타입 클래스 이름이다.
export const tableCss = (cls: string) => `
    .${cls} .cms-table-list { border-top: 2px solid #1d2733; }
    .${cls} .cms-table-list .cms-inner-box { align-items: center; margin: 0; padding: 14px 0; border-bottom: 1px solid #d5dce4; }
    .${cls} .cms-fixed-cell .cms-description { font-weight: 600; color: #1d2733; }
    .${cls} .cms-figure svg .cls-1 { fill: #3a6ea5; }
  `;

// ---- 원본 마크업 부품 (원본 CMS 도구의 출력과 같은 HTML을 만든다) ----

// 원본 머리글: <div class="cms-header top-border"> 작은 글(있을 때) + 큰 글.
// 타입 20, 21, 23은 큰 글이 비어 있으면 넣지 않고, 타입 21은 "left-type"이 붙는다.
export function CmsHeader({
  values,
  hideEmptyBig = false,
  extraClass = "",
  eyebrowSpace = false,
}: {
  values: Values;
  hideEmptyBig?: boolean;
  extraClass?: string;
  eyebrowSpace?: boolean; // 타입 02는 원본이 작은 글 뒤에 공백을 하나 붙인다.
}) {
  const pair = items(values.title)[0] ?? {};
  const small = str(pair.small);
  const big = str(pair.big);
  return (
    <div className={`cms-header top-border${extraClass ? ` ${extraClass}` : ""}`}>
      {small !== "" && (
        <p className="cms-eyebrow">
          {small}
          {eyebrowSpace ? " " : ""}
        </p>
      )}
      {(!hideEmptyBig || big !== "") && <p className="cms-title">{big}</p>}
    </div>
  );
}

// 조건부 이미지. 주소가 비어 있으면 넣지 않는다(원본의 `image && <img …/>`). gate가 false여도 넣지 않는다.
// 원본 중 일부(타입 18, 20~23, 25)는 모바일 이미지를 PC 이미지가 있을 때만 보여 주는데, 그 조건이 gate다.
export function Img({
  value,
  kind,
  className,
  gate = true,
}: {
  value: unknown;
  kind: "pc" | "mobile";
  className: string;
  gate?: boolean;
}) {
  if (!gate || str(value).trim() === "") return null;
  return <img src={kind === "pc" ? pcImage(value) : mobileImage(value)} alt="" className={className || undefined} />;
}

// 원본의 도형 SVG. 속성과 경로, 중복되는 id="path"까지 원본 그대로다.
export function PentagonSvg() {
  return (
    <svg className="cms-figure-svg" width="286" height="274" viewBox="0 0 286 274">
      <g transform="translate(-378 -1390)">
        <path
          id="path"
          className="cls-1"
          d="M513.454,1398.61L390.626,1488.2a13.745,13.745,0,0,0-4.968,15.34l46.916,144.96a13.679,13.679,0,0,0,13,9.49H597.4a13.679,13.679,0,0,0,13-9.49l46.916-144.96a13.746,13.746,0,0,0-4.967-15.34l-122.829-89.59A13.618,13.618,0,0,0,513.454,1398.61Z"
        />
      </g>
    </svg>
  );
}

export function HexagonSvg() {
  return (
    <svg className="cms-figure-svg" width="276" height="244" viewBox="0 0 276 244">
      <g transform="translate(-297.031 -11866)">
        <path
          id="path"
          className="cls-1"
          d="M490.031,11870H379.977a24.026,24.026,0,0,0-20.745,11.8l-55.027,94.3a23.482,23.482,0,0,0,0,23.7l55.027,94.3a23.907,23.907,0,0,0,20.745,11.9H490.031a23.907,23.907,0,0,0,20.745-11.9l55.027-94.3a23.482,23.482,0,0,0,0-23.7l-55.027-94.3A24.026,24.026,0,0,0,490.031,11870Z"
        />
      </g>
    </svg>
  );
}

export function CheckCircleSvg() {
  return (
    <svg className="cms-figure-svg" width="40" height="40" viewBox="0 0 40 40">
      <path
        className="cls-1"
        d="M323,9872.8a16.985,16.985,0,1,1-16.981,16.98A17,17,0,0,1,323,9872.8m0-3.01a20,20,0,1,0,20,19.99,19.993,19.993,0,0,0-20-19.99h0Zm8.444,12.94-10.216,10.21-4.028-4.02-2.013,2.01,4.027,4.03,2.014,2.01,2.014-2.01,10.216-10.22-2.014-2.01h0Z"
        transform="translate(-303 -9869.78)"
      />
    </svg>
  );
}

export function CheckSvg() {
  return (
    <svg className="cms-figure-svg" width="18" height="14" viewBox="0 0 18 14">
      <path
        className="cls-1"
        d="M336.945,10423.6l-1.945,2,6.289,6.4L353,10420l-1.945-2-9.766,10Z"
        transform="translate(-335 -10418)"
      />
    </svg>
  );
}
