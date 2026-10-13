# CMS 컴포넌트 미리보기 데모 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/cms-preview`에 샘플 데이터만 쓰는 "입력 → HTML 소스 → 미리보기" 데모(타입 3개)를 만들고 `react-cms-preview` 사례에서 연결한다.

**Architecture:** HTML 생성·이스케이프·이미지 주소 검증·미리보기 문서 조립은 `lib/cms/`의 순수 함수로 두고 Vitest로 테스트한다. 클라이언트 컴포넌트 하나(`CmsPreview`)가 입력 상태를 들고, 같은 `renderHtml` 결과를 소스 창과 샌드박스 iframe(`srcDoc`)에 그대로 쓴다.

**Tech Stack:** Next.js 16 (App Router, 정적 생성), React 19, TypeScript strict, CSS Modules, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-13-cms-preview-demo-design.md`

> `AGENTS.md`: 이 Next.js는 기존 지식과 다를 수 있다. 페이지/메타데이터 코드는 `app/qa-dashboard/page.tsx` 패턴을 따른다. 필요하면 `node_modules/next/dist/docs/`를 확인한다.

## Global Constraints

- 원본 업무 도구의 코드, 타입별 마크업, 클래스 이름, 이미지, 외부 이미지 서버, 관리자 기능을 가져오지 않는다. 클래스 이름은 `demo-` 접두사만 쓴다.
- 서버, DB, 업로드, 로그인, 저장(localStorage 포함)이 없다. 새로고침하면 기본값으로 돌아간다.
- 항상 보이는 안내문: "샘플 데이터예요. 서버에 저장되지 않고, 개인이 만든 데모예요."
- 고객·병원·내부 서비스 이름, 성과 수치, 접근성·성능 점수, "타입 01~26" 등 원본 작업을 이 데모의 성과처럼 보이게 하는 표현을 넣지 않는다. 데모의 타입은 3개뿐이라고 밝힌다.
- 모든 입력값은 `escapeHtml`을 거친다. 미리보기는 `<iframe sandbox="" srcDoc=…>`이고 스크립트를 허용하지 않는다(`allow-*` 값 없음).
- 길이 상한: 제목 60, 설명 300, 카드 제목 60, 카드 설명 120, 이미지 주소 200, 대체 텍스트 120. 카드 수 2~4.
- 스타일은 `styles/tokens.css` 변수와 점선 카드 언어만 쓴다. 그라데이션·장식 그림자·새 애니메이션은 쓰지 않는다.
- 터치 영역 최소 44px, 320px에서 가로 스크롤 없음, 보이는 레이블, 기존 `:focus-visible` 유지, `prefers-reduced-motion` 유지.
- 각 작업 끝에 `npm test`, `npm run lint`가 통과해야 한다. 구현은 `main`이 아닌 브랜치에서 하고, 병합과 푸시는 사용자 승인 뒤에만 한다.

## Review Focus

각 줄의 테스트나 확인은 해당 작업의 단계에 들어 있다.

1. 이미지 주소가 `javascript:`, `data:`, `http:`, `//evil.example`, `/\evil.example`, 공백·제어문자 포함, 빈 값일 때 기본 이미지로 대체된다. (Task 1)
2. 제목·설명·카드에 `<script>`, `</style>`, `"`, `'`, `&`가 들어가도 소스와 미리보기에 텍스트로만 나온다. (Task 1, Task 2, Task 3 브라우저 확인)
3. 모든 입력이 비어 있어도 유효한 HTML이 나오고, 한도를 넘는 값(입력창을 우회한 값)은 상한으로 잘린다. (Task 2)
4. 카드가 2개 미만이거나 4개를 넘는 값이 들어와도 2~4개로 맞춰지고, 한계에서 추가/삭제 버튼이 비활성화된다. (Task 2, Task 3)
5. 클립보드를 쓸 수 없거나 복사가 거부되면 화면이 깨지지 않고 실패 안내가 나온다. (Task 3 브라우저 확인)

## File Structure

