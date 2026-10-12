import { describe, expect, test } from "vitest";
import { filterProjects } from "@/lib/filter";
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
