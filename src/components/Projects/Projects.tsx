import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Reveal from "../Reveal";
import "./Projects.css";
import { useTranslation } from "react-i18next";
import { projects } from "../../data/projects";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { aiModels, systems } from "../../data/profile";
import { evidence } from "../../data/evidence";
import { modelDetails } from "../../data/modelDetails";
import ModelDialog, { type Sheet } from "../ModelDetail/ModelDialog";

const additionalProjects = ["TTS", "Drone App", "Divebell"];

function Projects() {
  const { t } = useTranslation();
  const [sheet, setSheet] = useState<Sheet | null>(null);
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

        <section className="ai-section" id="ai-models">
          <div className="section-header">
            <h2 className="project-heading">
              <span className="section-title">{t("projects.aiTitle")}</span>{" "}
              <strong className="purple-glow">{t("projects.aiAccent")}</strong>
            </h2>
            <p className="section-subtitle">{t("projects.aiSubtitle")}</p>
          </div>
          <div className="model-grid">
            {aiModels.map((model, index) => (
              <Reveal
                key={model.name}
                delay={(index % 3) * 0.08}
                className="h-100"
              >
                {modelDetails[model.name] ? (
                  <button
                    type="button"
                    className="model-card is-clickable"
                    onClick={() =>
                      setSheet({
                        kicker: model.task,
                        title: model.name,
                        detail: modelDetails[model.name],
                      })
                    }
                  >
                    <span className="model-task">{model.task}</span>
                    <span className="model-name">{model.name}</span>
                    <span className="model-detail">{model.detail}</span>
                    {model.readout && (
                      <span className="model-readout">{model.readout}</span>
                    )}
                    <span className="model-more">
                      {t("projects.modelDetails")} <HiArrowRight />
                    </span>
                  </button>
                ) : (
                  <article className="model-card">
                    <p className="model-task">{model.task}</p>
                    <h3 className="model-name">{model.name}</h3>
                    <p className="model-detail">{model.detail}</p>
                    {model.readout && (
                      <p className="model-readout">{model.readout}</p>
                    )}
                  </article>
                )}
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ai-section" id="systems">
          <div className="section-header">
            <h2 className="project-heading">
              <span className="section-title">
                {t("projects.systemsTitle")}
              </span>{" "}
              <strong className="purple-glow">
                {t("projects.systemsAccent")}
              </strong>
            </h2>
            <p className="section-subtitle">{t("projects.systemsSubtitle")}</p>
          </div>
          <div className="system-grid">
            {systems.map((system, index) => (
              <Reveal key={system.title} delay={index * 0.08} className="h-100">
                <article className="model-card">
                  <p className="model-task">{system.kicker}</p>
                  <h3 className="model-name">{system.title}</h3>
                  <p className="model-detail">{system.body}</p>
                  <dl className="system-stats">
                    {system.stats.map((stat) => (
                      <div key={stat.label}>
                        <dd>{stat.value}</dd>
                        <dt>{stat.label}</dt>
                      </div>
                    ))}
                  </dl>
                  <div className="system-tech">
                    {system.tech.map((tech) => (
                      <span className="tech-chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ai-section" id="evidence">
          <div className="section-header">
            <h2 className="project-heading">
              <span className="section-title">
                {t("projects.evidenceTitle")}
              </span>{" "}
              <strong className="purple-glow">
                {t("projects.evidenceAccent")}
              </strong>
            </h2>
            <p className="section-subtitle">{t("projects.evidenceSubtitle")}</p>
          </div>
          <div className="model-grid">
            {evidence.map((item, index) => (
              <Reveal
                key={item.title}
                delay={(index % 3) * 0.08}
                className="h-100"
              >
                <button
                  type="button"
                  className="model-card is-clickable"
                  onClick={() =>
                    setSheet({
                      kicker: item.kicker,
                      title: item.title,
                      detail: item.detail,
                    })
                  }
                >
                  <span className="model-task">{item.kicker}</span>
                  <span className="model-name">{item.title}</span>
                  <span className="model-detail">{item.summary}</span>
                  <span className="model-readout">{item.readout}</span>
                  <span className="model-more">
                    {t("projects.modelDetails")} <HiArrowRight />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <ModelDialog
          sheet={sheet}
          skin="classic"
          onClose={() => setSheet(null)}
        />

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
