"use client";

import { useEffect, useRef, useState } from "react";
import {
  COMPONENT_TYPES,
  DEFAULT_VALUES,
  LIMITS,
  MAX_CARDS,
  MIN_CARDS,
  clampCards,
  renderHtml,
  type Card,
  type CmsValues,
  type ComponentTypeId,
} from "@/lib/cms/components";
import { buildPreviewDocument } from "@/lib/cms/preview";
import styles from "./CmsPreview.module.css";

const COPY_OK = "복사했어요.";
const COPY_FAIL = "복사하지 못했어요. 소스 창에서 직접 선택해 복사해 주세요.";

export default function CmsPreview() {
  const [type, setType] = useState<ComponentTypeId>("title");
  const [values, setValues] = useState<CmsValues>(DEFAULT_VALUES);
  const [copyMessage, setCopyMessage] = useState("");
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const focusRequest = useRef<string | null>(null);

  const fields = COMPONENT_TYPES.find((t) => t.id === type)?.fields ?? [];
  const cards = clampCards(values.cards);
  const html = renderHtml(type, values);

  // 카드를 지우면 포커스를 갖고 있던 버튼이 사라지므로, 요청된 요소로 포커스를 옮긴다.
  useEffect(() => {
    if (focusRequest.current === null) return;
    document.getElementById(focusRequest.current)?.focus();
    focusRequest.current = null;
  });

  function update<K extends keyof CmsValues>(key: K, value: CmsValues[K]) {
    // 입력이 바뀌면 이전에 복사한 소스와 달라지므로 복사 결과 안내를 지운다.
    setCopyMessage("");
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateCard(index: number, patch: Partial<Card>) {
    update(
      "cards",
      cards.map((card, i) => (i === index ? { ...card, ...patch } : card)),
    );
  }

  async function copySource() {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(html);
      setCopyMessage(COPY_OK);
    } catch {
      setCopyMessage(COPY_FAIL);
      sourceRef.current?.select();
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.columns}>
        <section className={styles.panel} aria-labelledby="cms-form-heading">
          <h2 id="cms-form-heading" className={styles.heading}>
            입력
          </h2>

          <div className={styles.field}>
            <label htmlFor="cms-type">컴포넌트 타입</label>
            <select
              id="cms-type"
              className={styles.control}
              value={type}
              onChange={(e) => {
                setType(e.target.value as ComponentTypeId);
                setCopyMessage("");
              }}
            >
              {COMPONENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {fields.includes("imageSrc") && (
            <div className={styles.field}>
              <label htmlFor="cms-image-src">이미지 주소</label>
              <input
                id="cms-image-src"
                className={styles.control}
                type="text"
                maxLength={LIMITS.imageSrc}
                value={values.imageSrc}
                onChange={(e) => update("imageSrc", e.target.value)}
              />
              <p className={styles.hint}>
                샘플 이미지(/images/cms-sample.svg)나 https:// 주소를 쓸 수 있어요. 그 밖의 값은 샘플 이미지로 바뀌어요. 이 사이트의 다른 경로는 소스에는 나오지만 미리보기에서는 불러오지 못할 수 있어요.
              </p>
            </div>
          )}

          {fields.includes("imageAlt") && (
            <div className={styles.field}>
              <label htmlFor="cms-image-alt">대체 텍스트</label>
              <input
                id="cms-image-alt"
                className={styles.control}
                type="text"
                maxLength={LIMITS.imageAlt}
                value={values.imageAlt}
                onChange={(e) => update("imageAlt", e.target.value)}
              />
              <p className={styles.hint}>비워 두면 장식 이미지로 처리돼요.</p>
            </div>
          )}

          {fields.includes("title") && (
            <div className={styles.field}>
              <label htmlFor="cms-title">제목</label>
              <input
                id="cms-title"
                className={styles.control}
                type="text"
                maxLength={LIMITS.title}
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
          )}

          {fields.includes("description") && (
            <div className={styles.field}>
              <label htmlFor="cms-description">설명</label>
              <textarea
                id="cms-description"
                className={styles.control}
                rows={3}
                maxLength={LIMITS.description}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          )}

          {fields.includes("cards") && (
            <fieldset className={styles.cards}>
              <legend className={styles.legend}>카드 ({cards.length}개)</legend>
              {cards.map((card, index) => (
                <fieldset key={index} className={styles.card}>
                  <legend className={styles.legend}>카드 {index + 1}</legend>
                  <div className={styles.field}>
                    <label htmlFor={`cms-card-${index}-title`}>카드 {index + 1} 제목</label>
                    <input
                      id={`cms-card-${index}-title`}
                      className={styles.control}
                      type="text"
                      maxLength={LIMITS.cardTitle}
                      value={card.title}
                      onChange={(e) => updateCard(index, { title: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={`cms-card-${index}-desc`}>카드 {index + 1} 설명</label>
                    <textarea
                      id={`cms-card-${index}-desc`}
                      className={styles.control}
                      rows={2}
                      maxLength={LIMITS.cardDescription}
                      value={card.description}
                      onChange={(e) => updateCard(index, { description: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.button}
                    disabled={cards.length <= MIN_CARDS}
                    onClick={() => {
                      update("cards", cards.filter((_, i) => i !== index));
                      focusRequest.current = "cms-add-card";
                    }}
                  >
                    카드 {index + 1} 삭제
                  </button>
                </fieldset>
              ))}
              <button
                type="button"
                id="cms-add-card"
                className={styles.button}
                disabled={cards.length >= MAX_CARDS}
                onClick={() => update("cards", [...cards, { title: "", description: "" }])}
              >
                카드 추가
              </button>
              <p className={styles.hint}>
                카드는 {MIN_CARDS}개에서 {MAX_CARDS}개까지 만들 수 있어요.
              </p>
            </fieldset>
          )}
        </section>

        <div className={styles.results}>
          <section className={styles.panel} aria-labelledby="cms-source-heading">
            <h2 id="cms-source-heading" className={styles.heading}>
              HTML 소스
            </h2>
            <label htmlFor="cms-source" className={styles.sourceLabel}>
              생성된 HTML 소스
            </label>
            <textarea
              id="cms-source"
              ref={sourceRef}
              className={`${styles.control} ${styles.source}`}
              readOnly
              spellCheck={false}
              rows={Math.min(html.split("\n").length, 16)}
              value={html}
            />
            <div className={styles.copyRow}>
              <button type="button" className={styles.button} onClick={copySource}>
                소스 복사
              </button>
              <p role="status" className={styles.copyMessage}>
                {copyMessage}
              </p>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="cms-preview-heading">
            <h2 id="cms-preview-heading" className={styles.heading}>
              미리보기
            </h2>
            <iframe
              title="HTML 미리보기"
              className={styles.preview}
              sandbox=""
              srcDoc={buildPreviewDocument(html)}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
