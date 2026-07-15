import { useState } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import { MdFullscreen } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  imgPath: string;
  title: string;
  description: string;
  ghLink?: string;
  demoLink?: string;
  isBlog?: boolean;
  isPrivate?: boolean;
}

function ProjectCards({
  imgPath,
  title,
  description,
  ghLink,
  demoLink,
  isBlog,
  isPrivate,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const hasGhLink = Boolean(ghLink?.startsWith("http"));

  return (
    <>
      <Card className="project-card-view">
        <div
          className="project-img-wrap"
          role="button"
          tabIndex={0}
          aria-label={`View ${title} fullscreen`}
          onClick={() => setShowModal(true)}
          onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
        >
          <Card.Img
            variant="top"
            src={imgPath}
            alt={`${title} screenshot`}
            className="project-img"
            loading="lazy"
          />
          <div className="project-img-overlay">
            <MdFullscreen size={28} />
          </div>
        </div>
        <Card.Body className="d-flex flex-column text-start">
          <div className="project-title-row">
            <Card.Title className="project-title">{title}</Card.Title>
            {isPrivate && (
              <span className="badge-private">
                <FiLock size={11} />
                {t("projects.private")}
              </span>
            )}
          </div>
          <Card.Text className="project-desc">{description}</Card.Text>
          <div className="project-actions mt-auto">
            {hasGhLink ? (
              <a
                className="card-btn"
                href={ghLink}
                target="_blank"
                rel="noreferrer"
              >
                <BsGithub />
                {isBlog ? t("projects.blog") : t("projects.github")}
              </a>
            ) : (
              <span className="card-btn disabled" aria-disabled="true">
                <BsGithub />
                {isBlog ? t("projects.blog") : t("projects.github")}
              </span>
            )}
            {!isBlog &&
              (demoLink ? (
                <a
                  className="card-btn card-btn-primary"
                  href={demoLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CgWebsite />
                  {t("projects.demo")}
                </a>
              ) : (
                <span className="card-btn disabled" aria-disabled="true">
                  <CgWebsite />
                  {t("projects.demo")}
                </span>
              ))}
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
        fullscreen="sm-down"
        className="fullscreen-modal"
        backdropClassName="fullscreen-modal-backdrop"
      >
        <Modal.Header closeButton className="border-0 bg-dark text-white">
          <Modal.Title className="d-flex align-items-center">
            <MdFullscreen className="me-2" size={24} />
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-dark d-flex align-items-center justify-content-center">
          <img
            src={imgPath}
            alt={title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProjectCards;
