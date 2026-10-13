export type Path = (string | number)[];

export type FieldValue = string | Values[];
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
export type Field = TextField | RichField | ImageField | SelectField | ListField;

// 입력 한도. 편집기는 maxLength로, normalizeValues는 같은 값으로 자른다.
export const LIMITS = {
  text: 120,
  titlePart: 60,
  rich: 600,
  image: 200,
  listItems: 12,
  subItems: 8,
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
        out[field.key] = str(value, LIMITS.image);
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
