import { CHECKLIST, type ItemStatus } from "./checklist";
import {
  MAX_PAGES,
  NAME_MAX,
  NOTE_MAX,
  createSampleState,
  type QaPage,
  type QaState,
} from "./state";

export const STORAGE_KEY = "qa-dashboard:v1";

export type ParseResult = { state: QaState; result: "ok" | "empty" | "invalid" };

const STATUSES: readonly string[] = ["todo", "pass", "fail", "na"];
const ITEM_IDS = new Set(CHECKLIST.map((item) => item.id));

export function serialize(state: QaState): string {
  return JSON.stringify(state);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 저장값은 사용자가 손으로 고칠 수도 있으므로 모양을 모두 확인한다. 하나라도 어긋나면 null.
function toPage(value: unknown): QaPage | null {
  if (!isRecord(value)) return null;
  const { id, name, note, statuses } = value;
  if (typeof id !== "string" || id === "") return null;
  if (typeof name !== "string" || name.trim() === "") return null;
  if (typeof note !== "string" || !isRecord(statuses)) return null;

  const kept: Record<string, ItemStatus> = {};
  for (const [itemId, status] of Object.entries(statuses)) {
    if (typeof status !== "string" || !STATUSES.includes(status)) return null;
    if (ITEM_IDS.has(itemId)) kept[itemId] = status as ItemStatus;
  }
  return {
    id,
    name: name.trim().slice(0, NAME_MAX),
    note: note.slice(0, NOTE_MAX),
    statuses: kept,
  };
}

export function parseStored(raw: string | null): ParseResult {
  if (raw === null) return { state: createSampleState(), result: "empty" };

  const invalid: ParseResult = { state: createSampleState(), result: "invalid" };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return invalid;
  }
  if (!isRecord(data) || data.version !== 1 || !Array.isArray(data.pages)) return invalid;
  if (data.pages.length > MAX_PAGES) return invalid;

  const pages: QaPage[] = [];
  for (const entry of data.pages) {
    const page = toPage(entry);
    if (page === null || pages.some((p) => p.id === page.id)) return invalid;
    pages.push(page);
  }
  return { state: { version: 1, pages }, result: "ok" };
}
