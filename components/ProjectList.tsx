"use client";

import { useState } from "react";
import { describeResult, filterProjects, type KindFilter } from "@/lib/filter";
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
      {/* 필터를 바꾸면 이 영역의 글이 바뀌고, 스크린 리더가 바뀐 내용을 읽어 준다. */}
      <p role="status" className="sr-only">
        {describeResult(visible.length)}
      </p>
      {visible.length === 0 ? (
        <p className={styles.empty}>{describeResult(0)}</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
