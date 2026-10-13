# CMS Publishing QA Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/qa-dashboard`에 샘플 데이터와 localStorage만 쓰는 발행 점검 체크리스트를 만들고, 포트폴리오 사례로 연결한다.

**Architecture:** 상태 변경·요약·발행 가능 판정·저장 검증은 `lib/qa/`의 순수 함수로 두고 Vitest로 테스트한다. 화면은 클라이언트 컴포넌트 하나(`QaDashboard`)가 상태와 localStorage를 맡고, 서버 컴포넌트 페이지가 이를 감싼다.

**Tech Stack:** Next.js 16 (App Router, 정적 생성), React 19, TypeScript strict, CSS Modules, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-13-qa-dashboard-design.md`

> `AGENTS.md`: 이 Next.js는 기존 지식과 다를 수 있다. 페이지/메타데이터 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 문서를 확인한다. 기존 `app/log/page.tsx`가 페이지 패턴의 기준이다.

## Global Constraints

- 샘플 페이지는 "샘플 메인", "샘플 상담 안내", "샘플 오시는 길"만 쓴다. 병원·고객·내부 서비스 이름, 성과 수치, 접근성·성능 점수를 어디에도 넣지 않는다.
- 항상 보이는 안내문: "샘플 데이터예요. 이 브라우저에만 저장되고, 개인이 만든 데모예요."
- localStorage 키는 `qa-dashboard:v1`, `version`은 `1`. 서버 저장, 외부 API, 로그인은 없다.
- 상태값은 `todo | pass | fail | na`. 페이지는 모든 항목이 `pass` 또는 `na`일 때만 발행 가능이다. 페이지 수는 최대 20개.
- 스타일은 `styles/tokens.css`의 CSS 변수와 기존 점선 카드 언어만 쓴다. 그라데이션·그림자 장식·새 애니메이션은 쓰지 않는다.
- 터치 영역 최소 44px, 320px에서 가로 스크롤 없음, 보이는 레이블, 기존 `:focus-visible` 유지, `prefers-reduced-motion` 유지.
- 삭제와 되돌리기는 `window.confirm`이 아니라 같은 화면의 확인 단계(버튼 두 개)로 한다.
- 각 작업 끝에 `npm test`, `npm run lint`가 통과해야 한다. 커밋은 작업마다 하되 푸시는 사용자 승인 뒤에만 한다.

## Review Focus

각 줄의 테스트는 해당 작업의 단계에 들어 있다.

1. 이름이 아주 길거나(40자 초과) 메모가 아주 길 때(200자 초과) 잘라서 저장한다. (Task 1)
2. 페이지를 모두 삭제해 목록이 비었을 때 요약이 0으로 나오고 화면이 비어 있음을 알려 준다. (Task 1, Task 3)
3. 선택된 페이지를 삭제하면 선택이 남은 첫 페이지로 옮겨 가고, 하나도 없으면 선택 없음이 된다. (Task 3)
4. localStorage 읽기·쓰기가 예외를 던지는 환경(차단, 용량 초과)에서도 화면이 동작하고 안내가 한 번 나온다. (Task 3)
5. 저장값이 손상됐거나(깨진 JSON, 다른 `version`, 알 수 없는 상태값, 중복 페이지 id) 사용자가 손으로 고친 경우 샘플로 시작한다. (Task 2)

## File Structure

| 파일 | 책임 |
|---|---|
| `lib/qa/checklist.ts` | 타입(`ItemStatus`, `GroupId`, `ChecklistItem`), `GROUPS`, `CHECKLIST`, `STATUS_LABELS` |
| `lib/qa/state.ts` | `QaPage`/`QaState` 타입과 상태 변경·요약·판정 순수 함수, 샘플 상태 |
| `lib/qa/storage.ts` | `STORAGE_KEY`, 직렬화와 검증 |
| `components/QaDashboard.tsx`, `.module.css` | 상태 보관, localStorage 접근, 화면 |
| `app/qa-dashboard/page.tsx` | 제목, 안내문, 컴포넌트 렌더, 메타데이터 |
| `content/projects/cms-publishing-qa-dashboard.mdx` | 포트폴리오 사례 |
| `tests/qa-state.test.ts`, `tests/qa-storage.test.ts` | 로직 테스트 |

---

### Task 1: 체크리스트 정의와 상태 로직

**Files:**
- Create: `lib/qa/checklist.ts`, `lib/qa/state.ts`
- Test: `tests/qa-state.test.ts`

**Interfaces:**
- Produces (`lib/qa/checklist.ts`):
  - `type ItemStatus = "todo" | "pass" | "fail" | "na"`
  - `type GroupId = "semantic" | "responsive" | "keyboard" | "browser" | "publish"`
  - `type ChecklistItem = { id: string; group: GroupId; label: string }`
  - `const GROUPS: { id: GroupId; label: string }[]` — 라벨: 시맨틱, 반응형, 키보드, 브라우저, 발행
  - `const CHECKLIST: ChecklistItem[]` — 스펙 §4 표의 항목 10개. id: `heading-order`, `img-alt`, `landmarks`, `no-hscroll-320`, `touch-target`, `tab-order`, `focus-visible`, `browsers`, `links`, `page-title`
  - `const STATUS_LABELS: Record<ItemStatus, string>` — 미점검, 통과, 실패, 해당 없음
- Produces (`lib/qa/state.ts`):
  - `type QaPage = { id: string; name: string; note: string; statuses: Record<string, ItemStatus> }`
  - `type QaState = { version: 1; pages: QaPage[] }`
  - `const MAX_PAGES = 20`, `NAME_MAX = 40`, `NOTE_MAX = 200`
  - `createSampleState(): QaState` — 고정 id `sample-main`, `sample-consult`, `sample-location`, 모든 항목 `todo`
  - `getStatus(page: QaPage, itemId: string): ItemStatus` — 없는 id는 `"todo"`
  - `setStatus(state: QaState, pageId: string, itemId: string, status: ItemStatus): QaState`
  - `setNote(state: QaState, pageId: string, note: string): QaState` — `NOTE_MAX`로 자름
  - `addPage(state: QaState, name: string, id: string): QaState` — 이름을 trim하고 `NAME_MAX`로 자름. 빈 이름, 이미 `MAX_PAGES`개, 중복 id면 같은 state 객체를 그대로 반환
  - `removePage(state: QaState, pageId: string): QaState`
  - `isPublishable(page: QaPage): boolean`
  - `summarize(state: QaState, selectedId: string | null): { total: number; publishable: number; selected: { pass: number; fail: number; todo: number; na: number } | null }` — 선택 페이지가 없거나 없는 id면 `selected: null`

- [ ] **Step 1: 실패하는 테스트를 쓴다** (`tests/qa-state.test.ts`, 테스트 이름과 단언)
  - `createSampleState has 3 pages, all items todo, none publishable`
  - `getStatus returns todo for an unknown item id`
  - `setStatus changes only the target page and item` — 다른 페이지와 다른 항목은 그대로, 원본 state 불변
  - `isPublishable: true when every item is pass or na` / `false with one fail` / `false with one todo`
  - `summarize counts total, publishable and the selected page's statuses`; `summarize returns selected null for null or unknown id`
  - `summarize on zero pages returns total 0, publishable 0, selected null` (Review Focus 2)
  - `addPage trims, caps name at 40 chars, rejects empty and whitespace-only names` (Review Focus 1)
  - `addPage stops at 20 pages and rejects a duplicate id`
  - `setNote caps the note at 200 chars` (Review Focus 1)
  - `removePage removes only the target page`

