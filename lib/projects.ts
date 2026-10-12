import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project, ProjectKind, ProjectMeta } from "./types";

const DEFAULT_DIR = path.join(process.cwd(), "content", "projects");
const KINDS: ProjectKind[] = ["publishing", "frontend"];
const REQUIRED = ["title", "summary", "kind", "role", "stack", "order"] as const;
// 파일명이 곧 주소(slug)다. 이 규칙을 지키지 않는 파일은 목록에는 나오는데 상세 페이지는 404가 되므로
// 목록을 만드는 단계에서 막는다. "../" 같은 경로 탈출도 같은 규칙으로 막는다.
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const URL_PATTERN = /^https?:\/\//;

// 파일 내용이 약속된 모양인지 여기서 한 번만 검사한다. 빌드가 파일명과 필드명을
// 알려주며 실패해야 잘못된 콘텐츠가 조용히 배포되지 않는다.
function parse(file: string, raw: string): Project {
  const slug = path.basename(file, ".mdx");
  const { data, content } = matter(raw);

  for (const field of REQUIRED) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`${path.basename(file)}: missing front matter field "${field}"`);
    }
  }
  if (!KINDS.includes(data.kind)) {
    throw new Error(
      `${path.basename(file)}: kind must be one of ${KINDS.join(", ")} (got "${data.kind}")`,
    );
  }
  if (!Array.isArray(data.stack) || typeof data.order !== "number") {
    throw new Error(`${path.basename(file)}: stack must be a list and order a number`);
  }

  for (const field of ["liveUrl", "repoUrl"] as const) {
    if (data[field] !== undefined && !URL_PATTERN.test(String(data[field]))) {
      throw new Error(`${path.basename(file)}: ${field} must start with http:// or https://`);
    }
  }

  const meta: ProjectMeta = {
    slug,
    title: data.title,
    summary: data.summary,
    kind: data.kind,
    role: data.role,
    stack: data.stack,
    order: data.order,
    liveUrl: data.liveUrl,
    repoUrl: data.repoUrl,
  };
  return { meta, content: content.trim() };
}

function listFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      if (!SLUG_PATTERN.test(path.basename(name, ".mdx"))) {
        throw new Error(`${name}: file name must use only lowercase letters, numbers and hyphens`);
      }
      return path.join(dir, name);
    });
}

export function compareProjects(a: ProjectMeta, b: ProjectMeta): number {
  return a.order - b.order || a.slug.localeCompare(b.slug);
}

export function getProjectSlugs(dir: string = DEFAULT_DIR): string[] {
  return listFiles(dir).map((file) => path.basename(file, ".mdx"));
}

export function getAllProjects(dir: string = DEFAULT_DIR): ProjectMeta[] {
  return listFiles(dir)
    .map((file) => parse(file, fs.readFileSync(file, "utf8")).meta)
    .sort(compareProjects);
}

export function getProject(slug: string, dir: string = DEFAULT_DIR): Project | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const file = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return parse(file, fs.readFileSync(file, "utf8"));
}
