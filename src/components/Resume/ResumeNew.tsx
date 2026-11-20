import { lazy, Suspense } from "react";
import { Container } from "react-bootstrap";
import Particle from "../Particle.js";
import Reveal from "../Reveal";
import pdf from "../../Assets/Resume.pdf";
import { AiOutlineDownload, AiOutlineMail } from "react-icons/ai";
import { BsGithub, BsLinkedin, BsTelephone } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import {
  HiOutlineCode,
  HiOutlineServer,
  HiOutlineLightningBolt,
  HiOutlineDatabase,
  HiOutlineCloud,
  HiOutlineChip,
} from "react-icons/hi";
import { useWindowSize } from "../../utils/customHooks/useWindowSize";
import { career, profile } from "../../data/profile";
import "./resume.css";

const PdfViewer = lazy(() => import("../PdfViewer"));

const contacts = [
  {
    href: "mailto:danyyal.ali.31@gmail.com",
    icon: <AiOutlineMail />,
    label: "danyyal.ali.31@gmail.com",
  },
  {
    href: "tel:+923246552914",
    icon: <BsTelephone />,
    label: "+92 324 6552914",
  },
  {
    href: "https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/",
    icon: <BsLinkedin />,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/danyyal",
    icon: <BsGithub />,
    label: "GitHub",
  },
];

const stats = [
  { value: "6+", label: "Years of experience" },
  { value: "25+", label: "Projects delivered" },
  { value: "49", label: "Model weights in production" },
  { value: "1M+", label: "Training crops managed" },
];

const toolbox = [
  {
    title: "AI & computer vision",
    icon: <HiOutlineChip />,
    items: [
      "PyTorch",
      "YOLO",
      "DBNet++",
      "CRAFT",
      "PaddleOCR",
      "LayoutLM",
      "RF-DETR",
      "LightGBM",
      "OpenVINO",
      "ONNX",
      "DVC",
    ],
  },
  {
    title: "Frontend",
    icon: <HiOutlineCode />,
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Angular",
      "Redux",
      "TanStack Query",
      "Tailwind CSS",
      "Three.js",
      "WebAssembly",
      "Storybook",
      "Fabric.js",
    ],
  },
  {
    title: "Backend",
    icon: <HiOutlineServer />,
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "Python",
      "Flask",
      "GraphQL",
      "REST APIs",
      "AWS Lambda",
    ],
  },
  {
    title: "Realtime & Security",
    icon: <HiOutlineLightningBolt />,
    items: ["Socket.IO", "WebSockets", "bcrypt", "Secure auth flows"],
  },
  {
    title: "Databases",
    icon: <HiOutlineDatabase />,
    items: [
      "PostgreSQL",
      "MySQL",
      "SQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "Redis",
    ],
  },
  {
    title: "Cloud & Tooling",
    icon: <HiOutlineCloud />,
    items: [
      "AWS",
      "Step Functions",
      "Terraform",
      "Docker",
      "Vercel",
      "CI/CD",
      "Git",
    ],
  },
];

function ResumeNew() {
  const { width } = useWindowSize();

  return (
    <Container fluid className="resume-section">
      <Particle />
      <Container style={{ maxWidth: 980 }}>
        {/* Hero */}
        <Reveal>
          <header className="resume-hero">
            <p className="resume-kicker">Resume</p>
            <h1 className="resume-name">
              Danyyal <span className="gradient-text">Ali Yar</span>
            </h1>
            <p className="resume-role">
              {profile.role} — web platforms, 3D simulations and the
              computer-vision models behind them.
            </p>

            <div className="resume-contact-row">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  className="contact-chip"
                  href={contact.href}
                  target={
                    contact.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel="noreferrer"
                >
                  {contact.icon} {contact.label}
                </a>
              ))}
            </div>

            <div className="resume-cta-row">
              <a
                className="btn-accent"
                href={pdf}
                download="Danyyal Ali Yar - Resume.pdf"
              >
                <AiOutlineDownload />
                Download CV
              </a>
              <a className="btn-ghost" href="#resume-pdf">
                <FiFileText /> View PDF version
              </a>
            </div>
          </header>
        </Reveal>

        {/* Stats */}
        <Reveal>
          <div className="resume-stats">
            {stats.map((stat) => (
              <div className="resume-stat" key={stat.label}>
                <div className="resume-stat-value">{stat.value}</div>
                <div className="resume-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Career timeline */}
        <h2 className="resume-section-title">
          Career <span className="accent">&amp; experience</span>
        </h2>
        <div className="timeline">
          {career.map((entry, index) => (
            <Reveal
              key={`${entry.company}-${entry.period}`}
              delay={index * 0.05}
            >
              <div className="timeline-item">
                <div className="timeline-period">
                  {entry.period}
                  {entry.isCurrent && <span className="now-badge">NOW</span>}
                </div>
                <div className="timeline-card">
                  <h3 className="timeline-role">{entry.role}</h3>
                  <div>
                    <span className="timeline-company">{entry.company}</span>{" "}
                    <span className="timeline-location">
                      · {entry.location}
                    </span>
                  </div>
                  <p className="timeline-summary">{entry.summary}</p>
                  <ul className="timeline-highlights">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="timeline-tech">
                    {entry.tech.map((tech) => (
                      <span className="tech-chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Education */}
        <h2 className="resume-section-title">
          Education<span className="accent">.</span>
        </h2>
        <Reveal>
          <div className="education-card">
            <div>
              <p className="education-degree">Bachelor's in Computer Science</p>
              <p className="education-meta mb-0">
                GCU Lahore, Pakistan · 2017 — 2021
              </p>
            </div>
            <div className="education-gpa">3.5 / 4.0</div>
          </div>
        </Reveal>

        {/* Toolbox */}
        <h2 className="resume-section-title">
          The <span className="accent">toolbox</span>
        </h2>
        <div className="toolbox-grid">
          {toolbox.map((group, index) => (
            <Reveal key={group.title} delay={(index % 3) * 0.07}>
              <div className="toolbox-card">
                <div className="toolbox-title">
                  {group.icon} {group.title}
                </div>
                <div className="toolbox-chips">
                  {group.items.map((item) => (
                    <span className="tech-chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* PDF version */}
        <h2 className="resume-section-title" id="resume-pdf">
          Prefer <span className="accent">paper?</span>
        </h2>
        <p className="resume-pdf-note">
          The classic single-page PDF — same content, printer-friendly.
        </p>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: width < 400 ? "500px" : "660px",
              }}
            >
              <span
                className="route-spinner"
                role="status"
                aria-label="Loading"
              />
            </div>
          }
        >
          <PdfViewer fileUrl={pdf} height={width < 400 ? "500px" : "660px"} />
        </Suspense>
      </Container>
    </Container>
  );
}

export default ResumeNew;
