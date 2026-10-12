import Link from "next/link";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          ~/kim-youngbin
        </Link>
        <nav aria-label="주요 섹션">
          <ul className={styles.nav}>
            <li>
              <Link href="/#about">about</Link>
            </li>
            <li>
              <Link href="/#projects">projects</Link>
            </li>
            <li>
              <Link href="/#contact">contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
