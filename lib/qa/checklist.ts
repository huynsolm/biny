export type ItemStatus = "todo" | "pass" | "fail" | "na";

export type GroupId = "semantic" | "responsive" | "keyboard" | "browser" | "publish";

export type ChecklistItem = { id: string; group: GroupId; label: string };

export const GROUPS: { id: GroupId; label: string }[] = [
  { id: "semantic", label: "시맨틱" },
  { id: "responsive", label: "반응형" },
  { id: "keyboard", label: "키보드" },
  { id: "browser", label: "브라우저" },
  { id: "publish", label: "발행" },
];

// 이 프로젝트의 점검 기준에서 가져온 항목이다. 특정 브라우저 목록이나 점수는 넣지 않는다.
export const CHECKLIST: ChecklistItem[] = [
  { id: "heading-order", group: "semantic", label: "제목 레벨이 순서대로 이어진다" },
  { id: "img-alt", group: "semantic", label: "이미지에 대체 텍스트가 있다" },
  { id: "landmarks", group: "semantic", label: "주요 영역이 랜드마크로 구분된다" },
  { id: "no-hscroll-320", group: "responsive", label: "320px에서 가로 스크롤이 없다" },
  { id: "touch-target", group: "responsive", label: "터치 영역이 충분하다" },
  { id: "tab-order", group: "keyboard", label: "탭 순서가 화면 순서와 같다" },
  { id: "focus-visible", group: "keyboard", label: "포커스 표시가 분명하다" },
  { id: "browsers", group: "browser", label: "사용하는 주요 브라우저에서 확인했다" },
  { id: "links", group: "publish", label: "링크가 동작한다" },
  { id: "page-title", group: "publish", label: "페이지 제목이 알맞다" },
];

export const STATUS_LABELS: Record<ItemStatus, string> = {
  todo: "미점검",
  pass: "통과",
  fail: "실패",
  na: "해당 없음",
};
