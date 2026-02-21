import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Home2() {
  const { t } = useTranslation();
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 className="home-about-description-header">
              {t("home.introduce")}{" "}
              <span className="purple"> {t("home.introducePurple")} </span>{" "}
              {t("home.introduceSelf")}
            </h1>
            <p className="home-about-body">
              {t("home.introP1")} 😅
              <br />
              <br />
              {t("home.introP2Front")}{" "}
              <i>
                <b className="purple">React.js, Next.js, and Angular.js</b>
              </i>{" "}
              {t("home.introP2Back")}{" "}
              <i>
                <b className="purple">Node.js, Nest.js, Python, and Three.js</b>{" "}
                {t("home.introP2Immersive")}
              </i>
              .
              <br />
              <br />
              {t("home.introP3")}
              <br />
              <br />
              {t("home.introP4Start")}{" "}
              <i>
                <b className="purple">
                  databases (PostgreSQL, MongoDB, Firebase)
                </b>
              </i>
              ,{" "}
              <i>
                <b className="purple">payments (Stripe, PayPal)</b>
              </i>
              , {t("home.introP4And")}{" "}
              <i>
                <b className="purple">Blockchain</b>
              </i>{" "}
              {t("home.introP4End")}
              <br />
              <br />
              {t("home.introP5Start")}{" "}
              <i>
                <b className="purple">canvas magic (Fabric.js)</b>
              </i>{" "}
              {t("home.introP5And")}{" "}
              <i>
                <b className="purple">3D web experiences</b>
              </i>
              {t("home.introP5End")}
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>{t("home.findMe")}</h1>
            <p>
              {t("home.connectStart")}{" "}
              <span className="purple">{t("home.connect")} </span>
              {t("home.connectEnd")}
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/danyyal"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/danyyal_ali_yar"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
