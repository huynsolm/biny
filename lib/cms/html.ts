export const DEFAULT_IMAGE_SRC = "/images/cms-sample.svg";
export const DEFAULT_MOBILE_IMAGE_SRC = "/images/cms-sample-m.svg";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// 입력값이 마크업으로 해석되지 않게 한다. 한 번의 치환으로 처리하므로 이미 바꾼 문자를 다시 바꾸지 않는다.
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

// 공백, 백슬래시, 제어문자가 있으면 브라우저가 주소를 다르게 해석할 수 있어서 모두 거부한다.
const UNSAFE_CHARS = /[\s\\\u0000-\u001f\u007f]/;

// 첨부한 파일을 브라우저에서 줄여 만든 data URL의 전체 길이 상한(약 450KB). 이보다 크면 받지 않는다.
export const IMAGE_DATA_MAX = 600_000;

// SVG는 스크립트를 담을 수 있어서 빼고, 래스터 형식의 base64 data URL만 받는다.
const IMAGE_DATA_URL = /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;

// 이 사이트 안의 경로(/로 시작, //는 제외), https 주소, 첨부한 래스터 이미지의 data URL만 허용한다. 그 밖의 값은 fallback(기본은 PC 샘플 이미지)으로 바꾼다.
export function safeImageSrc(value: string, fallback: string = DEFAULT_IMAGE_SRC): string {
  const src = value.trim();
  if (UNSAFE_CHARS.test(src)) return fallback;
  if (src.startsWith("data:")) return src.length <= IMAGE_DATA_MAX && IMAGE_DATA_URL.test(src) ? src : fallback;
  const isLocalPath = src.startsWith("/") && !src.startsWith("//");
  const isHttps = src.startsWith("https://") && src.length > "https://".length;
  return isLocalPath || isHttps ? src : fallback;
}