- [ ] **Step 2: 실패를 확인한다** — `npx vitest run tests/qa-state.test.ts` → 모듈이 없어서 FAIL.

- [ ] **Step 3: 위 시그니처대로 `lib/qa/checklist.ts`, `lib/qa/state.ts`를 구현한다.** 모든 변경 함수는 새 객체를 반환하고 입력을 바꾸지 않는다. `createSampleState`는 `CHECKLIST` 전체를 `todo`로 채운다.

- [ ] **Step 4: 통과를 확인한다** — `npx vitest run tests/qa-state.test.ts` → 모두 PASS. 이어서 `npm run lint`.

- [ ] **Step 5: 커밋**

```bash
git add lib/qa/checklist.ts lib/qa/state.ts tests/qa-state.test.ts
git commit -m "feat: add QA checklist definition and state logic"
```

---

### Task 2: 저장 직렬화와 검증

**Files:**
- Create: `lib/qa/storage.ts`
- Test: `tests/qa-storage.test.ts`

**Interfaces:**
- Consumes: `QaState`, `QaPage`, `MAX_PAGES`, `NAME_MAX`, `NOTE_MAX`, `createSampleState` (Task 1), `CHECKLIST`, `ItemStatus` (Task 1)
- Produces (`lib/qa/storage.ts`):
  - `const STORAGE_KEY = "qa-dashboard:v1"`
  - `serialize(state: QaState): string`
  - `type ParseResult = { state: QaState; result: "ok" | "empty" | "invalid" }`
  - `parseStored(raw: string | null): ParseResult` — `null`이면 `{ createSampleState(), "empty" }`, 검증에 실패하면 `{ createSampleState(), "invalid" }`

