"use client";

import { useState } from "react";
import { fileToImageData } from "@/lib/cms/imageFile";
import { LIMITS } from "@/lib/cms/schema";
import styles from "./CmsPreview.module.css";

const HINT =
  "파일을 첨부하면 브라우저에서 줄여서 소스에 직접 넣어요(서버로 올리지 않아요). 샘플 이미지나 https:// 주소를 직접 쓸 수도 있어요. 비워 두면 이미지를 넣지 않고, 그 밖의 값은 샘플 이미지로 바뀌어요.";

type Props = { id: string; label: string; value: string; onChange: (value: string) => void };

export default function CmsImageInput({ id, label, value, onChange }: Props) {
  const [message, setMessage] = useState("");
  const attached = value.startsWith("data:image/");

  async function attach(file: File | undefined) {
    if (!file) return;
    try {
      onChange(await fileToImageData(file));
      setMessage(`${file.name} 파일을 넣었어요.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "이미지를 넣지 못했어요.");
    }
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={styles.control}
        type="text"
        aria-describedby={`${id}-hint ${id}-status`}
        maxLength={LIMITS.image}
        readOnly={attached}
        value={attached ? "(첨부한 이미지)" : value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.imageActions}>
        <label className={styles.button}>
          파일 첨부
          <input
            className={styles.fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            aria-label={`${label} 파일 첨부`}
            onChange={(e) => {
              void attach(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {attached && (
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              onChange("");
              setMessage("첨부한 이미지를 뺐어요.");
            }}
          >
            첨부 지우기
          </button>
        )}
      </div>
      <p id={`${id}-status`} role="status" className={styles.hint}>
        {message}
      </p>
      <p id={`${id}-hint`} className={styles.hint}>
        {HINT}
      </p>
    </div>
  );
}
