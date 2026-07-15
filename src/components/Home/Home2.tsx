import { Container, Row, Col } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import {
  HiOutlineColorSwatch,
  HiOutlineServer,
  HiOutlineCube,
} from "react-icons/hi";
import Reveal from "../Reveal";
import { useTranslation } from "react-i18next";

const crafts = [
  {
    icon: <HiOutlineColorSwatch />,
    titleKey: "home.craft1Title",
    descKey: "home.craft1Desc",
    tech: ["React", "Next.js", "Angular", "TypeScript", "Fabric.js"],
  },
  {
    icon: <HiOutlineServer />,
    titleKey: "home.craft2Title",
    descKey: "home.craft2Desc",
    tech: ["Node.js", "NestJS", "Python", "AWS", "PostgreSQL", "Socket.IO"],
  },
  {
    icon: <HiOutlineCube />,
    titleKey: "home.craft3Title",
    descKey: "home.craft3Desc",
    tech: ["Three.js", "WebGL", "GLTF", "Canvas"],
  },
];

const socials = [
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

function Home2() {
  const { t } = useTranslation();
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="home-about-description">
            <Reveal>
              <h1 className="home-about-description-header text-start">
                {t("home.introduce")}{" "}
                <span className="purple">{t("home.introducePurple")}</span>{" "}
                {t("home.introduceSelf")}
              </h1>
              <p className="home-about-body intro-lead">
                {t("home.introP1")} 😅
              </p>
              <p className="home-about-body">{t("home.introP3")}</p>
            </Reveal>
          </Col>

          <Col lg={6}>
            <div className="craft-stack">
              {crafts.map((craft, index) => (
                <Reveal key={craft.titleKey} delay={index * 0.12}>
                  <Tilt
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    transitionSpeed={1600}
                  >
                    <div className="craft-card">
                      <div className="craft-icon">{craft.icon}</div>
                      <div className="craft-body">
                        <h3 className="craft-title">{t(craft.titleKey)}</h3>
                        <p className="craft-desc">{t(craft.descKey)}</p>
                        <div className="craft-tech">
                          {craft.tech.map((tech) => (
                            <span className="tech-chip" key={tech}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <Reveal>
              <h1>{t("home.findMe")}</h1>
              <p>
                {t("home.connectStart")}{" "}
                <span className="purple">{t("home.connect")} </span>
                {t("home.connectEnd")}
              </p>
              <ul className="home-about-social-links">
                {socials.map((social) => (
                  <li className="social-icons" key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="icon-colour home-social-icons"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
