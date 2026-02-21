import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import { CgGitFork } from "react-icons/cg";
import { ImBlog } from "react-icons/im";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiOutlineEye,
} from "react-icons/ai";
import { SlSpeech } from "react-icons/sl";
import { CgFileDocument } from "react-icons/cg";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const languages = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex">
          <img src={logo} className="img-fluid logo" alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(!expand);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="nav-outer-div ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <div className="nav-inner-div">
                  <AiOutlineHome style={{ marginBottom: "2px" }} />{" "}
                  {t("nav.home")}
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/about"
                onClick={() => updateExpanded(false)}
              >
                <div className="nav-inner-div">
                  <AiOutlineUser style={{ marginBottom: "2px" }} />{" "}
                  {t("nav.about")}
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/project"
                onClick={() => updateExpanded(false)}
              >
                <div className="nav-inner-div">
                  <AiOutlineFundProjectionScreen
                    style={{ marginBottom: "2px" }}
                  />{" "}
                  {t("nav.projects")}
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/resume"
                onClick={() => updateExpanded(false)}
              >
                <div className="nav-inner-div">
                  <CgFileDocument style={{ marginBottom: "2px" }} />{" "}
                  {t("nav.resume")}
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/testimonial"
                onClick={() => updateExpanded(false)}
              >
                <div className="nav-inner-div">
                  <SlSpeech style={{ marginBottom: "2px" }} />{" "}
                  {t("nav.testimonial")}
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/demo"
                onClick={() => updateExpanded(false)}
              >
                <div className="nav-inner-div">
                  <AiOutlineEye style={{ marginBottom: "2px" }} />{" "}
                  {t("nav.demo")}
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="https://danyyaldevblogs.vercel.app/"
                target="_blank"
                rel="noreferrer"
                disabled
              >
                <div
                  className="nav-inner-div"
                  style={{ cursor: "not-allowed", color: "dimgray" }}
                >
                  <ImBlog style={{ marginBottom: "2px" }} /> {t("nav.blogs")}
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="fork-btn">
              <Nav.Link
                href="https://github.com/danyyal/Portfolio"
                target="_blank"
                rel="noreferrer"
                disabled
              >
                <div className="nav-inner-div">
                  <CgGitFork style={{ fontSize: "1.2em" }} />{" "}
                  <AiFillStar style={{ fontSize: "1.1em" }} />
                </div>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="ms-2 d-flex align-items-center">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  background: "transparent",
                  border: "1px solid var(--card-border)",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-purple-light)",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
              >
                {theme === "dark" ? <BsSunFill /> : <BsMoonFill />}
              </button>
            </Nav.Item>

            <NavDropdown
              title={i18n.language.toUpperCase()}
              id="language-switcher"
              className="ms-2"
            >
              {languages.map((lang) => (
                <NavDropdown.Item
                  key={lang.code}
                  active={i18n.language === lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                >
                  {lang.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
