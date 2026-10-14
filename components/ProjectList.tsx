"use client";

import { useState } from "react";
import {
  describeGroupResult,
  describeResult,
  filterProjects,
  groupProjects,
  type KindFilter,
} from "@/lib/filter";
import type { ProjectMeta } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectList.module.css";

const FILTERS: { value: KindFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "publishing", label: "퍼블리싱" },
  { value: "frontend", label: "프론트엔드" },
];

// 상태(선택된 필터)가 필요한 이 컴포넌트만 클라이언트 컴포넌트로 둔다.
// 데이터는 서버에서 읽어 props로 받으므로 파일 시스템 코드는 브라우저로 가지 않는다.
export default function ProjectList({ projects }: { projects: ProjectMeta[] }) {
  const [filter, setFilter] = useState<KindFilter>("all");
  const visible = filterProjects(projects, filter);
  // 필터를 먼저 적용하고 나서 묶으므로, 필터 뒤에도 두 묶음의 개수가 맞는다.
  const { featured, experiments } = groupProjects(visible);

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="프로젝트 종류">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={styles.filter}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className={styles.note}>
        개인 프로젝트는 역할 줄에 표시했고, 측정하지 않은 수치는 싣지 않았습니다.
      </p>
      {/* 필터를 바꾸면 이 영역의 글이 바뀌고, 스크린 리더가 바뀐 내용을 읽어 준다. */}
      <p role="status" className="sr-only">
        {describeGroupResult(featured.length, experiments.length)}
      </p>
      {visible.length === 0 ? (
        <p className={styles.empty}>{describeResult(0)}</p>
      ) : (
        <div className={styles.groups}>
          {featured.length > 0 && (
            <div>
              <p className={`label ${styles.groupLabel}`}>대표 프로젝트 · {featured.length}</p>
              <ul className={styles.list} aria-label="대표 프로젝트">
                {featured.map((project) => (
                  <li key={project.slug}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* 작은 도구와 실험은 처음에는 접어 둔다. details는 키보드와 스크린 리더가 기본으로 다룬다. */}
          {experiments.length > 0 && (
            <details className={styles.more}>
              <summary className={styles.summary}>
                <span className="label">작은 도구와 실험 · {experiments.length}</span>
              </summary>
              <ul className={styles.list} aria-label="작은 도구와 실험">
                {experiments.map((project) => (
                  <li key={project.slug}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