| 파일 | 책임 |
|---|---|
| `lib/cms/html.ts` | `escapeHtml`, `safeImageSrc`, `DEFAULT_IMAGE_SRC` |
| `lib/cms/components.ts` | 타입·값 타입, 한도, 기본값, `clampCards`, `renderHtml` |
| `lib/cms/preview.ts` | `buildPreviewDocument` (iframe `srcDoc` 문서와 데모용 CSS) |
| `components/CmsPreview.tsx`, `.module.css` | 입력 상태, 폼, 소스 창, 복사, iframe |
| `app/cms-preview/page.tsx` | 제목, 안내문, 컴포넌트 렌더, 메타데이터 |
| `public/images/cms-sample.svg` | 새로 그린 단순 도형 샘플 이미지 |
| `content/projects/react-cms-preview.mdx` | 데모 링크 단락 추가 |
| `tests/cms-html.test.ts`, `tests/cms-components.test.ts`, `tests/cms-preview.test.ts` | 로직 테스트 |

`lib/cms/preview.ts`는 스펙의 파일 목록에 없던 작은 파일이다(미리보기 문서 조립을 테스트 가능하게 분리). 스펙의 경계 원칙(순수 로직과 화면 분리)과 맞는다.

---

### Task 1: HTML 이스케이프와 이미지 주소 검증

**Files:**
- Create: `lib/cms/html.ts`
- Test: `tests/cms-html.test.ts`

**Interfaces:**
- Produces (`lib/cms/html.ts`):
  - `const DEFAULT_IMAGE_SRC = "/images/cms-sample.svg"`
  - `escapeHtml(value: string): string` — `& < > " '`를 각각 `&amp; &lt; &gt; &quot; &#39;`로 바꾼다.
  - `safeImageSrc(value: string): string` — 앞뒤 공백을 자른 값이 (a) `/`로 시작하고 `//`로 시작하지 않거나 (b) `https://`로 시작하고 뒤에 한 글자 이상 있으며, 그리고 백슬래시·공백·제어문자를 포함하지 않으면 그 값을, 아니면 `DEFAULT_IMAGE_SRC`를 반환한다.

- [ ] **Step 1: 실패하는 테스트를 쓴다** (`tests/cms-html.test.ts`)
  - `escapeHtml converts & < > " '` — `escapeHtml(`<a href="x">'&'</a>`)` → `&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;`
  - `escapeHtml leaves plain Korean text unchanged`
  - `escapeHtml neutralizes a script tag` — 결과에 `<script`가 없다 (Review Focus 2)
  - `safeImageSrc accepts a root-relative path and an https URL` — `/images/a.svg`, `https://example.com/a.png`
  - `safeImageSrc trims surrounding whitespace` — `"  /images/a.svg "` → `/images/a.svg`
  - `safeImageSrc rejects unsafe or malformed values` — `""`, `"javascript:alert(1)"`, `"data:image/svg+xml;base64,AAAA"`, `"http://example.com/a.png"`, `"//evil.example/a.png"`, `"/\\evil.example"`, `"/a b.png"`, `"https://"`, `"/a\u0000.png"` 모두 `DEFAULT_IMAGE_SRC` (Review Focus 1)

- [ ] **Step 2: 실패를 확인한다** — `npx vitest run tests/cms-html.test.ts` → 모듈이 없어서 FAIL.

- [ ] **Step 3: `lib/cms/html.ts`를 위 시그니처대로 구현한다.** `escapeHtml`은 `&`를 가장 먼저 바꾼다.

- [ ] **Step 4: 통과를 확인한다** — `npx vitest run tests/cms-html.test.ts` PASS, `npm run lint`.

- [ ] **Step 5: 커밋**

```bash
git add lib/cms/html.ts tests/cms-html.test.ts
git commit -m "feat: add HTML escaping and image src validation for CMS demo"
```

---

### Task 2: 컴포넌트 타입, HTML 생성, 미리보기 문서

**Files:**
- Create: `lib/cms/components.ts`, `lib/cms/preview.ts`
- Test: `tests/cms-components.test.ts`, `tests/cms-preview.test.ts`

