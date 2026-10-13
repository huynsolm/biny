/* eslint-disable @next/next/no-img-element -- HTML 소스를 만들기 위한 데모 마크업이라 next/image를 쓰지 않는다 */
import { DEFAULT_IMAGE_SRC, DEFAULT_MOBILE_IMAGE_SRC } from "../html";
import type { Field, ListField, Values } from "../schema";
import { items, mobileImage, pcImage, str } from "../type";

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

export function TitleBlock({ values }: { values: Values }) {
  const pair = items(values.title)[0] ?? {};
  const small = str(pair.small);
  return (
    <div className="demo-header">
      {small !== "" && <p className="demo-eyebrow">{small}</p>}
      <p className="demo-title">{str(pair.big)}</p>
    </div>
  );
}

// PC 이미지와 모바일 이미지를 한 쌍으로 그린다. 주소가 비어 있으면 그 이미지는 넣지 않는다.
export function Pictures({ image, imageMobile }: { image: unknown; imageMobile: unknown }) {
  return (
    <div className="demo-visual">
      {str(image).trim() !== "" && <img className="demo-pc-only" src={pcImage(image)} alt="" />}
      {str(imageMobile).trim() !== "" && <img className="demo-mobile-only" src={mobileImage(imageMobile)} alt="" />}
    </div>
  );
}
