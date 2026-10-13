# CMS 데모를 원본과 같은 HTML로 만들기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (인라인) to implement this plan task-by-task.

**Goal:** `/cms-preview`가 만드는 HTML 소스를 원본 CMS 도구의 출력과 같게 만든다. 클래스 이름(`cms-*`, `typeNN`, Bootstrap `row`/`col-*`/`d-*`/`img-fluid` 등), 요소 중첩, 도형 `<svg>`가 같아서 원본 CSS를 쓰는 실제 CMS에 그대로 붙여 쓸 수 있어야 한다.

**Architecture:** 기존 구조(스키마 편집기, `CmsType`, 레지스트리, 샌드박스 iframe)는 그대로 두고, 타입별 `View`를 원본 마크업으로 다시 쓴다. 미리보기용 CSS는 계속 새로 쓰되 원본 클래스 이름을 대상으로 한다(Bootstrap 격자와 유틸리티는 쓰는 것만 직접 구현).

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest. 새 의존성 없음.

**Spec:** `docs/superpowers/specs/2026-10-14-cms-25-types-design.md` — 이 계획은 그 설계의 아래 항목을 **사용자 결정(2026-10-14, 옵션 A, 공개 저장소 허용)으로 바꾼다.**
- "원본의 클래스 이름을 가져오지 않는다 / `demo-`로 바꾼다" → **원본 클래스 이름을 그대로 쓴다.**
- "Bootstrap 의존성 없음" → Bootstrap 패키지는 쓰지 않지만 **Bootstrap 클래스 이름은 그대로** 쓰고, 미리보기 CSS에 필요한 규칙만 직접 쓴다.
- 도형 SVG를 가져오지 않는다 → **원본 `<svg>`를 그대로 포함한다.**
- 그대로 유지: 원본의 CSS, 문구, 이미지 주소, Supabase, 메뉴 관리자, 슬라이드 관리자, 이미지 업로드, 타입 27·28은 가져오지 않는다.

## Global Constraints

- 같은 입력이면 원본과 같은 HTML이어야 한다: 같은 태그 순서, 같은 `class` 문자열(원본의 공백까지), 같은 조건부 출력(비어 있으면 넣지 않는 요소, 모바일 이미지가 PC 이미지에 기대는 조건 포함).
- 예외(안전): 이미지 주소는 `safeImageSrc`를 거친다. `rich` 필드는 `sanitizeInline` 결과만 `dangerouslySetInnerHTML`에 넣는다. 선택 변형은 원본 값(`col-6` 등)을 옵션 값으로 쓰되 목록에 없는 값은 기본값으로 바꾼다. 이미지 `alt`는 원본의 의미 없는 `"box"` 대신 `""`로 한다.
- 원본 CSS를 복사하지 않는다. 문구와 이미지는 일반 안내형 샘플만 쓴다.
- 입력 한도(글 120, 제목 쌍 60, 본문 600, 이미지 주소 200, 목록 12, 하위 목록 8, 표 10행×6열, 셀 100)와 기존 편집기 동작은 유지한다.
- 각 작업 끝에 `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`가 통과해야 한다. 구현은 `main`이 아닌 브랜치에서 하고 병합과 푸시는 사용자 승인 뒤에만 한다.

## Review Focus

1. 같은 입력이면 원본과 같은 HTML인가: `class` 문자열(공백 포함), 조건부 요소, SVG. (Task 1~5의 타입별 테스트)
2. 안전: 원본 클래스 이름으로 바뀌어도 `rich` 필터, 이미지 주소 검사, 선택 변형 화이트리스트, `sandbox=""`가 그대로인가.
3. 미리보기에서 PC/모바일 전환이 Bootstrap `lg`(992px) 기준으로 실제로 보이는가.
4. `demo-` 클래스가 소스나 미리보기 CSS에 하나도 남지 않았는가.
5. 기존 레지스트리 일반 테스트가 새 기준으로 모든 타입을 검사하는가.

## 원본 마크업의 공통 규칙 (모든 Task가 따른다)

- 루트: `<section className="cms typeNN …">` > `<div className="cms-inner">` > 머리글(`<div className="cms-header top-border">` + 작은 글(있을 때) `cms-eyebrow` + 큰 글 `cms-title`).
- 머리글 변형: 타입 01은 `cms-header`(top-border 없음)와 `cms-thin-title`, 타입 20·21·23은 큰 글이 비어 있으면 넣지 않고, 타입 21은 `cms-header top-border left-type`.
- 이미지 쌍: PC는 `img-fluid d-none d-lg-block`(또는 타입별로 `d-none d-lg-block`만), 모바일은 `w-100 d-block d-lg-none`(또는 `img-fluid d-block d-lg-none`). 타입별 정확한 문자열은 Task에서 원본대로 쓴다. 타입 18·20·21·22·23·25는 모바일 이미지가 **PC 이미지가 있을 때만** 나온다(원본의 조건).
- 도형: 타입 02 오각형(286×274), 09 원형 체크(40×40), 10·16·19 육각형(276×244), 13·14 작은 체크(18×14)의 `<svg>`를 원본 속성과 경로 그대로 쓴다. 원본의 `id="path"` 중복도 그대로다.

## File Structure

| 파일 | 책임 |
|---|---|
| `lib/cms/types/parts.tsx` | (수정) `TitleBlock`(원본 머리글), `Img`(조건부 이미지), 도형 SVG 컴포넌트 4종, `listField`/`imageFields`/`titleField` 유지 |
| `lib/cms/preview.ts` | (수정) `BASE_CSS`: Bootstrap 부분 구현(격자, `d-*`, 유틸리티, `lg`=992px) + 공통 `cms-*` 스타일 |
| `lib/cms/types/typeNN.tsx` | (수정) `View`를 원본 마크업으로, `css`를 원본 클래스 대상으로 |
| `components/CmsPreview.tsx`, `.module.css` | (수정) "PC" 미리보기를 고정 폭(1100px, 가로 스크롤)으로 |
| `tests/cms-*.test.ts` | (수정) `demo-` 기대값을 원본 클래스 기대값으로 |

---

### Task 1: 기반 — 공통 CSS, 공통 부품, 레지스트리 기준, 미리보기 폭, 타입 01
### Task 2: 타입 02~07
### Task 3: 타입 09~15
### Task 4: 타입 16~21
### Task 5: 타입 22~26
### Task 6: 문구와 기록 정리, 최종 검토, 병합·푸시(승인 후)

각 Task는 "테스트를 원본 기준으로 먼저 고쳐 실패를 확인 → View/CSS를 원본 마크업으로 구현 → 전체 검증 → 브라우저에서 모양과 동작 확인 → 커밋" 순서로 진행한다. 타입별 원본 마크업은 원본 배포의 `TypeNN.jsx`(읽기 전용)를 따른다.
