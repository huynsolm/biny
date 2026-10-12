import { describe, expect, test } from "vitest";
import { fileURLToPath } from "node:url";
import { compareProjects, getAllProjects, getProject } from "@/lib/projects";
import type { ProjectMeta } from "@/lib/types";

const fixture = (name: string) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));
const validDir = fixture("valid");
const invalidDir = fixture("invalid");

const meta = (order: number, slug: string): ProjectMeta => ({
  slug,
  title: slug,
  summary: "s",
  kind: "publishing",
  role: "r",
  stack: [],
  order,
});

describe("projects loader", () => {
  test("getAllProjects sorts by order then slug", () => {
    const slugs = getAllProjects(validDir).map((p) => p.slug);
    expect(slugs).toEqual(["zeta", "alpha", "beta"]);
  });

  test("getAllProjects throws naming file and missing field", () => {
    expect(() => getAllProjects(invalidDir)).toThrowError(/missing-title\.mdx/);
    expect(() => getAllProjects(invalidDir)).toThrowError(/"title"/);
  });

  test("compareProjects breaks order ties by slug", () => {
    expect(compareProjects(meta(2, "b"), meta(2, "a"))).toBeGreaterThan(0);
    expect(compareProjects(meta(1, "z"), meta(2, "a"))).toBeLessThan(0);
  });

  test("getAllProjects throws naming file for a file name that cannot be a slug", () => {
    expect(() => getAllProjects(fixture("bad-slug"))).toThrowError(/Bad_Name\.mdx/);
  });

  test("getAllProjects throws for an unknown kind", () => {
    expect(() => getAllProjects(fixture("bad-kind"))).toThrowError(/kind/);
  });

  test("getAllProjects throws when stack is not a list", () => {
    expect(() => getAllProjects(fixture("bad-stack"))).toThrowError(/stack/);
  });

  test("getAllProjects throws when order is not a number", () => {
    expect(() => getAllProjects(fixture("bad-order"))).toThrowError(/order/);
  });

  test("getAllProjects throws for a liveUrl without http(s) scheme", () => {
    expect(() => getAllProjects(fixture("bad-url"))).toThrowError(/liveUrl/);
  });

  test("getProject returns null for unknown slug", () => {
    expect(getProject("nope", validDir)).toBeNull();
  });

  test("getProject returns null for slug escaping the content dir", () => {
    expect(getProject("../invalid/missing-title", validDir)).toBeNull();
  });

  test("getProject returns body without front matter", () => {
    const project = getProject("zeta", validDir);
    expect(project).not.toBeNull();
    expect(project!.content).not.toContain("---");
    expect(project!.content).toContain("본문 Zeta");
    expect(project!.meta.slug).toBe("zeta");
  });
});
