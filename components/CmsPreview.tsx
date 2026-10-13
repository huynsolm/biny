"use client";

import { useRef, useState } from "react";
import { renderHtml } from "@/lib/cms/format";
import { buildPreviewDocument } from "@/lib/cms/preview";
import { CMS_TYPES, getType } from "@/lib/cms/registry";
import { normalizeValues, type Values } from "@/lib/cms/schema";
import CmsEditor from "./CmsEditor";
import styles from "./CmsPreview.module.css";

const COPY_OK = "복사했어요.";
const COPY_FAIL = "복사하지 못했어요. 소스 창에서 직접 선택해 복사해 주세요.";

type PreviewWidth = "pc" | "mobile";

export default function CmsPreview() {
  const [typeId, setTypeId] = useState(CMS_TYPES[0].id);
  // 타입마다 입력값을 따로 메모리에 둔다. 처음 여는 타입은 기본값으로 시작하고, 타입을 오가도 입력이 남는다.
  const [store, setStore] = useState<Record<string, Values>>({});
  const [copyMessage, setCopyMessage] = useState("");
  // 미리보기 폭: PC는 영역 전체 폭, 모바일은 360px. 타입의 PC/모바일 이미지와 배치가 iframe 폭에 따라 바뀐다.
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("pc");
  const sourceRef = useRef<HTMLTextAreaElement>(null);

  const type = getType(typeId) ?? CMS_TYPES[0];
  const values = normalizeValues(type.fields, store[type.id] ?? type.defaults);
  const html = renderHtml(type, values);

  function handleChange(next: Values) {
    // 입력이 바뀌면 이전에 복사한 소스와 달라지므로 복사 결과 안내를 지운다.
    setCopyMessage("");
    setStore((prev) => ({ ...prev, [type.id]: next }));
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
              value={type.id}
              onChange={(e) => {
                setTypeId(e.target.value);
                setCopyMessage("");
              }}
            >
              {CMS_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <CmsEditor key={type.id} fields={type.fields} values={values} onChange={handleChange} />
        </section>

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
            rows={Math.min(html.split("\n").length, 24)}
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
      </div>

      <section className={styles.panel} aria-labelledby="cms-preview-heading">
        <h2 id="cms-preview-heading" className={styles.heading}>
          미리보기
        </h2>
        <fieldset className={styles.widthToggle}>
          <legend className={styles.legend}>미리보기 폭</legend>
          <label className={styles.radio}>
            <input
              type="radio"
              name="cms-preview-width"
              checked={previewWidth === "pc"}
              onChange={() => setPreviewWidth("pc")}
            />
            PC (전체 폭)
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="cms-preview-width"
              checked={previewWidth === "mobile"}
              onChange={() => setPreviewWidth("mobile")}
            />
            모바일 (360px)
          </label>
        </fieldset>
        <iframe
          title="HTML 미리보기"
          className={previewWidth === "mobile" ? `${styles.preview} ${styles.previewMobile}` : styles.preview}
          sandbox=""
          srcDoc={buildPreviewDocument(html, type.css)}
        />
      </section>
    </div>
  );
}
