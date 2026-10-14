import type { ProjectKind, ProjectMeta } from "./types";

export type KindFilter = "all" | ProjectKind;

export function filterProjects(projects: ProjectMeta[], filter: KindFilter): ProjectMeta[] {
  return filter === "all" ? projects : projects.filter((p) => p.kind === filter);
}

// 필터를 적용한 뒤의 목록을 홈에서 보여 줄 두 묶음으로 나눈다. 순서는 입력 그대로 유지한다.
export function groupProjects(projects: ProjectMeta[]): {
  featured: ProjectMeta[];
  experiments: ProjectMeta[];
} {
  return {
    featured: projects.filter((p) => p.group === "featured"),
    experiments: projects.filter((p) => p.group === "experiment"),
  };
}

// 화면의 빈 결과 안내와 스크린 리더용 안내가 같은 문구를 쓰도록 한 곳에서 만든다.
export function describeResult(count: number): string {
  return count === 0 ? "해당하는 프로젝트가 아직 없어요." : `프로젝트 ${count}개`;
}

// 두 묶음으로 나눠 보여 줄 때의 안내 문구. 한쪽만 있으면 묶음 설명은 생략한다.
export function describeGroupResult(featured: number, experiments: number): string {
  const total = featured + experiments;
  if (total === 0) return describeResult(0);
  const breakdown = featured > 0 && experiments > 0 ? ` (대표 ${featured}개, 작은 도구와 실험 ${experiments}개)` : "";
  return `${describeResult(total)}${breakdown}`;
}
