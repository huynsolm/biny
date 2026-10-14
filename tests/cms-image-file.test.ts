import { describe, expect, test } from "vitest";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_BYTES, checkImageFile, fitSize } from "@/lib/cms/imageFile";

describe("fitSize", () => {
  test("keeps a small image as it is", () => {
    expect(fitSize(800, 600, 1200)).toEqual({ width: 800, height: 600 });
  });

  test("scales a wide image down to the max width, keeping the ratio", () => {
    expect(fitSize(2400, 1200, 1200)).toEqual({ width: 1200, height: 600 });
  });

  test("never returns a zero side", () => {
    expect(fitSize(5000, 1, 100)).toEqual({ width: 100, height: 1 });
  });
});

describe("checkImageFile", () => {
  const file = (type: string, size: number) => ({ type, size });

  test("accepts png, jpeg, webp and gif within the size limit", () => {
    for (const type of ACCEPTED_IMAGE_TYPES) expect(checkImageFile(file(type, 1000))).toBe("");
  });

  test("rejects other types such as svg or pdf", () => {
    expect(checkImageFile(file("image/svg+xml", 1000))).not.toBe("");
    expect(checkImageFile(file("application/pdf", 1000))).not.toBe("");
    expect(checkImageFile(file("", 1000))).not.toBe("");
  });

  test("rejects a file above the size limit", () => {
    expect(checkImageFile(file("image/png", MAX_FILE_BYTES + 1))).not.toBe("");
  });
});
