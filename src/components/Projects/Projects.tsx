import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import cerpro from "../../Assets/Projects/cerpro.png";
import lebara from "../../Assets/Projects/lebara.png";
import yjsg from "../../Assets/Projects/yjsg.png";
import spacedventures from "../../Assets/Projects/spacedventures.png";
import riskcomply from "../../Assets/Projects/riskcomply.png";
import liftoffleads from "../../Assets/Projects/liftoffleads.png";
import fridaypos from "../../Assets/Projects/fridaypos.png";
import tambr from "../../Assets/Projects/tambr.png";
import portalio from "../../Assets/Projects/portalio.png";
import "./Projects.css";
import { useTranslation } from "react-i18next";

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
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={lebara}
              isBlog={false}
              title="Lebara (AEM + React)"
              demoLink={"https://www.lebara.co.uk/en/home.html"}
              description={t("projects.lebaraDesc")}
              ghLink="https://github.com/Lebara-Ltd/storybook"
              isPrivate={true}
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={cerpro}
              isBlog={false}
              title="CERPRO"
              demoLink={"https://platform.cerpro.io"}
              description={t("projects.cerproDesc")}
              ghLink="https://github.com/saschamuellercerpro/cerpro"
              isPrivate={true}
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={yjsg}
              isBlog={false}
              title="YJSG"
              demoLink={"https://jobsearchgenius.ai/"}
              description={t("projects.yjsgDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={spacedventures}
              isBlog={false}
              title="Spaced Ventures"
              demoLink={"https://www.33fg.com/"}
              description={t("projects.spacedventuresDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={riskcomply}
              isBlog={false}
              title="Risk Comply"
              demoLink={"https://riskcomply.online"}
              description={t("projects.riskcomplyDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={liftoffleads}
              isBlog={false}
              demoLink={"https://portal.liftoffleads.com/"}
              title="Liftoff Leads"
              description={t("projects.liftoffleadsDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={fridaypos}
              isBlog={false}
              title="Friday POS"
              demoLink={"https://www.fridaypos.com/"}
              description={t("projects.fridayposDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={tambr}
              isBlog={false}
              title="Tambr"
              demoLink={"https://www.tambr.app/"}
              description={t("projects.tambrDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={portalio}
              isBlog={false}
              title="Portal.io"
              demoLink={"https://portal.io/"}
              description={t("projects.portalioDesc")}
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Row style={{ justifyContent: "center", paddingTop: "30px" }}>
            <Col md={12}>
              <h3
                className="project-heading"
                style={{ fontSize: "1.5rem", marginBottom: "20px" }}
              >
                {t("projects.other")}{" "}
                <strong className="purple">
                  {t("projects.projectsLabel")}
                </strong>
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  justifyContent: "center",
                }}
              >
                {additionalProjects.map((project, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "var(--tag-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "8px",
                      padding: "12px 20px",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as any).style.backgroundColor =
                        "var(--tag-bg-hover)";
                      (e.target as any).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as any).style.backgroundColor = "var(--tag-bg)";
                      (e.target as any).style.transform = "translateY(0px)";
                    }}
                  >
                    {project}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
