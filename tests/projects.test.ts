import { describe, expect, test } from "vitest";
import { fileURLToPath } from "node:url";
import { getAllProjects, getProject } from "@/lib/projects";

const validDir = fileURLToPath(new URL("./fixtures/valid", import.meta.url));
const invalidDir = fileURLToPath(new URL("./fixtures/invalid", import.meta.url));

describe("projects loader", () => {
  test("getAllProjects sorts by order then slug", () => {
    const slugs = getAllProjects(validDir).map((p) => p.slug);
    expect(slugs).toEqual(["zeta", "alpha", "beta"]);
  });

  test("getAllProjects throws naming file and missing field", () => {
    expect(() => getAllProjects(invalidDir)).toThrowError(/missing-title\.mdx/);
    expect(() => getAllProjects(invalidDir)).toThrowError(/title/);
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