**Interfaces:**
- Consumes: `escapeHtml`, `safeImageSrc`, `DEFAULT_IMAGE_SRC` (Task 1)
- Produces (`lib/cms/components.ts`):
  - `type ComponentTypeId = "title" | "media" | "cards"`
  - `type Card = { title: string; description: string }`
  - `type CmsValues = { title: string; description: string; imageSrc: string; imageAlt: string; cards: Card[] }`
  - `type FieldId = "title" | "description" | "imageSrc" | "imageAlt" | "cards"`
  - `const COMPONENT_TYPES: { id: ComponentTypeId; label: string; fields: FieldId[] }[]` — 라벨: "제목 + 설명", "이미지 + 텍스트", "카드 목록". 필드: title → `["title","description"]`, media → `["imageSrc","imageAlt","title","description"]`, cards → `["title","cards"]`
  - `const LIMITS = { title: 60, description: 300, cardTitle: 60, cardDescription: 120, imageSrc: 200, imageAlt: 120 }`, `const MIN_CARDS = 2`, `const MAX_CARDS = 4`
  - `const DEFAULT_VALUES: CmsValues` — 안내형 일반 문구(제목 "제목을 입력해 보세요", 설명 한두 문장, 이미지 `DEFAULT_IMAGE_SRC`, 대체 텍스트 "샘플 이미지", 카드 2개). 병원·고객·서비스 이름은 쓰지 않는다.
  - `clampCards(cards: Card[]): Card[]` — 4개를 넘으면 앞 4개만, 2개 미만이면 빈 카드(`{title:"",description:""}`)로 채워 2개로 만든다. 입력 배열은 바꾸지 않는다.
  - `renderHtml(type: ComponentTypeId, values: CmsValues): string` — 스펙 §4의 마크업(들여쓰기 2칸, `\n` 구분, 끝 개행 없음). 각 값은 상한으로 자르고(`LIMITS`) `escapeHtml`을 거친다. 이미지 주소는 상한으로 자른 뒤 `safeImageSrc`를 거친다. 비어 있는(공백만 포함) 제목·설명 요소는 출력하지 않는다. `media`의 대체 텍스트가 비어 있으면 `alt=""`. 카드는 `clampCards`를 거치고, 카드 안의 비어 있는 제목·설명 요소는 생략하되 `<li class="demo-card">`는 출력한다.
- Produces (`lib/cms/preview.ts`):
  - `buildPreviewDocument(html: string): string` — `<!doctype html>`, `lang="ko"`, `charset`, 데모용 `<style>`(작성하는 새 CSS, `demo-` 클래스만 스타일), `<body>` 안에 `html`을 그대로 넣은 문서 문자열. `<script>`를 포함하지 않는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**
  - `tests/cms-components.test.ts`
    - `COMPONENT_TYPES has exactly 3 types with the specified fields`
    - `renderHtml title: exact markup for title and description` — 정확한 문자열 단언(스펙 §4 마크업, 들여쓰기 포함)
    - `renderHtml title: omits empty title and description elements` — 제목만 있을 때 `<p`가 없고, 둘 다 비어도 `<section class="demo-block demo-title">\n</section>`이 나온다 (Review Focus 3)
    - `renderHtml media: exact markup, default src for an unsafe src` — `javascript:alert(1)`를 넣으면 `src="/images/cms-sample.svg"`
    - `renderHtml media: empty alt renders alt=""`
    - `renderHtml cards: exact markup for 2 cards`, `renders 4 cards and ignores a 5th` (Review Focus 4)
    - `clampCards pads to 2 and truncates to 4 without mutating input`
    - `renderHtml escapes script, closing style tags and quotes in every field` — 제목·설명·이미지 주소·대체 텍스트·카드 제목·카드 설명에 `<script>alert(1)</script>`, `</style>`, `"x"` 를 넣은 출력에 `<script`, `</style>`가 없고 `&lt;script&gt;`가 있다 (Review Focus 2)
    - `renderHtml caps every field at its limit` — 제한 +10자짜리 값을 넣고 출력에서 자른 길이를 확인한다 (Review Focus 3)
    - `renderHtml output contains only demo- classes` — 출력의 모든 `class="…"` 토큰이 `demo-`로 시작한다
  - `tests/cms-preview.test.ts`
    - `buildPreviewDocument embeds the html unchanged inside body`
    - `buildPreviewDocument contains no script element`
    - `buildPreviewDocument declares doctype, lang ko and charset`

- [ ] **Step 2: 실패를 확인한다** — `npx vitest run tests/cms-components.test.ts tests/cms-preview.test.ts` → FAIL.

