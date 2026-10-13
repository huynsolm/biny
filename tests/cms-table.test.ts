import { describe, expect, test } from "vitest";
import {
  LIMITS,
  addTableCol,
  addTableRow,
  normalizeValues,
  removeTableCol,
  removeTableRow,
  type Field,
  type TableCell,
  type TableValue,
  type Values,
} from "@/lib/cms/schema";

const tableField: Field = { kind: "table", key: "table", label: "표" };

const cell = (value: string, extra: Partial<TableCell> = {}): TableCell => ({
  value,
  colspan: 1,
  rowspan: 1,
  hidden: false,
  ...extra,
});

const grid = (rows: number, cols: number, text = "x"): TableCell[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => cell(text)));

const widths = (n: number) => Array.from({ length: n }, () => "auto");
const wrap = (t: TableValue): Values => ({ table: t });
const table = (values: Values) => values.table as TableValue;
const normalized = (t: TableValue) => table(normalizeValues([tableField], wrap(t)));

describe("table normalization", () => {
  test("a missing or malformed table becomes a minimal one", () => {
    for (const input of [{}, { table: "no" }, { table: [] }, { table: null }]) {
      const out = table(normalizeValues([tableField], input as unknown as Values));
      expect(out.headers).toHaveLength(1);
      expect(out.rows).toHaveLength(1);
      expect(out.headers[0]).toHaveLength(1);
      expect(out.rows[0]).toHaveLength(1);
      expect(out.colWidths).toEqual(["auto"]);
    }
  });

  test("normalizeValues clamps table rows, cols and cell text", () => {
    const out = normalized({ headers: grid(1, 9), rows: grid(20, 9, "가".repeat(500)), colWidths: widths(9) });
    expect(out.rows).toHaveLength(LIMITS.tableRows);
    expect(out.rows[0]).toHaveLength(LIMITS.tableCols);
    expect(out.headers[0]).toHaveLength(LIMITS.tableCols);
    expect(out.colWidths).toHaveLength(LIMITS.tableCols);
    expect(out.rows[0][0].value.length).toBe(LIMITS.tableCell);
  });

  test("pads short rows to the column count", () => {
    const out = normalized({ headers: grid(1, 3), rows: [[cell("a")], grid(1, 3)[0]], colWidths: [] });
    expect(out.rows.every((r) => r.length === 3)).toBe(true);
    expect(out.colWidths).toEqual(["auto", "auto", "auto"]);
  });

  test("treats cells of the wrong type as empty cells", () => {
    const bad = { headers: [["x"]], rows: [[null, 3, { value: 5 }]], colWidths: [] } as unknown as TableValue;
    const out = normalized(bad);
    expect(out.rows[0]).toHaveLength(3);
    expect(out.rows[0].every((c) => c.value === "" && c.colspan === 1 && c.rowspan === 1)).toBe(true);
  });

  test("normalizeValues clamps colspan and rowspan into the table", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(2, 3), colWidths: widths(3) };
    t.rows[0][0] = cell("m", { colspan: 9, rowspan: 9 });
    const out = normalized(t);
    expect(out.rows[0][0]).toMatchObject({ colspan: 3, rowspan: 2, hidden: false });
    for (const [r, c] of [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]) expect(out.rows[r][c].hidden, `${r},${c}`).toBe(true);
  });

  test("spans are integers of at least 1", () => {
    const t: TableValue = { headers: grid(1, 2), rows: grid(1, 2), colWidths: widths(2) };
    t.rows[0][0] = cell("a", { colspan: -3, rowspan: 0 });
    t.rows[0][1] = cell("b", { colspan: 1.7, rowspan: Number.NaN });
    const out = normalized(t);
    expect(out.rows[0][0]).toMatchObject({ colspan: 1, rowspan: 1 });
    expect(out.rows[0][1]).toMatchObject({ colspan: 1, rowspan: 1 });
  });

  test("spans never overlap an earlier merge", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(2, 3), colWidths: widths(3) };
    t.rows[0][0] = cell("a", { colspan: 2 });
    t.rows[0][1] = cell("covered", { colspan: 3, rowspan: 2 }); // 덮인 칸의 병합 값은 무시된다
    t.rows[0][2] = cell("c", { colspan: 5 }); // 남은 칸이 하나뿐이다
    t.rows[1][0] = cell("d", { rowspan: 3 }); // 아래 행이 없다
    const out = normalized(t);
    expect(out.rows[0][0]).toMatchObject({ colspan: 2, rowspan: 1, hidden: false });
    expect(out.rows[0][1]).toMatchObject({ colspan: 1, rowspan: 1, hidden: true });
    expect(out.rows[0][2]).toMatchObject({ colspan: 1, rowspan: 1, hidden: false });
    expect(out.rows[1][0]).toMatchObject({ colspan: 1, rowspan: 1, hidden: false });
  });

  test("a rowspan stops before a cell already covered by another merge", () => {
    const t: TableValue = { headers: grid(1, 2), rows: grid(3, 2), colWidths: widths(2) };
    t.rows[0][0] = cell("a", { rowspan: 3 });
    const out = normalized(t);
    expect(out.rows[0][0].rowspan).toBe(3);
    expect(out.rows[1][0].hidden).toBe(true);
    expect(out.rows[2][0].hidden).toBe(true);
    expect(out.rows[1][1].hidden).toBe(false);
  });

  test("a colspan stops before a cell covered by a rowspan from above", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(2, 3), colWidths: widths(3) };
    t.rows[0][1] = cell("a", { rowspan: 2 }); // (1,1)을 덮는다
    t.rows[1][0] = cell("b", { colspan: 3 }); // (1,1)에서 막힌다
    const out = normalized(t);
    expect(out.rows[1][0].colspan).toBe(1);
    expect(out.rows[1][1].hidden).toBe(true);
  });

  test("hidden is recomputed from the spans and never trusted", () => {
    const t: TableValue = { headers: grid(1, 2), rows: grid(1, 2), colWidths: widths(2) };
    t.rows[0][0] = cell("a", { hidden: true });
    t.rows[0][1] = cell("b", { hidden: true });
    const out = normalized(t);
    expect(out.rows[0][0].hidden).toBe(false);
    expect(out.rows[0][1].hidden).toBe(false);
  });

  test("header spans are handled separately from body spans", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(1, 3), colWidths: widths(3) };
    t.headers[0][0] = cell("h", { colspan: 2, rowspan: 4 });
    const out = normalized(t);
    expect(out.headers[0][0]).toMatchObject({ colspan: 2, rowspan: 1 });
    expect(out.headers[0][1].hidden).toBe(true);
    expect(out.rows[0].every((c) => !c.hidden)).toBe(true);
  });

  test("only safe column widths survive", () => {
    const t: TableValue = { headers: grid(1, 6), rows: grid(1, 6), colWidths: ["30%", "<script>", "auto", "120px", "5", "url(x)"] };
    expect(normalized(t).colWidths).toEqual(["30%", "auto", "auto", "120px", "5px", "auto"]);
  });

  test("does not mutate its input", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(2, 3), colWidths: widths(3) };
    t.rows[0][0] = cell("m", { colspan: 9 });
    const copy = structuredClone(t);
    normalized(t);
    expect(t).toEqual(copy);
  });

  test("is idempotent", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(3, 3), colWidths: widths(3) };
    t.rows[0][0] = cell("m", { colspan: 2, rowspan: 2 });
    const once = normalized(t);
    expect(normalized(once)).toEqual(once);
  });
});

