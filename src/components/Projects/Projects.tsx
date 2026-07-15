import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Reveal from "../Reveal";
import "./Projects.css";
import { useTranslation } from "react-i18next";
import { projects } from "../../data/projects";

const additionalProjects = ["TTS", "Drone App", "Divebell"];

function Projects() {
  const { t } = useTranslation();
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <div className="section-header">
          <h1 className="project-heading">
            <span className="section-title">{t("projects.myRecent")}</span>{" "}
            <strong className="purple-glow">{t("projects.works")}</strong>
          </h1>
          <p className="section-subtitle">{t("projects.subtitle")}</p>
        </div>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {projects.map((project, index) => (
            <Col md={6} lg={4} className="project-card" key={project.title}>
              <Reveal delay={(index % 3) * 0.08} className="h-100">
                <ProjectCard
                  imgPath={project.imgPath}
                  title={project.title}
                  description={t(project.descriptionKey)}
                  demoLink={project.demoLink}
                  ghLink={project.ghLink}
                  isPrivate={project.isPrivate}
                />
              </Reveal>
            </Col>
          ))}
        </Row>

        <div className="other-projects">
          <h3 className="project-heading other-projects-heading">
            {t("projects.other")}{" "}
            <strong className="purple">{t("projects.projectsLabel")}</strong>
          </h3>
          <div className="other-projects-list">
            {additionalProjects.map((project) => (
              <span key={project} className="other-project-chip">
                {project}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default Projects;
