import { useRef, type ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { CgFileDocument } from "react-icons/cg";
import Particle from "../Particle";
import CodeCard from "./CodeCard";
import Home2 from "./Home2";
import FeaturedWork from "./FeaturedWork";
import ContactSection from "./ContactSection";
import Type from "./Type";
import "./Home.css";
import { useTranslation } from "react-i18next";

const marqueeTech = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Three.js",
  "PostgreSQL",
  "Socket.IO",
  "TanStack Query",
  "GraphQL",
  "AWS",
  "MongoDB",
  "Supabase",
  "NestJS",
  "Python",
  "PyTorch",
  "YOLO",
  "PaddleOCR",
  "OpenVINO",
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
} as const;

/** Buttons that lean toward the cursor. */
function Magnetic({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-block" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const Home = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (!section || !spot) return;
    cancelAnimationFrame(rafRef.current);
    const rect = section.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    rafRef.current = requestAnimationFrame(() => {
      spot.style.background = `radial-gradient(620px circle at ${mouseX}px ${mouseY}px, var(--accent-glow-soft), transparent 65%)`;
    });
  };

  return (
    <>
      <Container
        fluid
        className="home-section"
        id="home"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        <Particle />
        <div className="hero-spotlight" ref={spotRef} aria-hidden="true" />
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <Container className="home-content">
          <Row className="align-items-center">
            <Col lg={7} className="home-header">
              <motion.div
                variants={stagger}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
              >
                <motion.div variants={rise}>
                  <a href="#contact" className="avail-pill avail-pill-link">
                    <span className="avail-dot" aria-hidden="true" />
                    {t("home.available")}
                  </a>
                </motion.div>
                <motion.h1 variants={rise} className="greeting">
                  <span className="intro-text">{t("home.greeting")} </span>
                  <span className="name-highlight gradient-text name-shimmer">
                    Danyyal Ali
                  </span>{" "}
                  <span className="wave" role="img" aria-label="wave">
                    👋
                  </span>
                </motion.h1>
                <motion.h2 variants={rise} className="hero-tagline">
                  {t("home.tagline")}{" "}
                  <span className="highlight">
                    {t("home.taglineHighlight")}
                  </span>
                </motion.h2>
                <motion.div variants={rise}>
                  <Type />
                </motion.div>

                <motion.div variants={rise} className="quick-tags">
                  <span className="tag">🚀 {t("home.tag1")}</span>
                  <span className="tag">💡 {t("home.tag2")}</span>
                  <span className="tag">🛠️ {t("home.tag3")}</span>
                  <span className="tag">🎯 {t("home.tag4")}</span>
                </motion.div>

                <motion.div variants={rise} className="hero-cta">
                  <Magnetic>
                    <Link to="/project" className="btn-accent">
                      {t("home.ctaProjects")} <HiArrowRight />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link to="/resume" className="btn-ghost">
                      <CgFileDocument /> {t("home.ctaResume")}
                    </Link>
                  </Magnetic>
                </motion.div>
              </motion.div>
            </Col>

            <Col lg={5} className="image-col d-none d-lg-block">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                className="code-card-wrap"
              >
                <CodeCard />
                <span className="float-chip float-chip-1" aria-hidden="true">
                  ⚛️ React
                </span>
                <span className="float-chip float-chip-2" aria-hidden="true">
                  {"{ }"}
                </span>
                <span className="float-chip float-chip-3" aria-hidden="true">
                  ☕ + 🎧
                </span>
              </motion.div>
            </Col>
          </Row>
        </Container>

        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue-dot" />
        </div>

        <div className="tech-marquee" aria-hidden="true">
          <div className="tech-marquee-track">
            {[...marqueeTech, ...marqueeTech].map((tech, index) => (
              <span className="tech-marquee-item" key={`${tech}-${index}`}>
                {tech} <span className="tech-marquee-sep">✦</span>
              </span>
            ))}
          </div>
        </div>

        <FeaturedWork />
        <Home2 />
        <ContactSection />
      </Container>
    </>
  );
};

export default Home;
