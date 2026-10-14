import { IMAGE_DATA_MAX } from "./html";

export type Path = (string | number)[];

// 표의 칸. 병합(colspan, rowspan)을 지원하며, hidden은 다른 칸에 덮여 그리지 않는 칸이다.
export type TableCell = { value: string; colspan: number; rowspan: number; hidden: boolean };
export type TableValue = { headers: TableCell[][]; rows: TableCell[][]; colWidths: string[] };

export type FieldValue = string | Values[] | TableValue;
export type Values = { [key: string]: FieldValue };

type FieldBase = { key: string; label: string };
export type TextField = FieldBase & { kind: "text" };
export type RichField = FieldBase & { kind: "rich" };
export type ImageField = FieldBase & { kind: "image"; device?: "pc" | "mobile" };
export type SelectField = FieldBase & { kind: "select"; options: { value: string; label: string }[] };
export type ListField = FieldBase & {
  kind: "list";
  itemLabel: string;
  min: number;
  max: number;
  fields: Field[];
};
export type TableField = FieldBase & { kind: "table" };
export type Field = TextField | RichField | ImageField | SelectField | ListField | TableField;

// 입력 한도. 편집기는 maxLength로, normalizeValues는 같은 값으로 자른다.
export const LIMITS = {
  text: 120,
  titlePart: 60,
  rich: 600,
  image: 200,
  imageData: IMAGE_DATA_MAX,
  listItems: 12,
  subItems: 8,
  tableRows: 10,
  tableCols: 6,
  tableCell: 100,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

// 맨 위 목록은 listItems, 목록 안의 목록은 subItems가 상한이다. 정의의 max가 더 커도 이 값을 넘지 않는다.
export function maxItems(list: ListField, depth: number): number {
  return Math.min(list.max, depth === 0 ? LIMITS.listItems : LIMITS.subItems);
}

// ---- 표 ----

function emptyCell(): TableCell {
  return { value: "", colspan: 1, rowspan: 1, hidden: false };
}

function toSpan(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

function readCell(raw: unknown): TableCell {
  const cell = isRecord(raw) ? raw : {};
  return { value: str(cell.value, LIMITS.tableCell), colspan: toSpan(cell.colspan), rowspan: toSpan(cell.rowspan), hidden: false };
}

// 열 너비는 두 단계로 다룬다.
// 1) cleanWidth: 편집기가 값을 다시 받아 보여 주므로, 입력 중인 값("aut", "4p")을 바꾸면 글자를 지우거나 쓸 수 없다.
//    그래서 글자, 숫자, 점, 퍼센트만 남기고 8자로 자를 뿐 모양은 검사하지 않는다. 안전한 글자만 저장된다.
// 2) renderWidth: style="width:…"에 실제로 들어갈 때만 엄격하게 검사한다.
function cleanWidth(value: unknown): string {
  return typeof value === "string" ? value.replace(/[^A-Za-z0-9.%]/g, "").slice(0, 8) : "auto";
}

const VALID_WIDTH = /^(?:auto|\d{1,4}(?:\.\d{1,2})?(?:px|%|rem)?)$/;

// 허용 형식: auto, 숫자(px로 보정), 숫자+px/%/rem. 그 밖의 값은 auto.
export function renderWidth(value: string): string {
  const width = value.trim();
  if (!VALID_WIDTH.test(width)) return "auto";
  return /^\d+(?:\.\d+)?$/.test(width) ? `${width}px` : width;
}

function asRows(value: unknown): unknown[][] {
  return Array.isArray(value) ? value.map((row) => (Array.isArray(row) ? row : [])) : [];
}

function padGrid(rows: unknown[][], cols: number, minRows: number): TableCell[][] {
  const kept = rows.slice(0, LIMITS.tableRows);
  while (kept.length < minRows) kept.push([]);
  return kept.map((row) => Array.from({ length: cols }, (_, c) => (c < row.length ? readCell(row[c]) : emptyCell())));
}

// 병합 범위를 표 안으로 맞추고, 다른 병합과 겹치지 않게 줄이고, hidden을 병합 범위에서 다시 계산한다.
// 입력의 hidden은 믿지 않는다. 칸을 왼쪽 위부터 차례로 보며 이미 덮인 칸은 병합 값을 버린다.
function resolveSpans(grid: TableCell[][], cols: number): TableCell[][] {
  const rowCount = grid.length;
  const covered = grid.map(() => Array.from({ length: cols }, () => false));
  const out = grid.map((row) => row.map((cell) => ({ ...cell })));

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = out[r][c];
      if (covered[r][c]) {
        out[r][c] = { value: cell.value, colspan: 1, rowspan: 1, hidden: true };
        continue;
      }
      let colspan = Math.min(cell.colspan, cols - c);
      let run = 1;
      while (run < colspan && !covered[r][c + run]) run++;
      colspan = run;

      let rowspan = Math.min(cell.rowspan, rowCount - r);
      let depth = 1;
      while (depth < rowspan) {
        let free = true;
        for (let x = c; x < c + colspan; x++) if (covered[r + depth][x]) free = false;
        if (!free) break;
        depth++;
      }
      rowspan = depth;

      for (let y = r; y < r + rowspan; y++) {
        for (let x = c; x < c + colspan; x++) if (y !== r || x !== c) covered[y][x] = true;
      }
      out[r][c] = { value: cell.value, colspan, rowspan, hidden: false };
    }
  }
  return out;
}

