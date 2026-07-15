import type { ReactNode } from "react";
import { Container } from "react-bootstrap";
import Reveal from "../Reveal";

// Languages
import { DiJavascript1, DiPython, DiJava } from "react-icons/di";
import { TbBrandGolang } from "react-icons/tb";
import { SiTypescript } from "react-icons/si";

// Frameworks
import { DiReact, DiNodejs } from "react-icons/di";
import {
  SiNextdotjs,
  SiNestjs,
  SiExpress,
  SiDotnet,
  SiAngular,
} from "react-icons/si";

// Libraries / UI / Styling
import { DiBootstrap, DiCss3, DiHtml5 } from "react-icons/di";
import {
  SiTailwindcss,
  SiGraphql,
  SiStorybook,
  SiJest,
  SiGooglemaps,
  SiMapbox,
  SiPlaycanvas,
  SiSocketdotio,
  SiReactquery,
} from "react-icons/si";

// Databases
import { DiMongodb } from "react-icons/di";
import {
  SiPostgresql,
  SiRedis,
  SiSupabase,
  SiFirebase,
  SiMysql,
} from "react-icons/si";

// DevOps / Tools
import { DiGit, DiNpm, DiVisualstudio } from "react-icons/di";
import {
  SiDocker,
  SiPostman,
  SiSlack,
  SiTeamviewer,
  SiFigma,
  SiVite,
  SiWebpack,
  SiVercel,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiJira,
  SiConfluence,
  SiTrello,
  SiClockify,
} from "react-icons/si";

// Payments
import { SiStripe, SiPaypal, SiAdyen } from "react-icons/si";

// CMS & Headless
import { SiAdobe, SiApache } from "react-icons/si";
import { VscCode } from "react-icons/vsc";

type Tech = { icon: ReactNode; name: string };

const stack: { title: string; items: Tech[] }[] = [
  {
    title: "Languages",
    items: [
      { icon: <DiJavascript1 />, name: "JavaScript" },
      { icon: <SiTypescript />, name: "TypeScript" },
      { icon: <DiPython />, name: "Python" },
      { icon: <DiJava />, name: "Java" },
      { icon: <TbBrandGolang />, name: "Go" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { icon: <DiReact />, name: "React" },
      { icon: <DiNodejs />, name: "Node.js" },
      { icon: <SiNextdotjs />, name: "Next.js" },
      { icon: <SiNestjs />, name: "NestJS" },
      { icon: <SiExpress />, name: "Express" },
      { icon: <SiDotnet />, name: ".NET" },
      { icon: <SiAngular />, name: "Angular" },
    ],
  },
  {
    title: "Libraries & UI",
    items: [
      { icon: <DiHtml5 />, name: "HTML5" },
      { icon: <DiCss3 />, name: "CSS3" },
      { icon: <DiBootstrap />, name: "Bootstrap" },
      { icon: <SiTailwindcss />, name: "TailwindCSS" },
      { icon: <SiGraphql />, name: "GraphQL" },
      { icon: <SiSocketdotio />, name: "Socket.IO" },
      { icon: <SiReactquery />, name: "TanStack Query" },
      { icon: <SiStorybook />, name: "Storybook" },
      { icon: <SiJest />, name: "Jest" },
      { icon: <SiGooglemaps />, name: "Google Maps" },
      { icon: <SiMapbox />, name: "Mapbox" },
      { icon: <SiPlaycanvas />, name: "PlayCanvas" },
    ],
  },
  {
    title: "Databases",
    items: [
      { icon: <DiMongodb />, name: "MongoDB" },
      { icon: <SiPostgresql />, name: "PostgreSQL" },
      { icon: <SiRedis />, name: "Redis" },
      { icon: <SiSupabase />, name: "Supabase" },
      { icon: <SiFirebase />, name: "Firebase" },
      { icon: <SiMysql />, name: "MySQL" },
    ],
  },
  {
    title: "DevOps & Tools",
    items: [
      { icon: <DiGit />, name: "Git" },
      { icon: <DiNpm />, name: "NPM" },
      { icon: <SiDocker />, name: "Docker" },
      { icon: <SiPostman />, name: "Postman" },
      { icon: <SiFigma />, name: "Figma" },
      { icon: <SiSlack />, name: "Slack" },
      { icon: <SiTeamviewer />, name: "TeamViewer" },
      { icon: <DiVisualstudio />, name: "Visual Studio" },
      { icon: <SiVite />, name: "Vite" },
      { icon: <SiWebpack />, name: "Webpack" },
      { icon: <SiVercel />, name: "Vercel" },
      { icon: <SiGithub />, name: "GitHub" },
      { icon: <SiGitlab />, name: "GitLab" },
      { icon: <SiBitbucket />, name: "Bitbucket" },
      { icon: <SiJira />, name: "Jira" },
      { icon: <SiConfluence />, name: "Confluence" },
      { icon: <SiTrello />, name: "Trello" },
      { icon: <SiClockify />, name: "Clockify" },
    ],
  },
  {
    title: "Payment Integrations",
    items: [
      { icon: <SiStripe />, name: "Stripe" },
      { icon: <SiPaypal />, name: "PayPal" },
      { icon: <SiAdyen />, name: "Adyen" },
    ],
  },
  {
    title: "CMS & Headless",
    items: [
      { icon: <SiAdobe />, name: "Adobe AEM" },
      { icon: <SiApache />, name: "Apache Sling" },
      { icon: <VscCode />, name: "HTL/Sightly" },
      { icon: <SiGraphql />, name: "AEM GraphQL" },
    ],
  },
];

function Techstack() {
  return (
    <Container fluid className="techstack-section">
      {stack.map((group) => (
        <Reveal key={group.title}>
          <section>
            <h3 className="tech-section-title">
              <strong className="purple purple-tech">{group.title}</strong>
            </h3>
            <div className="tech-grid">
              {group.items.map((tech) => (
                <div className="tech-tile" key={tech.name} title={tech.name}>
                  <div className="tech-tile-icon">{tech.icon}</div>
                  <div className="tech-tile-name">{tech.name}</div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </Container>
  );
}

export default Techstack;
