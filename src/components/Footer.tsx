import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { otherRoutes } from "../routes";

const socialLinks = [
  {
    href: "https://github.com/danyyal",
    icon: <AiFillGithub />,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/",
    icon: <FaLinkedinIn />,
    label: "LinkedIn",
  },
  {
    href: "https://www.instagram.com/danyyal_ali_yar",
    icon: <AiFillInstagram />,
    label: "Instagram",
  },
];

const pageLinks = [
  { to: "/", labelKey: "nav.home" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/project", labelKey: "nav.projects" },
  { to: "/resume", labelKey: "nav.resume" },
  { to: "/testimonial", labelKey: "nav.testimonial" },
];

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Container fluid as="footer" className="footer">
      <Container>
        <Row className="gy-4 text-start">
          <Col md={5}>
            <p className="brand-name mb-2">
              danyyal<span className="brand-dot">.dev</span>
            </p>
            <p className="footer-tagline">{t("footer.tagline")}</p>
            <div className="d-flex gap-2 mt-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="footer-social-link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          <Col xs={6} md={3}>
            <p className="footer-heading">{t("footer.pages")}</p>
            <ul className="footer-link-list">
              {pageLinks.map((page) => (
                <li key={page.to}>
                  <Link to={page.to} className="footer-link">
                    {t(page.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={6} md={4}>
            <p className="footer-heading">{t("footer.playground")}</p>
            <ul className="footer-link-list">
              {otherRoutes.map((route) => (
                <li key={route.link}>
                  <Link to={route.link} className="footer-link">
                    {route.text}
                    <HiArrowUpRight className="footer-link-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year}{" "}
            <span className="footer-name gradient-text">Danyyal Ali Yar</span>.{" "}
            {t("footer.rights")}
          </p>
          <p className="footer-copy">React · TypeScript · Vite</p>
        </div>
      </Container>
    </Container>
  );
}

export default Footer;