- [ ] **Step 1: 실패하는 테스트를 쓴다** (`tests/qa-storage.test.ts`)
  - `serialize then parseStored round-trips a state` → `result: "ok"`, 깊은 동등
  - `parseStored(null) returns the sample state with result empty`
  - `parseStored rejects malformed JSON` → `result: "invalid"`, 샘플 상태
  - `parseStored rejects a different version` (`version: 2`)
  - `parseStored rejects an unknown status value` (`"done"`)
  - `parseStored rejects duplicate page ids`
  - `parseStored rejects more than 20 pages`
  - `parseStored rejects a page with an empty name or non-string note`
  - `parseStored drops status keys that are not in CHECKLIST` — 결과 페이지의 `statuses`에 그 키가 없다
  - `parseStored caps an over-long name and note instead of rejecting`
  - `parseStored rejects non-object JSON` (`"[]"`, `"42"`, `"null"`)

- [ ] **Step 2: 실패를 확인한다** — `npx vitest run tests/qa-storage.test.ts` → FAIL.

- [ ] **Step 3: `lib/qa/storage.ts`를 구현한다.** `JSON.parse`는 try/catch로 감싸고, 손으로 쓴 타입 가드로 모양을 검증한다(새 의존성을 추가하지 않는다). 유효한 페이지의 `statuses`는 `CHECKLIST`에 있는 id만 남기고 나머지 항목은 채우지 않는다(조회 시 `todo`).

- [ ] **Step 4: 통과를 확인한다** — `npx vitest run` 전체 PASS, `npm run lint`.

- [ ] **Step 5: 커밋**

```bash
git add lib/qa/storage.ts tests/qa-storage.test.ts
git commit -m "feat: add QA state storage validation"
```

---

### Task 3: 대시보드 화면과 페이지

**Files:**
- Create: `components/QaDashboard.tsx`, `components/QaDashboard.module.css`, `app/qa-dashboard/page.tsx`

**Interfaces:**
- Consumes: Task 1의 `CHECKLIST`, `GROUPS`, `STATUS_LABELS`, 상태 함수 전부와 `createSampleState`, `MAX_PAGES`, `NAME_MAX`, `NOTE_MAX`; Task 2의 `STORAGE_KEY`, `serialize`, `parseStored`
- Produces: `export default function QaDashboard(): JSX.Element` (props 없음, `"use client"`), 라우트 `/qa-dashboard`

- [ ] **Step 1: 다음 동작을 가진 `components/QaDashboard.tsx`를 만든다.**
  - 첫 렌더는 `createSampleState()`로 그리고, `useEffect`에서 `localStorage.getItem(STORAGE_KEY)`를 `parseStored`로 읽어 반영한다. 읽기와 쓰기는 모두 try/catch로 감싼다. 린트의 `set-state-in-effect` 규칙이 걸리면 이유를 적은 한 줄 주석과 함께 해당 줄에만 비활성화한다.
  - 상태가 바뀔 때마다 `serialize`로 저장한다. 단, 마운트 시점의 첫 읽기가 끝나기 전에는 저장하지 않는다(샘플이 저장된 값을 덮어쓰지 않게).
  - 안내(`role="status"`): `result === "invalid"`이면 "저장된 내용을 읽지 못해 샘플로 시작했어요.", 저장이 예외를 던지면(Review Focus 4) "이 브라우저에서는 저장할 수 없어서 새로고침하면 사라져요."를 한 번만. 요약 문구(예: "페이지 3개 중 발행 가능 0개")도 같은 방식으로 스크린 리더에 알린다.
  - 위쪽에 고정 안내문(Global Constraints의 문구)과 `summarize` 요약을 보여 준다.
  - 페이지 목록: 선택 버튼(`aria-pressed`), 각 페이지의 발행 가능/미완료 표시, 삭제 버튼. 삭제는 "삭제할까요?" + [삭제] [취소] 확인 단계를 거친다. 선택된 페이지를 지우면 선택이 남은 첫 페이지로, 없으면 `null`로 옮긴다(Review Focus 3). 목록이 비면 "페이지가 없어요. 아래에서 추가하거나 샘플로 되돌려 주세요."를 보여 준다(Review Focus 2).
  - 페이지 추가: 레이블 있는 텍스트 입력(`maxLength={NAME_MAX}`)과 추가 버튼. id는 `crypto.randomUUID()`가 없으면 `Date.now()` 기반 문자열을 쓴다.
  - 선택 페이지: `GROUPS` 순서대로 `CHECKLIST`를 `fieldset`+`legend`로 묶고, 항목마다 레이블 있는 `<select>`(옵션은 `STATUS_LABELS`)를 둔다. 메모 입력은 `maxLength={NOTE_MAX}`.
  - "샘플로 되돌리기"는 확인 단계(버튼 두 개)를 거쳐 `createSampleState()`로 교체한다.
  - 새 `aria-live`나 애니메이션을 추가하지 않는다. 포커스는 확인 단계가 열리고 닫힐 때 해당 버튼으로 돌려준다.

