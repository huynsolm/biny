import { DEFAULT_IMAGE_SRC, DEFAULT_MOBILE_IMAGE_SRC } from "./html";

// 미리보기 iframe 안에서만 쓰는 공통 스타일이다. 원본 CSS는 가져오지 않았고, 원본 마크업의 클래스 이름을 대상으로 새로 썼다.
// Bootstrap 패키지는 쓰지 않는다. 마크업이 쓰는 Bootstrap 클래스 이름(격자, 표시, 유틸리티)만 직접 구현하고,
// 원본처럼 lg = 992px 기준이다. 화면 너비가 아니라 iframe 너비를 따른다.
const COLS = Array.from({ length: 12 }, (_, i) => i + 1);
const cols = (prefix: string) =>
  COLS.map((n) => `.${prefix}-${n} { flex: 0 0 auto; width: ${((n / 12) * 100).toFixed(6)}%; }`).join("\n  ");

const ORIGINAL_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; background: #ffffff; color: #1d2733; font: 16px/1.6 system-ui, sans-serif; }
  img { max-width: 100%; height: auto; }
  p { margin: 0; }
  ol, ul { margin: 0; padding: 0; list-style: none; }
  .row { display: flex; flex-wrap: wrap; margin-left: -12px; margin-right: -12px; }
  .row > * { flex-shrink: 0; width: 100%; max-width: 100%; padding-left: 12px; padding-right: 12px; }
  .col { flex: 1 0 0%; }
  .col-auto { flex: 0 0 auto; width: auto; }
  ${cols("col")}
  .align-items-center { align-items: center; }
  .justify-content-center { justify-content: center; }
  .justify-content-start { justify-content: flex-start; }
  .d-none { display: none !important; }
  .d-block { display: block !important; }
  .img-fluid { max-width: 100%; height: auto; }
  .w-100 { width: 100% !important; }
  .text-center { text-align: center; }
  .text-white { color: #ffffff; }
  .list-unstyled { padding-left: 0; list-style: none; }
  @media (min-width: 992px) {
    .col-lg { flex: 1 0 0%; }
    .col-lg-auto { flex: 0 0 auto; width: auto; }
    ${cols("col-lg")}
    .align-items-lg-end { align-items: flex-end; }
    .d-lg-block { display: block !important; }
    .d-lg-none { display: none !important; }
  }
  .cms { margin: 0 0 16px; padding: 24px; border: 1px solid #d5dce4; }
  .cms-inner { display: flex; flex-direction: column; gap: 24px; }
  .cms-header.top-border { padding-top: 12px; border-top: 2px solid #1d2733; }
  .cms-eyebrow { margin: 0 0 4px; font-size: 0.875rem; font-weight: 600; color: #3a6ea5; }
  .cms-title { font-size: 1.5rem; line-height: 1.3; }
  .cms-thin-title { font-size: 1.5rem; font-weight: 300; line-height: 1.3; }
  .cms-description { color: #4a5766; }
  .cms-description.larger { font-size: 1.0625rem; }
  .type-bg { background: #f4f7fb; }
  .bg-color-1, .bg-color-2 { background: #eef3f9; }
  .bg-color-3 { background: #f4f7fb; }
  .bg-image-1, .bg-image-2 { background: #1d2733; border-color: #1d2733; color: #ffffff; }
  .bg-image-1 .cms-header.top-border, .bg-image-2 .cms-header.top-border { border-top-color: #ffffff; }
  .bg-image-1 .cms-eyebrow, .bg-image-2 .cms-eyebrow { color: #9db8d6; }
  .bg-image-1 .cms-description, .bg-image-2 .cms-description { color: #e6ebf0; }
`;

// 아직 원본 마크업으로 바꾸지 않은 타입(demo- 클래스)을 위한 임시 CSS. 모든 타입을 바꾸면 지운다.
const LEGACY_CSS = `
  .demo-inner { display: flex; flex-direction: column; gap: 24px; }
  .demo-header { padding-top: 12px; border-top: 2px solid #1d2733; }
  .demo-eyebrow { margin: 0 0 4px; font-size: 0.875rem; font-weight: 600; color: #3a6ea5; }
  .demo-title { margin: 0; font-size: 1.5rem; line-height: 1.3; }
  .demo-desc { margin: 0; color: #4a5766; }
  .demo-visual img { width: 100%; height: auto; }
  .demo-list-item { margin: 0; }
  .demo-check { position: relative; flex: none; width: 28px; height: 28px; border: 2px solid #3a6ea5; border-radius: 50%; }
  .demo-check::after { content: ""; position: absolute; left: 8px; top: 3px; width: 6px; height: 12px; border-right: 2px solid #3a6ea5; border-bottom: 2px solid #3a6ea5; transform: rotate(45deg); }
  ol, ul { margin: 0; padding: 0; list-style: none; }
  .demo-block { margin: 0 0 16px; padding: 24px; border: 1px solid #d5dce4; }
  .demo-pc-only { display: none; }
  .demo-mobile-only { display: block; }
  @media (min-width: 48rem) {
    .demo-pc-only { display: block; }
    .demo-mobile-only { display: none; }
  }
  .demo-cols-1, .demo-cols-2, .demo-cols-3, .demo-cols-4 { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
  .demo-cols-1 { grid-template-columns: minmax(0, 1fr); }
  .demo-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .demo-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .demo-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (max-width: 40rem) {
    .demo-cols-2, .demo-cols-3, .demo-cols-4 { grid-template-columns: minmax(0, 1fr); }
  }
`;

export const BASE_CSS = ORIGINAL_CSS + LEGACY_CSS;

// 샌드박스 iframe은 출처가 없는 문서라서 환경에 따라 이 사이트의 이미지 경로를 불러오지 못한다.
// 소스 창에는 기본 이미지 경로가 그대로 보이게 두고, 미리보기 문서에서만 같은 그림을 인라인으로 바꾼다.
// 이 SVG들은 public/images/cms-sample.svg, cms-sample-m.svg와 같은 도형이다.
const SAMPLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e8eef5"/><circle cx="200" cy="130" r="48" fill="#9db8d6"/><polygon points="80,300 260,170 380,300" fill="#6f93b8"/><polygon points="300,300 440,200 580,300" fill="#4d7399"/></svg>';
const SAMPLE_MOBILE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480"><rect width="360" height="480" fill="#e8eef5"/><circle cx="240" cy="130" r="44" fill="#9db8d6"/><polygon points="20,430 160,260 280,430" fill="#6f93b8"/><polygon points="170,430 270,320 350,430" fill="#4d7399"/></svg>';
const dataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

// iframe의 srcDoc에 넣을 문서 문자열을 만든다. 스크립트는 넣지 않는다.
export function buildPreviewDocument(rawHtml: string, css: string): string {
  const html = rawHtml
    .split(`src="${DEFAULT_IMAGE_SRC}"`)
    .join(`src="${dataUri(SAMPLE_SVG)}"`)
    .split(`src="${DEFAULT_MOBILE_IMAGE_SRC}"`)
    .join(`src="${dataUri(SAMPLE_MOBILE_SVG)}"`);
  return [
    "<!doctype html>",
    '<html lang="ko">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<style>${BASE_CSS}${css}</style>`,
    "</head>",
    "<body>",
    html,
    "</body>",
    "</html>",
  ].join("\n");
}
