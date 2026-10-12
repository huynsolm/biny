import type { ProjectKind, ProjectMeta } from "./types";

export type KindFilter = "all" | ProjectKind;

export function filterProjects(projects: ProjectMeta[], filter: KindFilter): ProjectMeta[] {
  return filter === "all" ? projects : projects.filter((p) => p.kind === filter);
}

// 화면의 빈 결과 안내와 스크린 리더용 안내가 같은 문구를 쓰도록 한 곳에서 만든다.
export function describeResult(count: number): string {
  return count === 0 ? "해당하는 프로젝트가 아직 없어요." : `프로젝트 ${count}개`;
}
