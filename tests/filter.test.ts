import { describe, expect, test } from "vitest";
import { describeGroupResult, describeResult, filterProjects, groupProjects } from "@/lib/filter";
import type { ProjectMeta } from "@/lib/types";

const make = (
  slug: string,
  kind: ProjectMeta["kind"],
  group: ProjectMeta["group"] = "featured",
): ProjectMeta => ({
  slug,
  title: slug,
  summary: "요약",
  kind,
  group,
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

describe("groupProjects", () => {
  const mixed = [
    make("a", "publishing", "featured"),
    make("b", "frontend", "experiment"),
    make("c", "frontend", "featured"),
    make("d", "frontend", "experiment"),
  ];

  test("splits projects into featured and experiments keeping their order", () => {
    const { featured, experiments } = groupProjects(mixed);
    expect(featured.map((p) => p.slug)).toEqual(["a", "c"]);
    expect(experiments.map((p) => p.slug)).toEqual(["b", "d"]);
  });

  test("returns an empty list for a group nothing belongs to", () => {
    const { featured, experiments } = groupProjects([make("a", "publishing", "featured")]);
    expect(featured).toHaveLength(1);
    expect(experiments).toEqual([]);
  });

  test("groups after a kind filter, so the group counts follow the filter", () => {
    const { featured, experiments } = groupProjects(filterProjects(mixed, "frontend"));
    expect(featured.map((p) => p.slug)).toEqual(["c"]);
    expect(experiments.map((p) => p.slug)).toEqual(["b", "d"]);
  });

  test("does not change the input list", () => {
    const copy = [...mixed];
    groupProjects(mixed);
    expect(mixed).toEqual(copy);
  });
});

describe("describeGroupResult", () => {
  test("announces the total and both group counts", () => {
    expect(describeGroupResult(6, 5)).toBe("프로젝트 11개 (대표 6개, 작은 도구와 실험 5개)");
  });

  test("omits the breakdown when only one group has projects", () => {
    expect(describeGroupResult(4, 0)).toBe("프로젝트 4개");
    expect(describeGroupResult(0, 3)).toBe("프로젝트 3개");
  });

  test("says nothing matched when both groups are empty", () => {
    expect(describeGroupResult(0, 0)).toBe("해당하는 프로젝트가 아직 없어요.");
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
