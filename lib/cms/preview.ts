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

// iframe의 srcDoc에 넣을 문서 문자열을 만든다. 스크립트는 넣지 않는다.
export function buildPreviewDocument(html: string): string {
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
