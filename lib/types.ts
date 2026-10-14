export type ProjectKind = "publishing" | "frontend";

// 홈 목록에서 보여 주는 묶음. 대표 프로젝트(featured)와 작은 도구와 실험(experiment).
export type ProjectGroup = "featured" | "experiment";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  kind: ProjectKind;
  group: ProjectGroup;
  role: string;
  stack: string[];
  order: number;
  image?: string;
  imageAlt?: string;
  liveUrl?: string;
  repoUrl?: string;
};

export type Project = {
  meta: ProjectMeta;
  content: string;
};
