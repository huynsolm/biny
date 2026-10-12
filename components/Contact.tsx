import SectionHeading from "./SectionHeading";
import styles from "./Contact.module.css";

const EMAIL = "salbulkyb@gmail.com";
const GITHUB = "https://github.com/huynsolm";

export default function Contact() {
  return (
    <section id="contact" className={`container ${styles.contact}`} aria-labelledby="contact-title">
      <SectionHeading id="contact-title" number="05" name="contact" />
      <ul className={styles.list}>
        <li>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </li>
        <li>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">
            GitHub (새 탭)
          </a>
        </li>
      </ul>
    </section>
  );
}