describe("table row and column operations", () => {
  test("addTableRow adds a row with the current column count", () => {
    const base = wrap({ headers: grid(1, 3), rows: grid(2, 3), colWidths: widths(3) });
    const next = addTableRow(base, ["table"]);
    expect(table(next).rows).toHaveLength(3);
    expect(table(next).rows[2]).toHaveLength(3);
    expect(table(next).rows[2].every((c) => c.value === "")).toBe(true);
    expect(table(base).rows).toHaveLength(2);
  });

  test("addTableRow is a no-op at the limit", () => {
    const full = wrap({ headers: grid(1, 3), rows: grid(LIMITS.tableRows, 3), colWidths: widths(3) });
    expect(addTableRow(full, ["table"])).toBe(full);
  });

  test("addTableCol appends a column to headers, rows and widths", () => {
    const base = wrap({ headers: grid(1, 2), rows: grid(2, 2), colWidths: widths(2) });
    const next = table(addTableCol(base, ["table"]));
    expect(next.headers[0]).toHaveLength(3);
    expect(next.rows.every((r) => r.length === 3)).toBe(true);
    expect(next.colWidths).toHaveLength(3);
  });

  test("addTableCol is a no-op at the limit", () => {
    const full = wrap({ headers: grid(1, LIMITS.tableCols), rows: grid(1, LIMITS.tableCols), colWidths: widths(LIMITS.tableCols) });
    expect(addTableCol(full, ["table"])).toBe(full);
  });

  test("removeTableRow drops the last row and is a no-op at 1", () => {
    const base = wrap({ headers: grid(1, 3), rows: grid(3, 3), colWidths: widths(3) });
    expect(table(removeTableRow(base, ["table"])).rows).toHaveLength(2);
    const one = wrap({ headers: grid(1, 1), rows: grid(1, 1), colWidths: widths(1) });
    expect(removeTableRow(one, ["table"])).toBe(one);
  });

  test("removeTableCol drops the last column everywhere and is a no-op at 1", () => {
    const base = wrap({ headers: grid(1, 3), rows: grid(3, 3), colWidths: widths(3) });
    const next = table(removeTableCol(base, ["table"]));
    expect(next.headers[0]).toHaveLength(2);
    expect(next.rows.every((r) => r.length === 2)).toBe(true);
    expect(next.colWidths).toHaveLength(2);
    const one = wrap({ headers: grid(1, 1), rows: grid(1, 1), colWidths: widths(1) });
    expect(removeTableCol(one, ["table"])).toBe(one);
  });

  test("removing a column re-normalizes spans that no longer fit", () => {
    const t: TableValue = { headers: grid(1, 3), rows: grid(1, 3), colWidths: widths(3) };
    t.rows[0][0] = cell("m", { colspan: 3 });
    const start = normalizeValues([tableField], wrap(t));
    const removed = normalizeValues([tableField], removeTableCol(start, ["table"]));
    expect(table(removed).rows[0][0].colspan).toBe(2);
    expect(table(removed).rows[0].filter((c) => !c.hidden)).toHaveLength(1);
  });

  test("operations on a missing table path return the same object", () => {
    const base: Values = { other: "x" };
    expect(addTableRow(base, ["table"])).toBe(base);
    expect(addTableCol(base, ["table"])).toBe(base);
    expect(removeTableRow(base, ["table"])).toBe(base);
    expect(removeTableCol(base, ["table"])).toBe(base);
  });
});
