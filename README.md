# 포트폴리오

반응형·접근성·CMS 운영 경험을 바탕으로 React와 Next.js로 화면을 만드는 포트폴리오 사이트예요.

배포 주소: https://biny-gilt.vercel.app (Vercel, `main`에 푸시하면 자동 배포)

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 정적 페이지 생성
npm test         # 콘텐츠 로더와 필터 테스트
npm run lint
```

Node 24에서 개발했어요.

## 구조

```
app/                 라우팅 (/, /projects/[slug], /log)
components/          Hero, About, ProjectList, ProjectCard, Contact, SiteHeader
content/projects/    프로젝트 내용 (MDX 파일, 프로젝트당 1개)
lib/                 콘텐츠 로더, 필터, 타입
styles/              디자인 토큰(색, 간격), 전역 스타일
tests/               Vitest 테스트와 픽스처
docs/                설계 문서, 구현 계획, 기술 선택 기록
```

## 프로젝트 추가하기

`content/projects/`에 `.mdx` 파일 하나를 추가해요. 파일 이름이 주소(`/projects/파일이름`)가 되고, 영문 소문자, 숫자, 하이픈만 쓸 수 있어요.

```mdx
---
title: 제목
summary: 한두 문장 요약
kind: frontend          # publishing | frontend
role: 맡은 역할
stack:
  - Next.js
order: 1                # 작을수록 앞에 나와요
liveUrl: https://...    # 선택
repoUrl: https://...    # 선택
---

본문은 마크다운으로 써요.
```

필수 항목이 빠지면 빌드가 파일 이름과 항목 이름을 알려주며 실패해요.

## 기술 선택

Next.js(App Router) 정적 생성, TypeScript, CSS Modules와 CSS 변수, MDX 콘텐츠. 왜 이렇게 골랐고 무엇을 버렸는지는 [`docs/decisions.md`](docs/decisions.md)에 적어 뒀어요.