- [ ] **Step 2: `components/QaDashboard.module.css`를 만든다.** 점선 테두리 카드, `var(--space-*)`, `var(--color-*)`만 쓴다. 버튼·select·입력은 `min-height: 44px`. 좁은 화면은 한 열이고, 넓은 화면(`min-width: 48rem`)에서 목록과 체크리스트를 두 열로 나눈다. 긴 이름은 `overflow-wrap: anywhere`로 줄 바꿈해 가로 스크롤이 생기지 않게 한다.

- [ ] **Step 3: `app/qa-dashboard/page.tsx`를 만든다.** `app/log/page.tsx` 패턴을 따라 `metadata`(title: `"발행 점검 체크리스트 | 김영빈"`, 설명 한 문장)와 `<main id="main" className="container">`, `<h1>`, 고정 안내문(서버에서 그려 JS 없이도 보이게), `<QaDashboard />`, 홈으로 돌아가는 `Link`를 둔다. 홈 내비게이션에는 넣지 않는다.

- [ ] **Step 4: 정적 확인** — `npm test`, `npm run lint`, `npm run build`. 빌드 출력에 `/qa-dashboard`가 정적(`○`)으로 나와야 한다.

- [ ] **Step 5: 브라우저 확인** (`npm run dev`, 포트 3000)
  - 상태 변경 → 새로고침 후 유지, 메모 유지.
  - 개발자 도구에서 `localStorage.setItem("qa-dashboard:v1","{")` 후 새로고침 → 샘플로 시작하고 안내가 나온다.
  - `Storage.prototype.setItem`이 예외를 던지게 한 뒤 상태 변경 → 화면은 계속 동작하고 안내가 한 번 나온다.
  - 모든 페이지 삭제 → 빈 상태 문구와 요약 0. 샘플로 되돌리기 → 복구.
  - 키보드만으로 선택·상태 변경·추가·삭제·확인 단계를 끝까지 조작한다.
  - 320px: `scrollWidth === innerWidth`, 컨트롤 높이 44px 이상(스크립트로 측정).

- [ ] **Step 6: 커밋**

```bash
git add components/QaDashboard.tsx components/QaDashboard.module.css app/qa-dashboard/page.tsx
git commit -m "feat: add QA dashboard page"
```

---

### Task 4: 포트폴리오 사례 연결과 최종 검증

**Files:**
- Create: `content/projects/cms-publishing-qa-dashboard.mdx`

**Interfaces:**
- Consumes: 라우트 `/qa-dashboard` (Task 3), 프로젝트 front matter 형식(`README.md`의 "프로젝트 추가하기")

- [ ] **Step 1: MDX를 쓴다.** front matter: `title: 발행 점검 체크리스트 데모`, 한두 문장 `summary`, `kind: frontend`, `role: 설계, 구현 (개인 프로젝트)`, `stack`은 Next.js, React, TypeScript, CSS Modules, Vitest, `order: 5`. `liveUrl`/`repoUrl`/`image`는 넣지 않는다. 본문은 `## 문제 / ## 역할 / ## 구현 / ## 확인할 수 있는 것` 순서. 문제는 "개인 학습 목적의 데모"라는 사실만 쓰고 실제 업무 문제를 지어내지 않는다. 구현에는 순수 로직 분리, localStorage 검증, 접근성 처리를 사실대로 쓴다. 본문에 `[데모 열어 보기](/qa-dashboard)` 상대 링크와 "별도 개인 프로젝트이고 샘플 데이터만 쓴다"는 문장을 넣는다. 성과 수치·실제 업무 적용 표현은 쓰지 않는다.

- [ ] **Step 2: 전체 검증** — `npm test`(전체 PASS), `npm run lint`, `npm run build`(`/projects/cms-publishing-qa-dashboard`와 `/qa-dashboard` 생성), `git diff --check`.

- [ ] **Step 3: 브라우저 확인** — 홈 목록에 새 카드가 나오고, 상세 페이지의 데모 링크가 `/qa-dashboard`로 열리며, 320px에서 가로 스크롤이 없다. 홈과 상세에 고객·병원 이름이 없는지 본문을 훑는다.

- [ ] **Step 4: 커밋**

```bash
git add content/projects/cms-publishing-qa-dashboard.mdx
git commit -m "feat: add QA dashboard case study"
```

푸시는 하지 않고 결과를 보고한 뒤 사용자 승인을 받는다.
