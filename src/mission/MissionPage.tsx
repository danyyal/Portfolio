import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import SkyCanvas, { ASCENT_MS, type FlightState } from "./SkyCanvas";
import Reticle from "./Reticle";
import Constellations from "./Constellations";
import SkillSphere from "./SkillSphere";
import type { PlanetSpec } from "./textures";
import { useMode } from "../context/ModeContext";
import { projects } from "../data/projects";
import { aiModels, heroStats, profile, systems } from "../data/profile";
import { useTranslation } from "react-i18next";
import portrait from "../Assets/portrait.jpg";
import { modelDetails } from "../data/modelDetails";
import ModelDialog, { type Sheet } from "../components/ModelDetail/ModelDialog";
import { evidence } from "../data/evidence";
import HubspotForm from "../components/HubspotForm";
import "./mission.css";

/* One world per project, coloured after the product it stands for. */
const worldLooks: Omit<PlanetSpec, "id">[] = [
  {
    kind: "gas",
    palette: ["#0c3b2e", "#1a9f78", "#8fe3bf", "#e9fff4"],
    ring: "#9be8c8",
    seed: 3,
  },
  {
    kind: "ice",
    palette: ["#0e2b3a", "#2b8fa8", "#9fe3ee", "#f2fdff"],
    ring: "#bfeef5",
    seed: 61,
  },
  {
    kind: "ice",
    palette: ["#0b2a66", "#1f6fd1", "#7fc4ff", "#eef8ff"],
    storm: "rgba(255,90,170,0.75)",
    seed: 8,
  },
  {
    kind: "rock",
    palette: ["#2a1a4a", "#6b46c1", "#b79cf2", "#efe6ff"],
    seed: 14,
  },
  {
    kind: "gas",
    palette: ["#4a1c08", "#c8622a", "#f2b077", "#fff1dc"],
    ring: "#f6cfa0",
    seed: 21,
  },
  {
    kind: "rock",
    palette: ["#141c2b", "#43597a", "#9fb4d1", "#e8f0fb"],
    seed: 27,
  },
  {
    kind: "gas",
    palette: ["#4a0a24", "#c2255c", "#f783ac", "#ffe3ee"],
    storm: "rgba(255,240,200,0.7)",
    seed: 33,
  },
  {
    kind: "rock",
    palette: ["#3b2406", "#b7791f", "#f0c36a", "#fff6da"],
    seed: 41,
  },
  {
    kind: "ice",
    palette: ["#241a52", "#5b49c9", "#a99cf5", "#f1eeff"],
    ring: "#cfc6ff",
    seed: 47,
  },
  {
    kind: "gas",
    palette: ["#06223a", "#0e7490", "#5eead4", "#eafffb"],
    seed: 55,
  },
];
const worldSizes = [176, 152, 150, 138, 164, 132, 156, 140, 150, 144];

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "models", label: "Models" },
  { id: "systems", label: "Systems" },
  { id: "evidence", label: "Evidence" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
];

const LAUNCHED_KEY = "mission-launched";

