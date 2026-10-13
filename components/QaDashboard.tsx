"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CHECKLIST, GROUPS, STATUS_LABELS, type ItemStatus } from "@/lib/qa/checklist";
import {
  MAX_PAGES,
  NAME_MAX,
  NOTE_MAX,
  addPage,
  createSampleState,
  getStatus,
  isPublishable,
  removePage,
  setNote,
  setStatus,
  summarize,
  type QaState,
} from "@/lib/qa/state";
import { STORAGE_KEY, parseStored, serialize } from "@/lib/qa/storage";
import styles from "./QaDashboard.module.css";

const NOTICE_INVALID = "저장된 내용을 읽지 못해 샘플로 시작했어요.";
const NOTICE_BLOCKED = "이 브라우저에서는 저장할 수 없어서 새로고침하면 사라져요.";
const STATUS_ORDER: ItemStatus[] = ["todo", "pass", "fail", "na"];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function QaDashboard() {
  // 서버에서 그린 HTML과 어긋나지 않도록 첫 렌더는 샘플로 하고, 마운트한 뒤에 저장값을 반영한다.
  const [state, setState] = useState<QaState>(createSampleState);
  const [selectedId, setSelectedId] = useState<string | null>("sample-main");
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [newName, setNewName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [pendingReset, setPendingReset] = useState(false);
  const blockedNotified = useRef(false);
  const focusRequest = useRef<string | null>(null);

  function notifyBlocked() {
    if (blockedNotified.current) return;
    blockedNotified.current = true;
    setNotice(NOTICE_BLOCKED);
  }

  // 저장값을 읽는 일은 브라우저에서만 할 수 있어서 마운트 직후 한 번만 상태에 반영한다.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      notifyBlocked();
    }
    const parsed = parseStored(raw);
    if (parsed.result === "invalid") setNotice(NOTICE_INVALID);
    setState(parsed.state);
    setSelectedId(parsed.state.pages[0]?.id ?? null);
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    // 첫 읽기가 끝나기 전에는 저장하지 않는다. 샘플이 저장된 값을 덮어쓰면 안 된다.
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialize(state));
    } catch {
      notifyBlocked();
    }
  }, [state, loaded]);

  // 확인 단계를 열고 닫을 때 포커스가 사라지지 않게, 요청된 요소로 포커스를 옮긴다.
  useEffect(() => {
    if (focusRequest.current === null) return;
    document.getElementById(focusRequest.current)?.focus();
    focusRequest.current = null;
  });

  const summary = summarize(state, selectedId);
  const selectedPage = state.pages.find((p) => p.id === selectedId) ?? null;
  const summaryText =
    `페이지 ${summary.total}개 중 발행 가능 ${summary.publishable}개` +
    (summary.selected
      ? ` · 선택한 페이지: 통과 ${summary.selected.pass}, 실패 ${summary.selected.fail}, 미점검 ${summary.selected.todo}, 해당 없음 ${summary.selected.na}`
      : "");

  function askDelete(id: string) {
    setPendingDelete(id);
    focusRequest.current = "confirm-delete-cancel";
  }

  function cancelDelete(id: string) {
    setPendingDelete(null);
    focusRequest.current = `delete-${id}`;
  }

  function confirmDelete(id: string) {
    const next = removePage(state, id);
    setState(next);
    if (selectedId === id) setSelectedId(next.pages[0]?.id ?? null);
    setPendingDelete(null);
    focusRequest.current = "pages-heading";
  }

  function submitNewPage(event: FormEvent) {
    event.preventDefault();
    const id = newId();
    const next = addPage(state, newName, id);
    if (next === state) return;
    setState(next);
    setSelectedId(id);
    setNewName("");
  }

  function askReset() {
    setPendingReset(true);
    focusRequest.current = "confirm-reset-cancel";
  }

  function cancelReset() {
    setPendingReset(false);
    focusRequest.current = "reset-button";
  }

  function confirmReset() {
    const sample = createSampleState();
    setState(sample);
    setSelectedId(sample.pages[0].id);
    setPendingReset(false);
    setPendingDelete(null);
    // 저장이 막힌 환경이면 되돌린 뒤에도 "저장되지 않는다"는 안내는 남겨야 한다.
    setNotice(blockedNotified.current ? NOTICE_BLOCKED : "");
    focusRequest.current = "pages-heading";
  }

  return (
    <div className={styles.root}>
      {/* 요약이 바뀌면 스크린 리더가 읽는다. 프로젝트 필터 결과 안내와 같은 방식이다. */}
      <p role="status" className="sr-only">
        {summaryText}
      </p>
      <p role="status" className={styles.notice}>
        {notice}
      </p>

      <p className={styles.summary}>{summaryText}</p>

      <div className={styles.columns}>
        <section className={styles.panel} aria-labelledby="pages-heading">
          <h2 id="pages-heading" tabIndex={-1} className={styles.heading}>
            페이지
          </h2>

          {state.pages.length === 0 ? (
            <p className={styles.empty}>
              페이지가 없어요. 아래에서 추가하거나 샘플로 되돌려 주세요.
            </p>
          ) : (
            <ul className={styles.pageList}>
              {state.pages.map((page) => (
                <li key={page.id} className={styles.pageRow}>
                  <button
                    type="button"
                    className={styles.pageButton}
                    aria-pressed={page.id === selectedId}
                    onClick={() => setSelectedId(page.id)}
                  >
                    <span className={styles.pageName}>{page.name}</span>
                    <span className={styles.badge}>
                      {isPublishable(page) ? "발행 가능" : "점검 중"}
                    </span>
                  </button>
                  {pendingDelete === page.id ? (
                    <span className={styles.confirm}>
                      <span>삭제할까요?</span>
                      <button
                        type="button"
                        className={styles.button}
                        onClick={() => confirmDelete(page.id)}
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        id="confirm-delete-cancel"
                        className={styles.button}
                        onClick={() => cancelDelete(page.id)}
                      >
                        취소
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      id={`delete-${page.id}`}
                      className={styles.button}
                      aria-label={`${page.name} 삭제`}
                      onClick={() => askDelete(page.id)}
                    >
                      삭제
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form className={styles.addForm} onSubmit={submitNewPage}>
            <label htmlFor="new-page-name">새 페이지 이름</label>
            <div className={styles.addRow}>
              <input
                id="new-page-name"
                className={styles.input}
                type="text"
                maxLength={NAME_MAX}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button
                type="submit"
                className={styles.button}
                disabled={state.pages.length >= MAX_PAGES}
              >
                추가
              </button>
            </div>
            <p className={styles.hint}>
              페이지는 최대 {MAX_PAGES}개까지 추가할 수 있어요.
            </p>
          </form>

          <div className={styles.resetRow}>
            {pendingReset ? (
              <span className={styles.confirm}>
                <span>샘플로 되돌릴까요? 지금 내용이 사라져요.</span>
                <button type="button" className={styles.button} onClick={confirmReset}>
                  되돌리기
                </button>
                <button
                  type="button"
                  id="confirm-reset-cancel"
                  className={styles.button}
                  onClick={cancelReset}
                >
                  취소
                </button>
              </span>
            ) : (
              <button
                type="button"
                id="reset-button"
                className={styles.button}
                onClick={askReset}
              >
                샘플로 되돌리기
              </button>
            )}
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="checklist-heading">
          <h2 id="checklist-heading" className={styles.heading}>
            {selectedPage ? `${selectedPage.name} 점검` : "점검 항목"}
          </h2>

          {selectedPage === null ? (
            <p className={styles.empty}>점검할 페이지를 선택해 주세요.</p>
          ) : (
            <>
              {GROUPS.map((group) => (
                <fieldset key={group.id} className={styles.group}>
                  <legend className={`label ${styles.legend}`}>{group.label}</legend>
                  {CHECKLIST.filter((item) => item.group === group.id).map((item) => {
                    const selectId = `item-${selectedPage.id}-${item.id}`;
                    return (
                      <div key={item.id} className={styles.item}>
                        <label htmlFor={selectId}>{item.label}</label>
                        <select
                          id={selectId}
                          className={styles.select}
                          value={getStatus(selectedPage, item.id)}
                          onChange={(e) =>
                            setState(
                              setStatus(state, selectedPage.id, item.id, e.target.value as ItemStatus),
                            )
                          }
                        >
                          {STATUS_ORDER.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </fieldset>
              ))}

              <div className={styles.item}>
                <label htmlFor={`note-${selectedPage.id}`}>메모</label>
                <input
                  id={`note-${selectedPage.id}`}
                  className={styles.input}
                  type="text"
                  maxLength={NOTE_MAX}
                  value={selectedPage.note}
                  onChange={(e) => setState(setNote(state, selectedPage.id, e.target.value))}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
