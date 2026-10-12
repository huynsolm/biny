import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#main" className={styles.brand}>
          ~/kim-youngbin
        </a>
        <nav aria-label="주요 섹션">
          <ul className={styles.nav}>
            <li>
              <a href="#about">about</a>
            </li>
            <li>
              <a href="#projects">projects</a>
            </li>
            <li>
              <a href="#contact">contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
