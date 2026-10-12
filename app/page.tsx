import About from "@/components/About";
import Hero from "@/components/Hero";
import ProjectList from "@/components/ProjectList";
import { getAllProjects } from "@/lib/projects";
import styles from "./page.module.css";

export default function Home() {
  // 서버 컴포넌트에서 읽는다: 빌드 시점에 콘텐츠 파일을 읽어 HTML로 굳히기 때문에
  // 브라우저에는 파일 시스템 코드가 가지 않는다.
  const projects = getAllProjects();

  return (
    <main id="main">
      <Hero />
      <About />
      <section id="projects" className={`container ${styles.projects}`} aria-labelledby="projects-title">
        <h2 id="projects-title" className={`label ${styles.heading}`}>
          02 / projects
        </h2>
        <ProjectList projects={projects} />
      </section>
    </main>
  );
}
