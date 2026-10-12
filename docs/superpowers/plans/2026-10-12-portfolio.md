# 포트폴리오 사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 웹 퍼블리셔 → 프론트엔드 전환을 보여주는 취업용 포트폴리오 사이트를 Next.js + TypeScript로 만들어 Vercel에 배포한다.

**Architecture:** Next.js App Router 정적 생성(SSG). 프로젝트 콘텐츠는 `content/projects/*.mdx`(front matter + 본문)로 두고 `lib/projects.ts`가 읽어 타입이 보장된 데이터로 돌려준다. 스타일은 CSS Modules + `styles/tokens.css`의 CSS 변수. 메인은 단일 스크롤 페이지, 프로젝트 상세는 `/projects/[slug]`, 기록은 `/log` 뼈대만.

**Tech Stack:** Next.js (App Router), React, TypeScript, CSS Modules, MDX(`gray-matter` + `next-mdx-remote/rsc`), Vitest, Vercel. 버전은 실행 시점의 최신 안정 버전을 쓰고 `docs/decisions.md`에 기록한다.

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-design.md`

## Global Constraints

- Tailwind를 쓰지 않는다. 스타일은 CSS Modules + CSS 변수(`styles/tokens.css`)만 쓴다.
- 외부 CMS, 다크 모드, 커스텀 도메인, `/log` 실제 글 작성, 애니메이션 중심 효과는 만들지 않는다.
- 디자인 방향은 "B. 도면 노트": 방안지 격자 배경, 모노스페이스 중심, 형광 포인트 색 하나. 색 2~3개, 글꼴 1~2개로 제한한다.
- 피할 것: 보라/파랑 그라데이션, 유리 효과, 글로우, "중앙 정렬 Hero + 카드 3개" 템플릿, 이모지 아이콘, 의미 없는 둥근 카드와 그림자 반복, "혁신적인/열정적인" 같은 뻔한 문구.
- 색, 글꼴, 레이아웃 방향, 소개 문구는 AI가 임의로 정하지 않는다. 선택지를 보여주고 작성자가 고른 값만 쓴다.
- 반응형(모바일/태블릿/데스크톱)과 접근성(시맨틱 태그, 키보드 이동, 명도 대비)을 필수로 한다.
- 기존 사이트(`https://team-library.biny.cloud/portfolio-recruiting-2026/`)는 "더 자세한 퍼블리싱 기록" 링크 한 줄로만 연결한다. 콘텐츠는 재사용하되 문구와 구성은 새로 쓴다.
- 학습 원칙: 각 Task 시작 전에 "무엇을, 왜"를 설명하고, 선택의 이유를 `docs/decisions.md`에 한 항목씩 남긴다. 주석은 "왜"가 비자명한 곳에만 단다. `[직접 해보기]`가 붙은 단계는 작성자가 원하면 안내만 하고 작성자가 직접 작성한다.
- 테스트는 콘텐츠 로딩/필터링 로직에만 둔다. 화면은 빌드 성공, 반응형, 접근성 점검으로 확인한다.

## Review Focus

- front matter에 필수 항목이 빠진 MDX 파일: 빌드가 파일명과 빠진 필드를 밝히며 실패해야 한다 (Task 2에서 테스트).
- 존재하지 않는 `/projects/없는-슬러그`: 404 페이지가 나와야 한다 (Task 6에서 확인).
- 프로젝트가 0개이거나 필터 결과가 0개: 빈 화면이 아니라 안내 문구가 보여야 한다 (Task 4에서 테스트).
- 프로젝트 정렬: 파일 시스템 순서에 의존하지 않고 `order` 값으로 항상 같은 순서여야 한다 (Task 2에서 테스트).
- 320px 폭에서 긴 한글 제목과 모노스페이스 코드 조각: 가로 스크롤이나 잘림이 없어야 한다 (Task 7에서 확인).

---

### Task 1: 프로젝트 생성과 기록 체계

