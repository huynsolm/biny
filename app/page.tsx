import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import ProjectList from "@/components/ProjectList";
import SectionHeading from "@/components/SectionHeading";
import Skills from "@/components/Skills";
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
        <SectionHeading id="projects-title" number="02" name="projects" />
        <ProjectList projects={projects} />
      </section>
      <Skills />
      <Method />
      <Contact />
    </main>
  );
}
