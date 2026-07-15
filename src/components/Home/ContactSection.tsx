import { useState } from "react";
import { Container } from "react-bootstrap";
import { HiOutlineMail, HiCheck, HiOutlineClipboardCopy } from "react-icons/hi";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Reveal from "../Reveal";

const EMAIL = "danyyal.ali.31@gmail.com";

function ContactSection() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <Container fluid id="contact" className="contact-section">
      <Reveal>
        <div className="contact-inner">
          <span className="avail-pill">
            <span className="avail-dot" aria-hidden="true" />
            {t("home.available")}
          </span>
          <h2 className="contact-title">{t("home.contactTitle")}</h2>
          <p className="contact-subtitle">{t("home.contactSubtitle")}</p>
          <div className="contact-actions">
            <a
              className="btn-accent"
              href={`mailto:${EMAIL}?subject=Project%20inquiry`}
            >
              <HiOutlineMail /> {t("home.contactCta")}
            </a>
            <button type="button" className="btn-ghost" onClick={copyEmail}>
              {copied ? <HiCheck /> : <HiOutlineClipboardCopy />}
              {copied ? t("home.copied") : t("home.copyEmail")}
            </button>
          </div>
          <div className="contact-socials">
            <a
              href="https://github.com/danyyal"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="footer-social-link"
            >
              <AiFillGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="footer-social-link"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

export default ContactSection;