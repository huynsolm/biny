import { DEFAULT_IMAGE_SRC } from "./html";

// 미리보기 iframe 안에서만 쓰는 데모용 스타일이다. 사이트의 디자인 토큰과 별개로, 밝은 바탕에서 읽기 쉽게만 만든다.
const PREVIEW_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; background: #ffffff; color: #1d2733; font: 16px/1.6 system-ui, sans-serif; }
  .demo-block { display: flex; flex-direction: column; gap: 12px; padding: 24px; border: 1px solid #d5dce4; }
  .demo-heading { margin: 0; font-size: 1.5rem; line-height: 1.3; }
  .demo-desc { margin: 0; color: #4a5766; }
  .demo-media { flex-direction: row; flex-wrap: wrap; align-items: center; }
  .demo-image { flex: 1 1 14rem; min-width: 0; max-width: 100%; height: auto; }
  .demo-body { display: flex; flex: 1 1 14rem; flex-direction: column; gap: 12px; min-width: 0; }
  .demo-card-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
  .demo-card { display: flex; flex-direction: column; gap: 6px; padding: 16px; border: 1px solid #d5dce4; background: #f6f8fa; }
  .demo-card-title { margin: 0; font-size: 1.0625rem; }
  .demo-card-desc { margin: 0; color: #4a5766; font-size: 0.9375rem; }
`;

// 샌드박스 iframe은 출처가 없는 문서라서 환경에 따라 이 사이트의 이미지 경로를 불러오지 못한다.
// 소스 창에는 기본 이미지 경로가 그대로 보이게 두고, 미리보기 문서에서만 같은 그림을 인라인으로 바꾼다.
// 이 SVG는 public/images/cms-sample.svg와 같은 도형이다.
const SAMPLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e8eef5"/><circle cx="200" cy="130" r="48" fill="#9db8d6"/><polygon points="80,300 260,170 380,300" fill="#6f93b8"/><polygon points="300,300 440,200 580,300" fill="#4d7399"/></svg>';
const SAMPLE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(SAMPLE_SVG)}`;

// iframe의 srcDoc에 넣을 문서 문자열을 만든다. 스크립트는 넣지 않는다.
export function buildPreviewDocument(rawHtml: string): string {
  const html = rawHtml.split(`src="${DEFAULT_IMAGE_SRC}"`).join(`src="${SAMPLE_DATA_URI}"`);
  return [
    "<!doctype html>",
    '<html lang="ko">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<style>${PREVIEW_CSS}</style>`,
    "</head>",
    "<body>",
    html,
    "</body>",
    "</html>",
  ].join("\n");
}
