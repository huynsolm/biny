"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import {
  LIMITS,
  addListItem,
  addTableCol,
  addTableRow,
  maxItems,
  removeListItem,
  removeTableCol,
  removeTableRow,
  setAt,
  type Field,
  type ListField,
  type Path,
  type TableField,
  type TableValue,
  type Values,
} from "@/lib/cms/schema";
import CmsImageInput from "./CmsImageInput";
import styles from "./CmsPreview.module.css";

type Props = {
  fields: Field[];
  values: Values;
  onChange: (next: Values) => void;
};

function readString(scope: Values, key: string): string {
  const value = scope[key];
  return typeof value === "string" ? value : "";
}

function readItems(scope: Values, key: string): Values[] {
  const value = scope[key];
  return Array.isArray(value) ? value : [];
}

function readTable(scope: Values, key: string): TableValue | null {
  const value = scope[key];
  return typeof value === "object" && value !== null && !Array.isArray(value) && "rows" in value
    ? (value as TableValue)
    : null;
}

const TABLE_HINT =
  "열 너비는 auto, 30%, 120px처럼 적어요. 행과 열은 맨 끝에서만 추가하고 지울 수 있고, 칸 병합은 이 데모에서 만들 수 없어요.";

// 입력 정의(fields)를 읽어 폼을 그린다. 타입이 달라도 이 편집기 하나가 맡는다.
export default function CmsEditor({ fields, values, onChange }: Props) {
  const focusRequest = useRef<string | null>(null);

  // 항목을 지우면 포커스를 갖고 있던 버튼이 사라지므로, 요청된 요소(해당 목록의 "추가" 버튼)로 포커스를 옮긴다.
  useEffect(() => {
    if (focusRequest.current === null) return;
    document.getElementById(focusRequest.current)?.focus();
    focusRequest.current = null;
  });

  function renderList(field: ListField, scope: Values, path: Path, id: string, labelPrefix: string): ReactNode {
    const listPath: Path = [...path, field.key];
    const depth = listPath.length - 1;
    const items = readItems(scope, field.key);
    const addId = `${id}-add`;
    // 새 항목에서 포커스를 받을 첫 입력(글, 본문, 이미지, 선택). 목록이나 표만 있으면 없다.
    const firstInputKey = field.fields.find((f) => f.kind !== "list" && f.kind !== "table")?.key;

    // 개수가 정해진 목록(제목처럼 최소 = 최대)은 추가/삭제 버튼과 안내 없이 필드만 보여 준다.
    if (field.min === field.max) {
      return (
        <fieldset key={field.key} className={styles.cards}>
          <legend className={styles.legend}>
            {labelPrefix}
            {field.label}
          </legend>
          {items.map((item, index) => (
            <div key={index}>
              {renderFields(
                field.fields,
                item,
                [...listPath, index],
                `${labelPrefix}${field.itemLabel}${items.length > 1 ? ` ${index + 1}` : ""} `,
              )}
            </div>
          ))}
        </fieldset>
      );
    }

    return (
      <fieldset key={field.key} className={styles.cards}>
        <legend className={styles.legend}>
          {labelPrefix}
          {field.label} ({items.length}개)
        </legend>
        {items.map((item, index) => {
          const itemLabel = `${field.itemLabel} ${index + 1}`;
          return (
            <fieldset key={index} className={styles.card}>
              <legend className={styles.legend}>{itemLabel}</legend>
              {renderFields(field.fields, item, [...listPath, index], `${labelPrefix}${itemLabel} `)}
              <button
                type="button"
                className={styles.button}
                disabled={items.length <= field.min}
                onClick={() => {
                  onChange(removeListItem(values, listPath, index, field));
                  focusRequest.current = addId;
                }}
              >
                {labelPrefix}
                {itemLabel} 삭제
              </button>
            </fieldset>
          );
        })}
        <button
          type="button"
          id={addId}
          className={styles.button}
          aria-describedby={`${id}-hint`}
          disabled={items.length >= maxItems(field, depth)}
          onClick={() => {
            onChange(addListItem(values, listPath, field));
            // 마지막 칸을 채우면 "추가" 버튼이 비활성화되어 포커스가 사라지므로, 새 항목의 첫 입력으로 옮긴다.
            if (firstInputKey && items.length + 1 >= maxItems(field, depth)) {
              focusRequest.current = `cms-${[...listPath, items.length, firstInputKey].join("-")}`;
            }
          }}
        >
          {labelPrefix}
          {field.itemLabel} 추가
        </button>
        <p id={`${id}-hint`} className={styles.hint}>
          {field.itemLabel}은(는) {field.min}개에서 {maxItems(field, depth)}개까지 만들 수 있어요.
        </p>
      </fieldset>
    );
  }

  function renderTable(field: TableField, scope: Values, path: Path, id: string, labelPrefix: string): ReactNode {
    const table = readTable(scope, field.key);
    if (!table) return null;
    const tablePath: Path = [...path, field.key];
    const cols = table.colWidths.length;
    const addRowId = `${id}-add-row`;
    const addColId = `${id}-add-col`;
    const setValue = (part: "headers" | "rows", r: number, c: number, text: string) =>
      onChange(setAt(values, [...tablePath, part, r, c, "value"], text));

    return (
      <fieldset key={field.key} className={styles.cards}>
        <legend className={styles.legend}>
          {labelPrefix}
          {field.label} ({table.rows.length}행 {cols}열)
        </legend>
        <div className={styles.tableScroll}>
          <div
            className={styles.tableGrid}
            style={{ gridTemplateColumns: `4.5rem repeat(${cols}, minmax(7rem, 1fr))` }}
          >
            <span />
            {table.colWidths.map((_, c) => (
              <span key={c} className={styles.axis}>
                열 {c + 1}
              </span>
            ))}
            <span className={styles.axis}>머리글</span>
            {(table.headers[0] ?? []).map((cell, c) => (
              <input
                key={c}
                id={`${id}-h-${c}`}
                className={styles.control}
                type="text"
                aria-label={`머리글 열 ${c + 1}`}
                maxLength={LIMITS.tableCell}
                value={cell.value}
                onChange={(e) => setValue("headers", 0, c, e.target.value)}
              />
            ))}
            {table.rows.map((row, r) => (
              <Fragment key={r}>
                <span className={styles.axis}>행 {r + 1}</span>
                {row.map((cell, c) => (
                  <input
                    key={c}
                    id={`${id}-r${r}-c${c}`}
                    className={styles.control}
                    type="text"
                    aria-label={`행 ${r + 1} 열 ${c + 1}`}
                    maxLength={LIMITS.tableCell}
                    value={cell.value}
                    onChange={(e) => setValue("rows", r, c, e.target.value)}
                  />
                ))}
              </Fragment>
            ))}
            <span className={styles.axis}>열 너비</span>
            {table.colWidths.map((width, c) => (
              <input
                key={c}
                className={styles.control}
                type="text"
                aria-label={`열 ${c + 1} 너비`}
                maxLength={8}
                value={width}
                onChange={(e) => onChange(setAt(values, [...tablePath, "colWidths", c], e.target.value))}
              />
            ))}
          </div>
        </div>
        <div className={styles.tableActions}>
          <button
            type="button"
            id={addRowId}
            className={styles.button}
            aria-describedby={`${id}-hint`}
            disabled={table.rows.length >= LIMITS.tableRows}
            onClick={() => {
              onChange(addTableRow(values, tablePath));
              // 마지막 행을 채우면 이 버튼이 비활성화되어 포커스가 사라지므로, 새 행의 첫 칸으로 옮긴다.
              if (table.rows.length + 1 >= LIMITS.tableRows) focusRequest.current = `${id}-r${table.rows.length}-c0`;
            }}
          >
            행 추가
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={table.rows.length <= 1}
            onClick={() => {
              onChange(removeTableRow(values, tablePath));
              focusRequest.current = addRowId;
            }}
          >
            마지막 행 삭제
          </button>
          <button
            type="button"
            id={addColId}
            className={styles.button}
            aria-describedby={`${id}-hint`}
            disabled={cols >= LIMITS.tableCols}
            onClick={() => {
              onChange(addTableCol(values, tablePath));
              if (cols + 1 >= LIMITS.tableCols) focusRequest.current = `${id}-h-${cols}`;
            }}
          >
            열 추가
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={cols <= 1}
            onClick={() => {
              onChange(removeTableCol(values, tablePath));
              focusRequest.current = addColId;
            }}
          >
            마지막 열 삭제
          </button>
        </div>
        <p id={`${id}-hint`} className={styles.hint}>
          {TABLE_HINT} 표는 최대 {LIMITS.tableRows}행, {LIMITS.tableCols}열까지예요.
        </p>
      </fieldset>
    );
  }

  function renderFields(list: Field[], scope: Values, path: Path, labelPrefix: string): ReactNode {
    return list.map((field) => {
      const fieldPath: Path = [...path, field.key];
      const id = `cms-${fieldPath.join("-")}`;
      const label = `${labelPrefix}${field.label}`;
      const set = (value: string) => onChange(setAt(values, fieldPath, value));

      switch (field.kind) {
        case "text":
          return (
            <div key={field.key} className={styles.field}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                className={styles.control}
                type="text"
                maxLength={field.key === "small" || field.key === "big" ? LIMITS.titlePart : LIMITS.text}
                value={readString(scope, field.key)}
                onChange={(e) => set(e.target.value)}
              />
            </div>
          );
        case "rich":
          return (
            <div key={field.key} className={styles.field}>
              <label htmlFor={id}>{label}</label>
              <textarea
                id={id}
                className={styles.control}
                rows={3}
                aria-describedby={`${id}-hint`}
                maxLength={LIMITS.rich}
                value={readString(scope, field.key)}
                onChange={(e) => set(e.target.value)}
              />
              <p id={`${id}-hint`} className={styles.hint}>
                &lt;em&gt;, &lt;strong&gt;, &lt;b&gt;, &lt;i&gt;, &lt;br&gt;만 쓸 수 있어요.
              </p>
            </div>
          );
        case "image":
          return (
            <CmsImageInput
              key={field.key}
              id={id}
              label={label}
              value={readString(scope, field.key)}
              onChange={set}
            />
          );
        case "select":
          return (
            <div key={field.key} className={styles.field}>
              <label htmlFor={id}>{label}</label>
              <select
                id={id}
                className={styles.control}
                value={readString(scope, field.key)}
                onChange={(e) => set(e.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        case "list":
          return renderList(field, scope, path, id, labelPrefix);
        case "table":
          return renderTable(field, scope, path, id, labelPrefix);
      }
    });
  }

  return <>{renderFields(fields, values, [], "")}</>;
}
