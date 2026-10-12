import type { ProjectKind, ProjectMeta } from "./types";

export type KindFilter = "all" | ProjectKind;

export function filterProjects(projects: ProjectMeta[], filter: KindFilter): ProjectMeta[] {
  return filter === "all" ? projects : projects.filter((p) => p.kind === filter);
}
