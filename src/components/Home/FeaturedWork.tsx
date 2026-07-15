import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Reveal from "../Reveal";
import { featuredProjects } from "../../data/projects";

function FeaturedWork() {
  const { t } = useTranslation();
  return (
    <Container className="featured-section">
      <Reveal>
        <div className="featured-header">
          <h2 className="featured-heading">
            {t("home.featuredHeading")}
            <span className="purple">.</span>
          </h2>
          <Link to="/project" className="featured-view-all">
            {t("home.viewAll")} <HiArrowRight />
          </Link>
        </div>
      </Reveal>
      <Row className="g-4">
        {featuredProjects.map((project, index) => (
          <Col md={4} key={project.title}>
            <Reveal delay={index * 0.1} className="h-100">
              <Link to="/project" className="featured-card">
                <div className="featured-img-wrap">
                  <img
                    src={project.imgPath}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                  />
                </div>
                <div className="featured-body">
                  <h3 className="featured-title">
                    {project.title} <HiArrowRight className="featured-arrow" />
                  </h3>
                  <p className="featured-desc">{t(project.descriptionKey)}</p>
                </div>
              </Link>
            </Reveal>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FeaturedWork;