- [ ] **Step 3: `lib/cms/components.ts`, `lib/cms/preview.ts`를 위 시그니처대로 구현한다.** 값 자르기는 `slice(0, limit)`이고, 비어 있음 판정은 `trim() === ""`이다. 마크업 줄 조립은 줄 배열을 `\n`으로 합치는 방식. 미리보기 CSS는 새로 쓴다(`.demo-block` 여백·테두리, `.demo-media`의 이미지와 본문 가로 배치(좁으면 세로), `.demo-card-list`의 카드 격자, 읽기 쉬운 글꼴 크기와 대비). 원본 CSS나 색 값을 가져오지 않는다.

- [ ] **Step 4: 통과를 확인한다** — 전체 `npm test` PASS, `npm run lint`.

- [ ] **Step 5: 커밋**

```bash
git add lib/cms/components.ts lib/cms/preview.ts tests/cms-components.test.ts tests/cms-preview.test.ts
git commit -m "feat: add CMS demo component types, HTML rendering and preview document"
```

---

### Task 3: 데모 화면과 페이지

**Files:**
- Create: `components/CmsPreview.tsx`, `components/CmsPreview.module.css`, `app/cms-preview/page.tsx`, `public/images/cms-sample.svg`

**Interfaces:**
- Consumes: Task 2의 `COMPONENT_TYPES`, `DEFAULT_VALUES`, `LIMITS`, `MIN_CARDS`, `MAX_CARDS`, `clampCards`, `renderHtml`, `ComponentTypeId`, `CmsValues`, `FieldId`, `buildPreviewDocument`
- Produces: `export default function CmsPreview(): JSX.Element` (props 없음, `"use client"`), 라우트 `/cms-preview`

- [ ] **Step 1: `public/images/cms-sample.svg`를 만든다.** 새로 그린 단순 도형(예: 사각 배경 위에 원과 삼각형) 하나. 외부 이미지, 원본 이미지, 텍스트 로고를 쓰지 않는다. 크기는 몇 KB 이내.

- [ ] **Step 2: `components/CmsPreview.tsx`를 만든다.**
  - 상태: `type: ComponentTypeId`(기본 `"title"`), `values: CmsValues`(기본 `DEFAULT_VALUES`), `copyMessage: string`. 입력은 모두 제어 컴포넌트이고 값은 타입 전환 시 유지한다.
  - `const html = renderHtml(type, values)`; `srcDoc={buildPreviewDocument(html)}`.
  - 폼: 타입 `<select>`, 선택된 타입의 `fields`만 보여 주는 레이블 있는 입력(제목·이미지 주소·대체 텍스트는 `<input>`, 설명·카드 설명은 `<textarea>`; `maxLength`는 `LIMITS`). 대체 텍스트 아래에 "비워 두면 장식 이미지로 처리돼요" 안내. 카드는 카드마다 제목·설명 입력과 "카드 추가"/"카드 삭제" 버튼. 개수가 `MAX_CARDS`면 추가를, `MIN_CARDS`면 삭제를 비활성화한다. 카드 상태를 바꿀 때 `clampCards`를 거친다.
  - 소스 창: 레이블 "생성된 HTML 소스"의 읽기 전용 `<textarea>`(`value={html}`, `spellCheck={false}`, 모노 글꼴, 가로 스크롤은 창 안에서). "소스 복사" 버튼은 `navigator.clipboard.writeText(html)`를 try/catch로 호출한다. 성공: "복사했어요." 실패 또는 `navigator.clipboard`가 없으면: "복사하지 못했어요. 소스 창에서 직접 선택해 복사해 주세요."를 `role="status"` 영역에 넣고 소스 창 텍스트를 선택(`select()`)한다 (Review Focus 5).
  - 미리보기: `<iframe title="HTML 미리보기" sandbox="" srcDoc={…}>` — `sandbox` 값은 빈 문자열이다.
  - 새 `aria-live`나 애니메이션을 추가하지 않는다.

- [ ] **Step 3: `components/CmsPreview.module.css`를 만든다.** 점선 테두리 패널, `var(--space-*)`·`var(--color-*)`만 사용. 버튼·select·input·textarea 최소 높이 `2.75rem`(textarea는 `min-height`만). 넓은 화면(`min-width: 48rem`)에서 폼과 결과(소스 + 미리보기)를 두 열, 좁은 화면은 한 열. iframe은 `width: 100%`, 고정 높이(예: `24rem`), 밝은 배경 위에 테두리. 긴 값이 가로 스크롤을 만들지 않게 `min-width: 0`과 `overflow-wrap`을 쓴다.