**Why (학습):** Next.js 프로젝트가 만들어 주는 파일들의 역할을 먼저 이해해야 이후 구조 결정을 설명할 수 있다. 테스트 도구도 이 단계에서 같이 갖춘다.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx` (create-next-app이 생성)
- Create: `docs/decisions.md`, `vitest.config.ts`
- Modify: `package.json` (scripts에 `test` 추가)

**Interfaces:**
- Produces: 루트 별칭 `@/*` (프로젝트 루트 기준 import), 명령 `npm run dev|build|test`.

- [ ] **Step 1: 현재 폴더에 Next.js 생성**

Run: `npx create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*"`
Expected: `package.json`과 `app/` 생성. 기존 `docs/`, `.git`은 보존된다. 폴더가 비어 있지 않다는 확인이 나오면 `docs/`만 있음을 확인하고 진행한다.

- [ ] **Step 2: Vitest 설치 및 설정**

Run: `npm install -D vitest`
`vitest.config.ts`에서 `@` 별칭을 프로젝트 루트로 매핑하고 `tests/**/*.test.ts`만 대상으로 한다. `package.json`의 `"test": "vitest run"`.

- [ ] **Step 3: `docs/decisions.md` 작성**

항목 형식은 `## YYYY-MM-DD 제목` / `선택` / `이유` / `버린 대안`. 최초 항목 4개: Next.js 선택(Vite SPA, 외부 CMS를 버린 이유), 정적 생성, CSS Modules 선택(Tailwind를 버린 이유), 설치된 실제 버전.

- [ ] **Step 4: 기본 동작 확인**

Run: `npm run build && npm test -- --passWithNoTests`
Expected: 빌드 성공, 테스트는 0개로 통과.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app, vitest, decisions log"
```

### Task 2: 콘텐츠 타입과 로더

**Why (학습):** 프로젝트 정보를 코드가 아니라 파일에 두면 항목 추가가 쉽다. 대신 파일 내용이 약속된 모양인지 검증해야 하고, 이것이 TypeScript를 실제로 쓰는 지점이다.

**Files:**
- Create: `lib/types.ts`, `lib/projects.ts`
- Create: `tests/projects.test.ts`, `tests/fixtures/valid/a.mdx`, `tests/fixtures/valid/b.mdx`, `tests/fixtures/invalid/missing-title.mdx`

**Interfaces:**
- Produces:
  - `type ProjectKind = 'publishing' | 'frontend'`
  - `type ProjectMeta = { slug: string; title: string; summary: string; kind: ProjectKind; role: string; stack: string[]; order: number; liveUrl?: string; repoUrl?: string }`
  - `type Project = { meta: ProjectMeta; content: string }`
  - `getAllProjects(dir?: string): ProjectMeta[]` — `order` 오름차순, 같으면 `slug` 오름차순. `dir` 기본값은 `content/projects`.
  - `getProject(slug: string, dir?: string): Project | null`
  - `getProjectSlugs(dir?: string): string[]`
- `slug`는 파일명(확장자 제외)에서 얻는다. front matter에는 두지 않는다.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/projects.test.ts`에 다음 이름으로 작성한다.
- `getAllProjects sorts by order then slug`: fixtures/valid에서 `order`가 큰 쪽이 뒤에 오고, 같으면 slug 순.
- `getAllProjects throws naming file and missing field`: invalid 폴더 호출 시 에러 메시지에 `missing-title.mdx`와 `title`이 모두 포함.
- `getProject returns null for unknown slug`: `getProject('nope', validDir)`가 `null`.
- `getProject returns body without front matter`: `content`에 `---`가 없다.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL (`lib/projects` 없음)

- [ ] **Step 3: `lib/types.ts`, `lib/projects.ts` 구현**