function MissionPage() {
  const { t } = useTranslation();
  const { setMode } = useMode();
  const reduceMotion = Boolean(useReducedMotion());
  const [count, setCount] = useState(reduceMotion ? 100 : 0);
  const [stage, setStage] = useState<"pad" | "ascent" | "live">(
    reduceMotion ? "live" : "pad",
  );
  const [copied, setCopied] = useState(false);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const flight = useRef<FlightState>({
    phase: reduceMotion ? "orbit" : "pad",
    since: reduceMotion ? -10000 : performance.now(),
  });
  const railRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const worlds = useMemo<PlanetSpec[]>(
    () =>
      projects.map((_, index) => ({
        id: `world-${index}`,
        ...worldLooks[index % worldLooks.length],
      })),
    [],
  );

  /* countdown → lift-off → orbit */
  useEffect(() => {
    document.body.classList.add("mission-mode");
    return () => document.body.classList.remove("mission-mode");
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let seenBefore = false;
    try {
      seenBefore = sessionStorage.getItem(LAUNCHED_KEY) === "1";
      sessionStorage.setItem(LAUNCHED_KEY, "1");
    } catch {
      // storage blocked: play the full launch
    }
    const duration = seenBefore ? 900 : 2300;
    const start = performance.now();
    let frame = 0;
    const timers: number[] = [];
    flight.current = { phase: "pad", since: start };

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // the countdown eases out, so 0.7 of the time is the "Ignition" readout
      flight.current.ignite = progress > 0.68;
      setCount(Math.round((1 - Math.pow(1 - progress, 2)) * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      flight.current = { phase: "ascent", since: performance.now() };
      setStage("ascent");
      timers.push(window.setTimeout(() => setStage("live"), 1100));
      timers.push(
        window.setTimeout(() => {
          flight.current = { phase: "orbit", since: performance.now() };
        }, ASCENT_MS),
      );
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reduceMotion]);

  useEffect(() => {
    document.body.style.overflow = stage === "pad" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  /* scroll rail + reveal on scroll */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      railRef.current?.style.setProperty(
        "--progress",
        String(max > 0 ? window.scrollY / max : 0),
      );
      rootRef.current?.style.setProperty(
        "--far",
        String(max > 0 ? Math.min(1, (window.scrollY / max) * 2.2) : 0),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = document.querySelectorAll(".m-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const status =
    count < 45 ? "Systems check" : count < 90 ? "Fuelling" : "Ignition";

  return (
    <div
      ref={rootRef}
      className={`mission is-${stage} ${
        stage === "pad" && count >= 90 ? "is-ignite" : ""
      }`}
    >
      <a className="m-skip" href="#about">
        Skip to content
      </a>

      <div className="m-backdrop" aria-hidden="true">
        <div className="m-glow" />
        <div className="m-deep" />
        <div className="m-flash" />
        <svg
          className="m-ground"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path d="M0 62 C 180 20 320 30 470 70 C 620 108 760 60 900 52 C 1080 42 1180 110 1300 96 C 1370 88 1410 70 1440 64 L1440 160 L0 160 Z" />
        </svg>
      </div>
      <SkyCanvas flight={flight} planets={worlds} reduceMotion={reduceMotion} />
      <div className="m-vignette" aria-hidden="true" />
      <Reticle />

      {stage !== "live" && (
        <div className="m-pre" role="status" aria-live="polite">
          <div className="m-pre-inner">
            <p className="m-pre-mark">{profile.name}</p>
            <div className="m-pre-rule">
              <span style={{ transform: `scaleX(${count / 100})` }} />
            </div>
            <div className="m-pre-foot">
              <span>{stage === "ascent" ? "Lift-off" : status}</span>
              <span>{String(count).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      )}

      <aside className="m-rail" ref={railRef} aria-hidden="true">
        <i />
      </aside>

      <header className="m-header">
        <nav className="m-nav" aria-label="Sections">
          <a className="m-logo" href="#top" data-lock>
            Danyyal
          </a>
          <ul className="m-links">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} data-lock>
                  {section.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/resume" data-lock>
                {t("nav.resume")}
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="m-mode"
            data-lock
            onClick={() => setMode("classic")}
          >
            <i aria-hidden="true" />
            {t("mode.toClassic")}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="m-hero">
          <div className="m-hero-inner">
            <p className="m-tagline">
              <i aria-hidden="true" />
              {profile.role} · {profile.company}
            </p>
            <h1 className="m-name" aria-label={profile.name}>
              {profile.name.split("").map((letter, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  {letter === " " ? " " : letter}
                </span>
              ))}
            </h1>
            <p className="m-lede">{profile.lede}</p>
            <dl className="m-telemetry">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="m-cue" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </section>

        <section className="m-section" id="about">
          <div className="m-about">
            <div className="m-porthole m-reveal">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="48" />
              </svg>
              <div className="m-porthole-glass">
                <img src={portrait} alt={`Portrait of ${profile.name}`} />
              </div>
            </div>
            <div>
              <h2 className="m-title m-reveal">About Me</h2>
              <div className="m-record m-reveal">
                {profile.record.map((row) => (
                  <div className="m-record-row" key={row.key}>
                    <span className="m-record-key">{row.key}</span>
                    <span className="m-record-sep">:</span>
                    <span className="m-record-val">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="m-socials m-reveal">
                <a href={`mailto:${profile.email}`} data-lock>
                  Email
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  data-lock
                >
                  GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-lock
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="m-section" id="projects">
          <h2 className="m-title m-reveal">Projects</h2>
          <p className="m-kicker m-reveal">
            {projects.length} worlds · hover one for its readout
          </p>
          <div className="m-system">
            {projects.map((project, index) => {
              const size = worldSizes[index % worldSizes.length];
              const body = (
                <>
                  <div
                    className="m-world-slot"
                    data-world={`world-${index}`}
                    style={{ width: size, height: size }}
                  />
                  <p className="m-world-name">{project.title}</p>
                  <div className="m-world-info">
                    <p>{t(project.summaryKey)}</p>
                    {project.demoLink && <span>Visit ↗</span>}
                  </div>
                </>
              );
              return project.demoLink ? (
                <a
                  key={project.title}
                  className="m-world m-reveal"
                  href={project.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ transitionDelay: `${(index % 3) * 90}ms` }}
                >
                  {body}
                </a>
              ) : (
                <div
                  key={project.title}
                  className="m-world m-reveal"
                  tabIndex={0}
                >
                  {body}
                </div>
              );
            })}
          </div>
        </section>

        <section className="m-section" id="models">
          <h2 className="m-title m-reveal">Models</h2>
          <div className="m-dsn m-reveal">
            <div className="m-dsn-head">
              <span>Deep Space Network</span>
              <i />
              <span className="m-dsn-status">
                <b aria-hidden="true" />
                Signal lock · {String(aiModels.length).padStart(2, "0")}{" "}
                transmissions
              </span>
            </div>
            <ol className="m-dsn-list">
              {aiModels.map((model, index) => (
                <li key={model.name}>
                  <button
                    type="button"
                    className="m-dsn-row"
                    data-lock
                    disabled={!modelDetails[model.name]}
                    onClick={() =>
                      setSheet({
                        kicker: model.task,
                        title: model.name,
                        detail: modelDetails[model.name],
                      })
                    }
                  >
                    <span className="m-dsn-id">
                      TX‑{String(index + 1).padStart(3, "0")}
                    </span>
                    <span className="m-dsn-body">
                      <span className="m-dsn-name">{model.name}</span>
                      <span className="m-dsn-desc">{model.detail}</span>
                    </span>
                    <span className="m-dsn-wave" aria-hidden="true" />
                    <span className="m-dsn-meta">
                      <span className="m-dsn-task">{model.task}</span>
                      {model.readout && (
                        <span className="m-dsn-readout">{model.readout}</span>
                      )}
                      {modelDetails[model.name] && (
                        <span className="m-dsn-open">Open file →</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="m-section" id="systems">
          <h2 className="m-title m-reveal">Systems</h2>
          <p className="m-kicker m-reveal">
            What I built and run at {profile.company}
          </p>
          <div className="m-panels">
            {systems.map((system, index) => (
              <article
                className="m-panel m-reveal"
                key={system.title}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <p className="m-panel-kicker">
                  {String(index + 1).padStart(2, "0")} · {system.kicker}
                </p>
                <h3>{system.title}</h3>
                <p className="m-panel-body">{system.body}</p>
                <dl className="m-panel-stats">
                  {system.stats.map((stat) => (
                    <div key={stat.label}>
                      <dd>{stat.value}</dd>
                      <dt>{stat.label}</dt>
                    </div>
                  ))}
                </dl>
                <div className="m-chips">
                  {system.tech.map((tech) => (
                    <span key={tech} className="m-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="m-section" id="evidence">
          <h2 className="m-title m-reveal">Evidence</h2>
          <p className="m-kicker m-reveal">
            How it is built · open a file for the numbers
          </p>
          <div className="m-files">
            {evidence.map((item, index) => (
              <button
                type="button"
                key={item.title}
                className="m-file m-reveal"
                data-lock
                style={{ transitionDelay: `${(index % 4) * 70}ms` }}
                onClick={() =>
                  setSheet({
                    kicker: item.kicker,
                    title: item.title,
                    detail: item.detail,
                  })
                }
              >
                <span className="m-file-no">
                  LOG‑{String(index + 1).padStart(2, "0")} · {item.kicker}
                </span>
                <span className="m-file-title">{item.title}</span>
                <span className="m-file-body">{item.summary}</span>
                <span className="m-file-readout">{item.readout}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="m-section" id="experience">
          <h2 className="m-title m-reveal">Experience</h2>
          <div className="m-reveal">
            <Constellations />
          </div>
        </section>

        <section className="m-section" id="skills">
          <h2 className="m-title m-reveal">Skills</h2>
          <div className="m-reveal">
            <SkillSphere reduceMotion={reduceMotion} />
          </div>
        </section>

        <section className="m-section m-contact" id="contact">
          <p className="m-kicker m-reveal">Open a channel</p>
          <h2 className="m-title m-reveal">{t("home.contactTitle")}</h2>
          <div className="m-contact-actions m-reveal">
            <a
              className="m-btn is-solid"
              href={`mailto:${profile.email}`}
              data-lock
            >
              {t("home.contactCta")}
            </a>
            <button
              type="button"
              className="m-btn"
              onClick={copyEmail}
              data-lock
            >
              {copied ? t("home.copied") : t("home.copyEmail")}
            </button>
            <Link className="m-btn" to="/resume" data-lock>
              {t("home.ctaResume")}
            </Link>
          </div>
          <p className="m-kicker m-reveal m-form-label">
            {t("home.contactForm")}
          </p>
          <div className="m-reveal">
            <HubspotForm className="m-form" />
          </div>
        </section>
      </main>

      <ModelDialog
        sheet={sheet}
        skin="mission"
        onClose={() => setSheet(null)}
      />

      <footer className="m-footer">
        <span>
          © {new Date().getFullYear()} {profile.fullName}
        </span>
        <button type="button" onClick={() => setMode("classic")} data-lock>
          {t("mode.toClassic")}
        </button>
      </footer>
    </div>
  );
}

export default MissionPage;
