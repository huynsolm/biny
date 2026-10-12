import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/types";
import styles from "./ProjectCard.module.css";

const KIND_LABEL: Record<ProjectMeta["kind"], string> = {
  publishing: "publishing",
  frontend: "frontend",
};

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <article className={styles.card}>
      {project.image && (
        <div className={styles.thumb}>
          <Image
            src={project.image}
            alt={project.imageAlt ?? ""}
            fill
            sizes="(min-width: 60rem) 28rem, (min-width: 40rem) 45vw, 100vw"
            className={styles.thumbImage}
          />
        </div>
      )}
      <p className={`label ${styles.kind}`}>{KIND_LABEL[project.kind]}</p>
      <h3 className={styles.title}>
        <Link href={`/projects/${project.slug}`} className={styles.link}>
          {project.title}
        </Link>
      </h3>
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.role}>{project.role}</p>
      <ul className={`label ${styles.stack}`} aria-label="사용 기술">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </article>
  );
}