`gray-matter`로 front matter를 파싱하고, 필수 필드(`title`, `summary`, `kind`, `role`, `stack`, `order`) 검증 후 누락 시 파일명과 필드명을 담아 `Error`를 던진다. `kind`가 두 값 외이면 같은 방식으로 던진다. 의존성: `npm install gray-matter`.

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: PASS (4개)

- [ ] **Step 5: Commit**

```bash
git add lib tests package.json package-lock.json
git commit -m "feat: add typed project content loader"
```

### Task 3: 디자인 토큰과 전역 레이아웃

**Why (학습):** 색과 간격을 CSS 변수 한 곳에 모으면 디자인 변경이 한 파일로 끝난다. 퍼블리싱 경력이 가장 잘 드러나는 자리라 작성자가 직접 고른 값으로 채운다.

**Files:**
- Create: `styles/tokens.css`, `styles/globals.css`, `components/SiteHeader.tsx`, `components/SiteHeader.module.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS 변수 `--color-bg`, `--color-bg-grid`, `--color-text`, `--color-text-muted`, `--color-accent`, `--font-body`, `--font-mono`, `--space-1`…`--space-6`, `--content-max`. `SiteHeader()`는 props 없는 서버 컴포넌트로 `#about`, `#projects`, `#contact` 앵커 링크를 가진다.

- [ ] **Step 1: [직접 해보기] 값 선택**

작성자에게 선택지를 보여준다: 배경/글자/형광 포인트 색 조합 2~3안, 한글 본문 글꼴(한글 지원 필수)과 영문 모노 글꼴 후보. 모노스페이스 글꼴은 한글을 못 그리는 경우가 많으니 한글 본문과 영문 라벨/코드 글꼴을 분리한다는 점을 설명하고 선택을 `docs/decisions.md`에 기록한다.

- [ ] **Step 2: `styles/tokens.css` 작성**

선택한 값을 위 변수로 정의한다. 방안지 격자는 `globals.css`의 `body` 배경으로 `linear-gradient` 두 겹, 20px 간격 (격자선 전용이며 장식 그라데이션이 아니다).

- [ ] **Step 3: `globals.css`, `layout.tsx`, `SiteHeader` 구현**

`next/font`로 글꼴을 불러오고 `<html lang="ko">`. 키보드 포커스 표시(`:focus-visible`)를 전역에 정의하고, `prefers-reduced-motion: reduce`에서 전환 효과를 끈다. 본문 첫 요소 앞에 "본문으로 건너뛰기" 링크를 둔다.

- [ ] **Step 4: 명도 대비 확인**

본문 텍스트와 링크, 포인트 색 위 텍스트 모두 4.5:1 이상인지 대비 검사 도구로 확인하고 결과를 `docs/decisions.md`에 한 줄 남긴다.
Run: `npm run build`
Expected: 성공

- [ ] **Step 5: Commit**

```bash
git add styles components app
git commit -m "feat: design tokens, global styles, site header"
```

### Task 4: Hero, About, Projects 섹션

**Why (학습):** 서버 컴포넌트(기본)와 클라이언트 컴포넌트(상태가 필요할 때만)를 구분하는 연습 지점이다. 필터만 클라이언트로 만들고 나머지는 서버에 둔다.

