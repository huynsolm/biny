import { renderHtml } from "@/lib/cms/format";
import { getType } from "@/lib/cms/registry";
import type { Values } from "@/lib/cms/schema";

// 원본 마크업 테스트가 같이 쓰는 도우미.

export function type(id: string) {
  const found = getType(id);
  if (!found) throw new Error(`type ${id} is not registered`);
  return found;
}

// class 속성에 해당 토큰이 있는 요소의 개수.
export function count(html: string, token: string): number {
  return [...html.matchAll(/class="([^"]*)"/g)].filter((m) => m[1].split(/\s+/).includes(token)).length;
}

export function render(id: string, patch: Values = {}): string {
  const t = type(id);
  return renderHtml(t, { ...t.defaults, ...patch });
}

export const listLength = (id: string, key: string) => (type(id).defaults[key] as Values[]).length;
export const noImages = { image: "", imageMobile: "" };
