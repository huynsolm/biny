# CMS 컴포넌트 미리보기 데모 설계

작성일: 2026-10-13

## 1. 목적과 배경

- **목적**: 채용 담당자가 "텍스트를 입력하면 CMS 컴포넌트의 HTML 소스가 만들어지고, 결과가 바로 보이는" 흐름을 직접 눌러 보게 한다.
- **배경**: 근무 시간 외에 직접 만든 React 기반 CMS 컴포넌트 도구(타입 01~26 고도화)는 공개용으로 정리되지 않았고 외부 샘플 이미지를 쓰고 있어, 포트폴리오에 소스나 화면을 연결하지 않는다. 원본은 별도 계정에 Git 연결 없이 배포되어 있어 저장소로는 찾을 수 없고, 코드는 복사하지 않는다.
- **성격**: 같은 흐름을 샘플 데이터로 새로 만든 개인 데모. 원본의 타입별 마크업, 클래스 이름, 코드, 이미지 서버, 관리자 기능은 가져오지 않는다. 원본 작업(타입 01~26)의 근거로 쓰지 않는다.
- **데이터**: 샘플 데이터만. 서버, DB, 외부 이미지 서버, 업로드, 로그인, 저장(localStorage 포함)은 없다. 새로고침하면 기본값으로 돌아간다.
- **성공 기준**: 포트폴리오에서 링크로 열어 몇 분 안에 입력 → 소스 → 미리보기가 확인되고, 입력한 `<script>` 등이 실행되지 않으며, 고객·병원·내부 도구 정보나 성과 수치가 어디에도 없다.

## 2. 범위

**포함**: 컴포넌트 타입 3개, 입력 폼, 실시간 HTML 소스, 소스 복사, 샌드박스 미리보기.

**제외 (YAGNI)**: 타입 4개 이상, 이미지 업로드, 저장/불러오기, 메뉴·사이트맵·슬라이드 관리, 다국어, 소스 편집(소스 창은 읽기 전용).

## 3. 위치와 구조

이 저장소의 `/cms-preview` 경로. 홈 내비게이션에는 넣지 않고 `react-cms-preview` 사례 페이지의 링크로만 연결한다.

```
app/cms-preview/page.tsx           제목, 안내문, <CmsPreview />
components/CmsPreview.tsx          타입 선택, 입력 폼, 소스 창, 복사 버튼, 미리보기 iframe (클라이언트 컴포넌트)
components/CmsPreview.module.css
lib/cms/html.ts                    escapeHtml, safeImageSrc
lib/cms/components.ts              타입 정의, 기본값, 길이 제한, renderHtml
public/images/cms-sample.svg       샘플 이미지
content/projects/react-cms-preview.mdx   데모 링크 한 단락 추가
tests/cms-html.test.ts, tests/cms-components.test.ts
```

경계: `lib/cms/*`는 React와 브라우저 API를 모른다. 컴포넌트는 `renderHtml` 결과를 소스 창과 iframe에 그대로 쓴다. 소스와 미리보기는 같은 문자열이라 어긋날 수 없다.

## 4. 데이터 모델과 출력

```ts
type ComponentTypeId = "title" | "media" | "cards";
type Card = { title: string; description: string };
type CmsValues = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cards: Card[];          // 2~4개
};
renderHtml(type: ComponentTypeId, values: CmsValues): string
```

타입별 필드: `title` = 제목, 설명 / `media` = 이미지 주소, 대체 텍스트, 제목, 설명 / `cards` = 제목, 카드 2~4개(카드마다 제목과 설명).

**출력 마크업** (들여쓰기 2칸, 줄바꿈 `\n`, 모든 값은 `escapeHtml`을 거친다. 비어 있는 제목·설명 요소는 출력하지 않는다. 클래스 이름은 `demo-` 접두사):

```html
<!-- title -->
<section class="demo-block demo-title">
  <h2 class="demo-heading">…</h2>
  <p class="demo-desc">…</p>
</section>

<!-- media -->
<section class="demo-block demo-media">
  <img class="demo-image" src="…" alt="…">
  <div class="demo-body">
    <h2 class="demo-heading">…</h2>
    <p class="demo-desc">…</p>
  </div>
</section>

<!-- cards -->
<section class="demo-block demo-cards">
  <h2 class="demo-heading">…</h2>
  <ul class="demo-card-list">
    <li class="demo-card">
      <h3 class="demo-card-title">…</h3>
      <p class="demo-card-desc">…</p>
    </li>
  </ul>
</section>
```

- `media`의 대체 텍스트가 비어 있으면 `alt=""`(장식 이미지)로 출력한다. 폼에는 "비워 두면 장식 이미지로 처리돼요" 안내를 둔다.
- 기본값은 일반적인 문구만 쓴다("제목을 입력해 보세요" 같은 안내형). 병원·고객·서비스 이름은 쓰지 않는다.

## 5. 안전 장치

