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
} from "react-icons/hi";
import { useWindowSize } from "../../utils/customHooks/useWindowSize";
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
  { value: "3.5", label: "GPA — BSc CS" },
];

type TimelineEntry = {
  period: string;
  isCurrent?: boolean;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

const career: TimelineEntry[] = [
  {
    period: "10/2023 — Present",
    isCurrent: true,
    role: "Senior Software Engineer",
    company: "CERPRO",
    location: "Remote — Germany",
    summary:
      "AI-based quotation software for contract manufacturers, from 3D drawing previews to serverless pipelines.",
    highlights: [
      "Shipped GLTF 3D previews with Three.js, boosting engagement with technical drawings",
      "Built and deployed AWS Lambda functions powering serverless document pipelines",
      "Expanded into Python for backend and automation work",
    ],
    tech: ["React", "Three.js", "AWS Lambda", "Python", "PostgreSQL", "NestJS"],
  },
  {
    period: "04/2025 — 04/2026",
    role: "Senior Software Engineer",
    company: "Confiz (× Lebara)",
    location: "Lahore, Pakistan",
    summary:
      "Drove digital innovation for Lebara, a global telco serving millions of users across Europe.",
    highlights: [
      "Migrated the React front end to Next.js, cutting page load times",
      "Raised performance and scalability through code optimization and best practices",
      "Guarded code quality through structured code reviews",
    ],
    tech: ["Next.js", "React", "TypeScript", "AEM", "GraphQL", "Storybook"],
  },
  {
    period: "12/2023 — 04/2025",
    role: "Senior Software Engineer",
    company: "i2c Inc.",
    location: "Lahore, Pakistan",
    summary:
      "Fintech platform work on card-management products used by global banking clients.",
    highlights: [
      "Pioneered integration of advanced tooling, speeding up project delivery",
      "Mentored junior developers through rigorous code reviews",
      "Restructured legacy code for cleaner, faster applications",
    ],
    tech: ["React", "TypeScript", "Redux", "REST APIs", "MySQL"],
  },
  {
    period: "04/2020 — 12/2023",
    role: "Software Engineer",
    company: "Techverx",
    location: "Lahore, Pakistan",
    summary:
      "Full-stack delivery across client products — compliance platforms, lead-gen portals, space-industry fintech, and drone control apps.",
    highlights: [
      "Delivered RiskComply, Liftoff Leads, Spaced Ventures, a drone app, and TTS end-to-end",
      "Optimized application performance, materially reducing load times",
      "Built lasting client relationships through communication and reliability",
    ],
    tech: ["React", "Node.js", "MongoDB", "Socket.IO", "Stripe", "Firebase"],
  },
];

const toolbox = [
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
    items: ["AWS", "Docker", "Vercel", "CI/CD", "Git", "Jira"],
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
              Senior Software Engineer — full-stack development from
              pixel-perfect frontends to serverless backends.
            </p>

            <div className="resume-contact-row">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  className="contact-chip"
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
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
            <Reveal key={`${entry.company}-${entry.period}`} delay={index * 0.05}>
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
              <p className="education-degree">
                Bachelor's in Computer Science
              </p>
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
