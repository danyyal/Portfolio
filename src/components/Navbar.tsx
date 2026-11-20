import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../Assets/logo.webp";
import { Link, NavLink } from "react-router-dom";
import { CgFileDocument } from "react-icons/cg";
import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiOutlineExperiment,
} from "react-icons/ai";
import { otherRoutes } from "../routes";
import { SlSpeech } from "react-icons/sl";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import { HiOutlineSearch } from "react-icons/hi";
import { IoRocketOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useMode } from "../context/ModeContext";
import { OPEN_PALETTE_EVENT } from "./paletteEvent";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const languages = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

const navItems = [
  { to: "/", icon: <AiOutlineHome />, labelKey: "nav.home" },
  { to: "/about", icon: <AiOutlineUser />, labelKey: "nav.about" },
  {
    to: "/project",
    icon: <AiOutlineFundProjectionScreen />,
    labelKey: "nav.projects",
  },
  { to: "/resume", icon: <CgFileDocument />, labelKey: "nav.resume" },
  { to: "/testimonial", icon: <SlSpeech />, labelKey: "nav.testimonial" },
];

function NavBar() {
  const [expand, setExpand] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { setMode } = useMode();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="xl"
      className={`${scrolled ? "scrolled" : ""} ${expand ? "expanded-bg" : ""}`}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="me-4"
          onClick={() => setExpand(false)}
        >
          <img src={logo} className="img-fluid logo" alt="Danyyal Ali logo" />
          <span className="brand-name">
            danyyal<span className="brand-dot">.dev</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpand((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="nav-outer-div ms-auto">
            {navItems.map((item) => (
              <Nav.Item key={item.to}>
                <Nav.Link
                  as={NavLink}
                  to={item.to}
                  onClick={() => setExpand(false)}
                >
                  <div className="nav-inner-div">
                    {item.icon} {t(item.labelKey)}
                  </div>
                </Nav.Link>
              </Nav.Item>
            ))}

            <NavDropdown
              title={
                <span className="nav-inner-div d-inline-flex">
                  <AiOutlineExperiment /> {t("nav.playground")}
                </span>
              }
              id="playground-menu"
            >
              {otherRoutes.map((route) => (
                <NavDropdown.Item
                  key={route.link}
                  as={Link}
                  to={route.link}
                  onClick={() => setExpand(false)}
                >
                  {route.text}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <Nav.Item className="ms-2 d-none d-xl-flex align-items-center">
              <button
                type="button"
                className="kbd-hint-btn"
                aria-label="Open command palette"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT))
                }
              >
                <HiOutlineSearch /> ⌘K
              </button>
            </Nav.Item>

            <Nav.Item className="ms-2 d-flex align-items-center">
              <button
                type="button"
                className="mode-switch-btn"
                onClick={() => {
                  setExpand(false);
                  setMode("mission");
                  navigate("/");
                }}
              >
                <IoRocketOutline /> {t("mode.toMission")}
              </button>
            </Nav.Item>

            <Nav.Item className="ms-2 d-flex align-items-center">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="theme-toggle-btn"
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
