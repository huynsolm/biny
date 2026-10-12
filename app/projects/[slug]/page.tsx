import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProject, getProjectSlugs } from "@/lib/projects";
import styles from "./page.module.css";

// 파일 개수만큼 빌드 시점에 페이지를 미리 만든다. 목록에 없는 슬러그는 404.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.meta.title} | 김영빈`;
  const description = project.meta.summary;
  // 상세 페이지를 공유했을 때 홈이 아니라 이 프로젝트의 미리보기가 나오도록 openGraph도 따로 지정한다.
  return { title, description, openGraph: { title, description, type: "website", locale: "ko_KR" } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;

  return (
    <main id="main" className={`container ${styles.page}`}>
      <Link href="/#projects" className={`label ${styles.back}`}>
        &larr; projects
      </Link>
      <header className={styles.header}>
        <p className={`label ${styles.kind}`}>{meta.kind}</p>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.summary}>{meta.summary}</p>
        <dl className={styles.facts}>
          <div>
            <dt className="label">role</dt>
            <dd>{meta.role}</dd>
          </div>
          <div>
            <dt className="label">stack</dt>
            <dd className="label">{meta.stack.join(" / ")}</dd>
          </div>
        </dl>
        {(meta.liveUrl || meta.repoUrl) && (
          <p className={styles.links}>
            {meta.liveUrl && (
              <a href={meta.liveUrl} target="_blank" rel="noopener noreferrer">
                실제 화면 보기 (새 탭)
              </a>
            )}
            {meta.repoUrl && (
              <a href={meta.repoUrl} target="_blank" rel="noopener noreferrer">
                저장소 보기 (새 탭)
              </a>
            )}
          </p>
        )}
      </header>
      <div className={styles.prose}>
        <MDXRemote source={content} />
      </div>
    </main>
  );
}
