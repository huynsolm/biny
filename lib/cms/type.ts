import type { ReactElement } from "react";
import { DEFAULT_IMAGE_SRC, DEFAULT_MOBILE_IMAGE_SRC, safeImageSrc } from "./html";
import { sanitizeInline } from "./sanitize";
import type { Field, Values } from "./schema";

export type CmsType = {
  id: string; // "type01"
  number: string; // "01"
  label: string; // "타입 01 · 짧은 설명"
  fields: Field[];
  defaults: Values;
  css: string; // 이 타입의 레이아웃. ".demo-typeNN" 범위 안에서만 쓴다.
  View: (props: { values: Values }) => ReactElement;
};

// View에서 값을 안전하게 읽는 도우미. 문자열이나 배열이 아니면 빈 값으로 본다.
export function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function items(value: unknown): Values[] {
  return Array.isArray(value) ? (value as Values[]) : [];
}

// rich 필드(제목, 본문)만 HTML을 받고, 항상 허용 태그만 남긴 결과로 넣는다.
export function richProps(value: unknown): { dangerouslySetInnerHTML: { __html: string } } {
  return { dangerouslySetInnerHTML: { __html: sanitizeInline(str(value)) } };
}

export function pcImage(value: unknown): string {
  return safeImageSrc(str(value), DEFAULT_IMAGE_SRC);
}

export function mobileImage(value: unknown): string {
  return safeImageSrc(str(value), DEFAULT_MOBILE_IMAGE_SRC);
}
