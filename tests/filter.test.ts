import { describe, expect, test } from "vitest";
import { describeResult, filterProjects } from "@/lib/filter";
import type { ProjectMeta } from "@/lib/types";

const make = (slug: string, kind: ProjectMeta["kind"]): ProjectMeta => ({
  slug,
  title: slug,
  summary: "요약",
  kind,
  role: "역할",
  stack: [],
  order: 1,
});

const projects = [make("a", "publishing"), make("b", "frontend"), make("c", "publishing")];

describe("filterProjects", () => {
  test("returns all projects for 'all'", () => {
    expect(filterProjects(projects, "all")).toHaveLength(3);
  });

  test("returns only projects of the matching kind", () => {
    expect(filterProjects(projects, "frontend").map((p) => p.slug)).toEqual(["b"]);
  });

  test("returns empty array when nothing matches", () => {
    expect(filterProjects([make("a", "publishing")], "frontend")).toEqual([]);
    expect(filterProjects([], "all")).toEqual([]);
  });
});

describe("describeResult", () => {
  test("announces the number of projects", () => {
    expect(describeResult(4)).toBe("프로젝트 4개");
    expect(describeResult(1)).toBe("프로젝트 1개");
  });

  test("says nothing matched when the count is zero", () => {
    expect(describeResult(0)).toBe("해당하는 프로젝트가 아직 없어요.");
  });
});