- **이스케이프**: `escapeHtml`은 `& < > " '`를 변환한다.
- **이미지 주소**: `safeImageSrc(value)`는 `/`로 시작(단 `//`로 시작하는 프로토콜 상대 주소는 제외)하거나 `https://`로 시작하는 값만 통과시키고, 그 밖(빈 값, `javascript:`, `data:`, `http:` 등)은 기본값 `/images/cms-sample.svg`로 대체한다.
- **미리보기**: `<iframe sandbox="" srcDoc=…>`. 스크립트와 같은 출처 접근이 모두 막힌다. iframe 안에는 데모용으로 새로 쓴 CSS만 넣는다.
- **길이 제한**: 제목 60자, 설명 300자, 카드 설명 120자, 카드 제목 60자, 이미지 주소 200자, 대체 텍스트 120자. 입력에는 `maxLength`를 걸고, `renderHtml`도 같은 상한으로 자른다(입력이 우회되어도 안전하게).
- 카드 수는 2~4개로 고정 범위를 벗어난 값은 범위로 맞춘다.

## 6. 화면

- 위쪽: 제목, 항상 보이는 안내문 "샘플 데이터예요. 서버에 저장되지 않고, 개인이 만든 데모예요."
- 본문: 타입 선택(네이티브 `<select>`) → 입력 폼 → HTML 소스(읽기 전용 `<textarea>`/`<pre>`, 모노 글꼴) + "소스 복사" 버튼 → 미리보기 iframe.
- 카드 타입은 "카드 추가"/"카드 삭제" 버튼으로 2~4개 범위에서 조절한다. 범위 한계에서는 해당 버튼을 비활성화한다.
- 복사: `navigator.clipboard.writeText`. 결과("복사했어요" / "복사하지 못했어요. 소스 창에서 직접 선택해 복사해 주세요.")를 `role="status"`로 알린다. 클립보드를 못 쓰면 소스 창의 텍스트를 선택해 준다.
- 타입을 바꿔도 입력값은 유지한다(필드를 공유). 보이지 않는 필드의 값은 출력에 영향을 주지 않는다.
- 스타일은 `styles/tokens.css` 변수와 점선 카드 언어를 쓴다. 그라데이션, 장식 그림자, 허위 지표는 쓰지 않는다. 넓은 화면에서는 폼과 결과를 두 열, 좁은 화면에서는 한 열로 쌓는다.

## 7. 접근성

- 모든 입력에 보이는 레이블. 버튼·select·입력의 높이 44px 이상. iframe에 `title="HTML 미리보기"`.
- 소스 창에는 레이블("생성된 HTML 소스")이 있다. 복사 결과는 `role="status"`.
- 320px에서 가로 스크롤이 없다(소스 창은 창 안에서 가로로 스크롤한다). `prefers-reduced-motion`을 지키고 새 애니메이션은 없다.

## 8. 포트폴리오 연결

- `react-cms-preview.mdx`의 "확인할 수 있는 것"에 한 단락을 추가한다: 원본 화면과 소스는 공개용으로 정리하지 않아 링크하지 않았고, 아래는 같은 흐름을 샘플 데이터로 새로 만든 데모이며 컴포넌트 타입은 3개뿐이라는 점. `[데모 열어 보기](/cms-preview)` 상대 링크.
- 스택 목록, 역할 문구, 원본 관련 기존 문구는 바꾸지 않는다. 성과 수치는 쓰지 않는다.

## 9. 테스트와 확인

- **Vitest**: `escapeHtml`(`& < > " '`, `<script>` 포함), `safeImageSrc`(허용: `/images/x.svg`, `https://…` / 거부: 빈 값, `javascript:`, `data:`, `http:`, `//evil.example`), 타입별 `renderHtml`(필수 요소, 이스케이프, 빈 제목·설명 생략, `alt=""` 처리), 카드 수 범위 보정, 길이 상한.
- **브라우저**: 입력 → 소스와 미리보기 즉시 반영, 타입 전환, 카드 추가/삭제, 복사 성공/실패 안내, `<script>alert(1)</script>` 입력이 실행되지 않고 텍스트로 보이는 것, 샘플 이미지가 iframe 안에서 보이는 것(상대 경로 해석 확인), 320px 가로 넘침, 키보드만으로 모든 조작, 44px 터치 영역.
- **빌드**: `npm test`, `npm run lint`, `npm run build`, `git diff --check`. `/cms-preview`가 정적 경로로 생성되는지 확인한다.
- 실제 스크린 리더 테스트와 접근성 점수 측정은 하지 않으며 점수는 주장하지 않는다.

## 10. 열려 있는 확인 사항

- 원본 도구의 화면을 공개할지는 작성자가 정한다(외부 샘플 이미지 사용 등을 정리한 뒤). 이 데모는 그 결정과 무관하게 새로 만든 코드만 담는다.
- 샘플 SVG는 새로 그린 단순한 도형으로 만들고 외부 이미지나 원본 이미지를 쓰지 않는다.