- [ ] **Step 4: `app/cms-preview/page.tsx`를 만든다.** `app/qa-dashboard/page.tsx` 패턴: `metadata`(title `"CMS 컴포넌트 미리보기 | 김영빈"`, 한 문장 설명), `<main id="main" className="container">`, `<h1>CMS 컴포넌트 미리보기</h1>`, Global Constraints의 안내문(서버에서 그려 JS 없이도 보임), 타입이 3개뿐이라는 한 줄 설명("타입은 3개만 담은 작은 데모예요."), `<CmsPreview />`, 홈으로 돌아가는 `Link`. 홈 내비게이션에는 넣지 않는다.

- [ ] **Step 5: 정적 확인** — `npm test`, `npm run lint`, `npm run build`. 빌드 출력에 `/cms-preview`가 정적(`○`)으로 나와야 한다.

- [ ] **Step 6: 브라우저 확인** (`npm run dev`, 포트 3000)
  - 입력 → 소스와 미리보기가 즉시 바뀌고, 타입을 바꿔도 입력값이 유지된다.
  - 제목에 `<script>alert(1)</script>` 입력 → 알림이 뜨지 않고 소스에 `&lt;script&gt;`로, 미리보기에 텍스트로 보인다 (Review Focus 2).
  - `media` 타입에서 기본 이미지가 iframe 안에서 실제로 보인다(상대 경로 해석 확인). 이미지 주소에 `javascript:alert(1)`을 넣으면 기본 이미지로 대체된다.
  - 카드 추가/삭제가 2~4개 범위에서 동작하고 한계에서 버튼이 비활성화된다 (Review Focus 4).
  - 복사 성공 안내가 나온다. `navigator.clipboard.writeText`가 예외를 던지게 바꾼 뒤(개발자 도구) 복사하면 실패 안내가 나오고 화면은 정상이다 (Review Focus 5).
  - iframe에 `sandbox` 속성이 빈 값으로 있고 `allow-scripts`가 없다.
  - 키보드만으로 타입 선택, 모든 입력, 카드 추가/삭제, 복사까지 조작된다.
  - 320px: `scrollWidth === innerWidth`, 컨트롤 높이 44px 이상(스크립트로 측정).

- [ ] **Step 7: 커밋**

```bash
git add components/CmsPreview.tsx components/CmsPreview.module.css app/cms-preview/page.tsx public/images/cms-sample.svg
git commit -m "feat: add CMS component preview demo page"
```

---

### Task 4: 포트폴리오 사례 연결과 최종 검증

**Files:**
- Modify: `content/projects/react-cms-preview.mdx`

**Interfaces:**
- Consumes: 라우트 `/cms-preview` (Task 3)

- [ ] **Step 1: MDX의 "확인할 수 있는 것"에 한 단락을 추가한다.** 이 문구의 뜻을 그대로 쓴다: 원본은 업무에서 만든 도구라 소스와 화면은 공개하지 않았고, 같은 흐름을 샘플 데이터로 새로 만든 개인 데모가 있으며 컴포넌트 타입은 3개뿐이다. `[데모 열어 보기](/cms-preview)` 상대 링크를 둔다. 기존 문구(스택, 역할, 공개 범위 문장)는 바꾸지 않는다. 성과 수치와 "같은 코드"라는 표현은 쓰지 않는다.

- [ ] **Step 2: 전체 검증** — `npm test`(전체 PASS), `npm run lint`, `npm run build`(`/cms-preview`와 `/projects/react-cms-preview` 생성), `git diff --check`.

- [ ] **Step 3: 브라우저 확인** — `/projects/react-cms-preview`의 데모 링크가 `/cms-preview`로 열리고, 문구가 "새로 만든 개인 데모"와 "타입 3개"를 분명히 하며, 320px에서 가로 스크롤이 없다. 본문에 고객·병원 이름이 없는지 훑는다.

- [ ] **Step 4: 커밋**

```bash
git add content/projects/react-cms-preview.mdx
git commit -m "feat: link CMS preview demo from the case study"
```

푸시와 `main` 병합은 하지 않고 결과를 보고한 뒤 사용자 승인을 받는다.