function normalizeTable(raw: unknown): TableValue {
  const source = isRecord(raw) ? raw : {};
  const headerRows = asRows(source.headers);
  const bodyRows = asRows(source.rows);
  const widest = Math.max(1, ...headerRows.map((row) => row.length), ...bodyRows.map((row) => row.length));
  const cols = Math.min(widest, LIMITS.tableCols);
  const given = Array.isArray(source.colWidths) ? source.colWidths : [];
  return {
    headers: resolveSpans(padGrid(headerRows, cols, 1), cols),
    rows: resolveSpans(padGrid(bodyRows, cols, 1), cols),
    colWidths: Array.from({ length: cols }, (_, i) => cleanWidth(given[i])),
  };
}

// ---- 값 정리 ----

function normalizeAt(fields: Field[], values: unknown, depth: number): Values {
  const source = isRecord(values) ? values : {};
  const out: Values = {};
  for (const field of fields) {
    const value = source[field.key];
    switch (field.kind) {
      case "text":
        out[field.key] = str(value, field.key === "small" || field.key === "big" ? LIMITS.titlePart : LIMITS.text);
        break;
      case "rich":
        out[field.key] = str(value, LIMITS.rich);
        break;
      case "image":
        // 첨부한 파일(data URL)은 경로보다 훨씬 길다. 중간에서 자르면 깨진 그림이 되므로 상한을 넘으면 비운다.
        out[field.key] =
          typeof value === "string" && value.startsWith("data:image/")
            ? value.length <= LIMITS.imageData
              ? value
              : ""
            : str(value, LIMITS.image);
        break;
      case "select":
        out[field.key] =
          typeof value === "string" && field.options.some((option) => option.value === value) ? value : "";
        break;
      case "list": {
        const given = Array.isArray(value) ? value : [];
        const kept = given.slice(0, maxItems(field, depth)).map((item) => normalizeAt(field.fields, item, depth + 1));
        while (kept.length < field.min) kept.push(normalizeAt(field.fields, {}, depth + 1));
        out[field.key] = kept;
        break;
      }
      case "table":
        out[field.key] = normalizeTable(value);
        break;
    }
  }
  return out;
}

// 정의에 없는 키는 버리고, 글자는 종류별 한도로 자르고, 목록은 개수 범위로 맞춘다. 입력은 바꾸지 않는다.
export function normalizeValues(fields: Field[], values: Values): Values {
  return normalizeAt(fields, values, 0);
}

export function emptyItem(list: ListField): Values {
  return normalizeAt(list.fields, {}, 1);
}

function getAt(root: unknown, path: Path): unknown {
  let node: unknown = root;
  for (const step of path) {
    if (Array.isArray(node) && typeof step === "number") node = node[step];
    else if (isRecord(node) && typeof step === "string") node = node[step];
    else return undefined;
  }
  return node;
}

function setIn(node: unknown, path: Path, value: FieldValue): unknown {
  if (path.length === 0) return value;
  const [step, ...rest] = path;
  if (Array.isArray(node) && typeof step === "number" && step >= 0 && step < node.length) {
    const child = setIn(node[step], rest, value);
    if (child === node[step]) return node;
    const copy = node.slice();
    copy[step] = child;
    return copy;
  }
  if (isRecord(node) && typeof step === "string" && step in node) {
    const child = setIn(node[step], rest, value);
    if (child === node[step]) return node;
    return { ...node, [step]: child };
  }
  return node;
}

// 불변 갱신. 경로가 없으면 같은 객체를 돌려준다.
export function setAt(values: Values, path: Path, value: FieldValue): Values {
  return setIn(values, path, value) as Values;
}

function itemsAt(values: Values, path: Path): Values[] {
  const found = getAt(values, path);
  return Array.isArray(found) ? (found as Values[]) : [];
}

export function addListItem(values: Values, path: Path, list: ListField): Values {
  const items = itemsAt(values, path);
  if (items.length >= maxItems(list, path.length - 1)) return values;
  return setAt(values, path, [...items, emptyItem(list)]);
}

export function removeListItem(values: Values, path: Path, index: number, list: ListField): Values {
  const items = itemsAt(values, path);
  if (items.length <= list.min || index < 0 || index >= items.length) return values;
  return setAt(values, path, items.filter((_, i) => i !== index));
}

// ---- 표의 행/열 추가·삭제 (맨 끝에서만) ----

function tableAt(values: Values, path: Path): TableValue | null {
  const found = getAt(values, path);
  return isRecord(found) && Array.isArray(found.headers) && Array.isArray(found.rows) ? (found as unknown as TableValue) : null;
}

function columnCount(table: TableValue): number {
  return table.rows[0]?.length ?? table.headers[0]?.length ?? 1;
}

export function addTableRow(values: Values, path: Path): Values {
  const table = tableAt(values, path);
  if (!table || table.rows.length >= LIMITS.tableRows) return values;
  const row = Array.from({ length: columnCount(table) }, emptyCell);
  return setAt(values, path, { ...table, rows: [...table.rows, row] });
}

export function removeTableRow(values: Values, path: Path): Values {
  const table = tableAt(values, path);
  if (!table || table.rows.length <= 1) return values;
  return setAt(values, path, { ...table, rows: table.rows.slice(0, -1) });
}

export function addTableCol(values: Values, path: Path): Values {
  const table = tableAt(values, path);
  if (!table || columnCount(table) >= LIMITS.tableCols) return values;
  return setAt(values, path, {
    headers: table.headers.map((row) => [...row, emptyCell()]),
    rows: table.rows.map((row) => [...row, emptyCell()]),
    colWidths: [...table.colWidths, "auto"],
  });
}

export function removeTableCol(values: Values, path: Path): Values {
  const table = tableAt(values, path);
  if (!table || columnCount(table) <= 1) return values;
  return setAt(values, path, {
    headers: table.headers.map((row) => row.slice(0, -1)),
    rows: table.rows.map((row) => row.slice(0, -1)),
    colWidths: table.colWidths.slice(0, -1),
  });
}
