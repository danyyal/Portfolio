import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Particle from "./Particle";

function NotFound() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Container fluid className="project-section notfound-section">
      <Particle />
      <div className="notfound-inner">
        <p className="notfound-code gradient-text">404</p>
        <div className="notfound-terminal">
          <span className="notfound-prompt">danyyal@dev:~$</span> cd {pathname}
          <br />
          <span className="notfound-error">
            bash: cd: {pathname}: No such file or directory
          </span>
        </div>
        <p className="notfound-msg">{t("notFound.msg")}</p>
        <Link to="/" className="btn-accent">
          <HiArrowLeft /> {t("notFound.cta")}
        </Link>
      </div>
    </Container>
  );
}

export default NotFound;