**Files:**
- Create: `components/Hero.tsx`, `components/About.tsx`, `components/ProjectCard.tsx`, `components/ProjectList.tsx` (`'use client'`), 각 `.module.css`
- Create: `lib/filter.ts`, `tests/filter.test.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getAllProjects()`, `ProjectMeta`, `ProjectKind` (Task 2).
- Produces:
  - `type KindFilter = 'all' | ProjectKind`
  - `filterProjects(projects: ProjectMeta[], filter: KindFilter): ProjectMeta[]`
  - `<ProjectList projects={ProjectMeta[]} />` — 필터 버튼(전체/퍼블리싱/프론트엔드)과 카드 목록. 결과 0개면 "해당하는 프로젝트가 아직 없어요." 문구를 보여준다.
  - `<ProjectCard project={ProjectMeta} />` — 제목, 요약, 역할, 스택, `/projects/{slug}` 링크.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/filter.test.ts`: `filterProjects returns all for 'all'`, `filterProjects returns only matching kind`, `filterProjects returns empty array when nothing matches` (빈 배열 입력과 일치 없음 둘 다).

- [ ] **Step 2: 실패 확인**

Run: `npm test -- filter`
Expected: FAIL

- [ ] **Step 3: `lib/filter.ts` 구현 후 통과 확인**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: [직접 해보기] Hero와 About 문구 작성**

기존 사이트의 문구를 복사하지 않는다. 작성자 본인 말투와 실제 경험(퍼블리싱에서 겪은 일, 전환하려는 이유)으로 한 줄 소개와 전환 스토리를 쓴다. 작성자가 쓴 문구가 없으면 문구 후보 2~3개를 제시하고 고르게 한다. 레이아웃은 "중앙 정렬 Hero" 대신 도면 노트 방향(왼쪽 치우친 큰 모노 제목, `margin`/`padding` 치수선 같은 구조 표시)으로 구성한다. 기존 사이트 링크 한 줄("더 자세한 퍼블리싱 기록")을 About에 넣는다.

- [ ] **Step 5: 컴포넌트 구현과 `page.tsx` 조립**

`app/page.tsx`는 서버에서 `getAllProjects()`를 호출해 `ProjectList`에 넘긴다. 섹션 `id`는 `about`, `projects`, `contact`(Contact는 Task 6).

- [ ] **Step 6: 확인과 Commit**

Run: `npm run build`
Expected: 성공

```bash
git add -A
git commit -m "feat: hero, about, filterable project list"
```

### Task 5: 프로젝트 콘텐츠 작성

**Why (학습):** 상세 페이지의 "문제 → 해결 → 결과" 글이 전환 스토리의 핵심 증거다. 코드보다 내용의 질이 평가를 좌우한다.

**Files:**
- Create: `content/projects/gulp-template.mdx`, `content/projects/ezmedicom.mdx`, `content/projects/yuni-wine.mdx`, `content/projects/<frontend-project>.mdx` (최소 1개)

**Interfaces:**
- Consumes: front matter 형식은 Task 2의 `ProjectMeta` (slug 제외).

- [ ] **Step 1: [직접 해보기] 퍼블리싱 3건 작성**

기존 사이트의 사실 정보(역할, 구현 내용, 공개 URL)만 가져오고 문장은 새로 쓴다. 비공개 정보는 쓰지 않는다. `kind: publishing`, `order` 1~3.

- [ ] **Step 2: [직접 해보기] 프론트엔드 프로젝트 최소 1개 작성**

작성자가 JS/React로 만든 개인 프로젝트 중 가장 보여줄 만한 것을 고르고 `kind: frontend`, `order` 0으로 맨 앞에 둔다. 만든 이유, 막혔던 부분과 해결 과정, 사용 기술을 쓴다. 작성자가 아직 제공하지 않았으면 이 Task를 멈추고 요청한다. 내용을 지어내지 않는다.

- [ ] **Step 3: 로더 검증**

Run: `npm test && npm run build`
Expected: 모든 front matter가 검증을 통과한다.

- [ ] **Step 4: Commit**

```bash
git add content
git commit -m "content: add project entries"
```

### Task 6: 프로젝트 상세, Contact, /log 뼈대

**Why (학습):** 동적 라우트(`[slug]`)와 `generateStaticParams`로 파일 개수만큼 페이지가 빌드 시 미리 만들어지는 정적 생성 원리를 보여주는 지점이다.

**Files:**
- Create: `app/projects/[slug]/page.tsx`, `app/projects/[slug]/page.module.css`, `components/Contact.tsx`, `components/Contact.module.css`, `app/log/page.tsx`
- Modify: `app/page.tsx` (Contact 추가), `app/layout.tsx` (metadata)

**Interfaces:**
- Consumes: `getProject`, `getProjectSlugs` (Task 2).
- Produces: `generateStaticParams(): { slug: string }[]`. `getProject`가 `null`이면 `notFound()`. 본문은 `next-mdx-remote/rsc`의 `MDXRemote`로 렌더한다 (`npm install next-mdx-remote`). `generateMetadata`는 프로젝트 `title`, `summary`를 쓴다.

- [ ] **Step 1: 상세 페이지 구현**

헤더 영역에 역할, 스택, `liveUrl`/`repoUrl` 링크(있을 때만, 새 탭 링크에는 `rel="noopener noreferrer"`), 본문은 MDX. 메인으로 돌아가는 링크.

- [ ] **Step 2: Contact와 /log 구현**

Contact는 이메일(`salbulkyb@gmail.com`)과 GitHub 링크. `/log`는 "기록은 곧 채워질 예정이에요." 한 줄과 메인 링크만 둔다 (글 로딩 코드 없음). 사이트 기본 `metadata`(title, description, Open Graph)를 `layout.tsx`에 설정한다. GitHub 주소는 작성자에게 받아서 쓴다.

- [ ] **Step 3: 존재하지 않는 경로 확인**

Run: `npm run build && npx next start` 후 `/projects/nope` 접속
Expected: 404 페이지. 빌드 결과에 `content/projects` 파일 수만큼 `/projects/[slug]`가 정적 생성되어 표시된다.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: project detail pages, contact, log skeleton, metadata"
```

