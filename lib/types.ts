export type ProjectKind = "publishing" | "frontend";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  kind: ProjectKind;
  role: string;
  stack: string[];
  order: number;
  liveUrl?: string;
  repoUrl?: string;
};

export type Project = {
  meta: ProjectMeta;
  content: string;
};
