import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import "./Home.css";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 className="greeting">
                <span className="intro-text">{t("home.greeting")} </span>
                <span className="name-highlight">Danyyal Ali 👨‍💻</span>
              </h1>
              <h2 className="text-gray-300">
                {t("home.tagline")}{" "}
                <span className="highlight">{t("home.taglineHighlight")}</span>
              </h2>
              <Type />

              <div className="quick-tags">
                <span className="tag">🚀 {t("home.tag1")}</span>
                <span className="tag">💡 {t("home.tag2")}</span>
                <span className="tag">🛠️ {t("home.tag3")}</span>
                <span className="tag">🎯 {t("home.tag4")}</span>
              </div>
            </Col>

            <Col md={5} className="image-col">
              <div className="image-wrapper">
                <img
                  src={homeLogo}
                  alt="home"
                  className="img-fluid animated-image"
                  style={{ maxHeight: "450px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <Home2 />
      </Container>
    </>
  );
};

export default Home;