### Task 7: 반응형과 접근성 점검

**Why (학습):** 퍼블리셔 경력의 신뢰도는 여기서 결정된다. 점검 결과를 숫자와 항목으로 남기면 면접에서 그대로 쓸 수 있다.

**Files:**
- Modify: 점검에서 나온 문제의 해당 `.module.css`/컴포넌트
- Modify: `docs/decisions.md` (점검 결과 기록)

- [ ] **Step 1: 폭별 점검**

320px, 768px, 1280px에서 메인과 프로젝트 상세를 열고 가로 스크롤 없음, 긴 한글 제목과 코드 조각 잘림 없음, 터치 대상 크기 확인.

- [ ] **Step 2: 키보드와 구조 점검**

Tab만으로 모든 링크/버튼에 도달, 포커스 표시가 항상 보임, 건너뛰기 링크 동작, 제목 레벨(h1은 페이지당 1개) 순서, 이미지 `alt`, 필터 버튼의 선택 상태가 보조기술에 전달됨(`aria-pressed`)을 확인한다.

- [ ] **Step 3: 수정과 기록**

발견한 문제를 고치고, 확인한 항목과 결과를 `docs/decisions.md`에 한 항목으로 남긴다.
Run: `npm run lint && npm run build && npm test`
Expected: 모두 성공

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: responsive and accessibility pass"
```

### Task 8: 배포

**Why (학습):** push하면 자동 배포되는 흐름(CI/CD)을 한 번 경험하고 설명할 수 있게 된다.

**Files:**
- Create: `README.md` (실행 방법, 구조, 기술 선택 요약과 `docs/decisions.md` 링크)

- [ ] **Step 1: [직접 해보기] GitHub 저장소와 Vercel 연결**

계정 생성, 로그인, 저장소 공개 여부 선택, Vercel 연결은 작성자가 직접 한다. 에이전트는 단계 안내와 `git remote add origin <URL>`, `git push -u origin main` 명령 준비까지만 한다. 푸시와 배포는 작성자의 명시적 승인 후에만 실행한다.

- [ ] **Step 2: 배포 확인**

배포된 `*.vercel.app` 주소에서 메인, 프로젝트 상세 하나, `/log`, 존재하지 않는 경로(404)를 확인하고, 링크 공유 시 미리보기(제목, 설명)가 나오는지 확인한다.

- [ ] **Step 3: README와 Commit**

```bash
git add README.md
git commit -m "docs: add README"
```
