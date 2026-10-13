"use client";

import { useEffect, useRef, useState } from "react";
import { renderHtml } from "@/lib/cms/format";
import { buildPreviewDocument } from "@/lib/cms/preview";
import { CMS_TYPES, getType } from "@/lib/cms/registry";
import { normalizeValues, type Values } from "@/lib/cms/schema";
import CmsEditor from "./CmsEditor";
import styles from "./CmsPreview.module.css";

const COPY_OK = "복사했어요.";
const COPY_FAIL = "복사하지 못했어요. 소스 창에서 직접 선택해 복사해 주세요.";

type PreviewWidth = "pc" | "mobile";

// PC 미리보기는 원본 마크업의 PC 기준(Bootstrap lg, 992px)을 넘는 고정 폭이다. 영역이 더 좁으면 축소해서 보여 주되,
// 글자가 너무 작아지지 않게 절반까지만 줄이고 그보다 좁으면 영역 안에서 가로로 스크롤한다.
const PC_WIDTH = 1100;
const PREVIEW_HEIGHT_REM = 32;
const MIN_SCALE = 0.5;

export default function CmsPreview() {
  const [typeId, setTypeId] = useState(CMS_TYPES[0].id);
  // 타입마다 입력값을 따로 메모리에 둔다. 처음 여는 타입은 기본값으로 시작하고, 타입을 오가도 입력이 남는다.
  const [store, setStore] = useState<Record<string, Values>>({});
  const [copyMessage, setCopyMessage] = useState("");
  // 미리보기 폭: PC는 영역 전체 폭, 모바일은 360px. 타입의 PC/모바일 이미지와 배치가 iframe 폭에 따라 바뀐다.
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("pc");
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setScale(Math.max(MIN_SCALE, Math.min(1, el.clientWidth / PC_WIDTH)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
            PC (1100px)
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
        <div ref={scrollRef} className={styles.previewScroll}>
          {previewWidth === "pc" ? (
            // 안쪽 상자가 축소된 크기를 차지해야 불필요한 가로 스크롤이 생기지 않는다(transform은 레이아웃 크기를 바꾸지 않는다).
            <div
              className={styles.previewBox}
              style={{ width: PC_WIDTH * scale, height: `${PREVIEW_HEIGHT_REM * scale}rem` }}
            >
              <iframe
                title="HTML 미리보기"
                className={`${styles.preview} ${styles.previewPc}`}
                style={{ transform: `scale(${scale})` }}
                sandbox=""
                srcDoc={buildPreviewDocument(html, type.css)}
              />
            </div>
          ) : (
            <iframe
              title="HTML 미리보기"
              className={`${styles.preview} ${styles.previewMobile}`}
              sandbox=""
              srcDoc={buildPreviewDocument(html, type.css)}
            />
          )}
        </div>
      </section>
    </div>
  );
}
