import Card from "react-bootstrap/Card";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { ImPointRight } from "react-icons/im";
import "./AboutCard.css";
import { useTranslation } from "react-i18next";

function AboutCard() {
  const { t } = useTranslation();
  return (
    <Card className="quote-card-view enhanced-card">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p className="intro-text">
            <FaQuoteLeft className="quote-icon" />
            {t("about.hiEveryone")} <span className="purple">Danyyal Ali</span>{" "}
            {t("about.from")}
            <span className="purple"> {t("about.location")}</span>
            <br />
            {t("about.currentRole")} <strong>{t("about.roleTitle")}</strong>{" "}
            {t("about.at")} <span className="purple">{t("about.company")}</span>
            .
            <br />
            {t("about.degree")}{" "}
            <span className="purple">{t("about.university")}</span>.
            <br />
            <br />
            {t("about.beyondCode")}
          </p>

          <ul className="activity-list">
            <li className="about-activity">
              <ImPointRight /> {t("about.activity1")} 🏸
            </li>
            <li className="about-activity">
              <ImPointRight /> {t("about.activity2")} 📚
            </li>
            <li className="about-activity">
              <ImPointRight /> {t("about.activity3")} 🌍
            </li>
          </ul>

          <p className="quote-text">
            <FaQuoteRight className="quote-icon" /> {t("about.quote")}
          </p>
          <footer className="blockquote-footer">Danyyal</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
