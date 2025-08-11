import React from "react";
import { Col, Row, Container } from "react-bootstrap";

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
  SiAmazonaws,
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
import { useWindowSize } from "../../utils/customHooks/useWindowSize.ts";

// Payments
import { SiStripe, SiPaypal, SiAdyen } from "react-icons/si";

const Section = ({ title, items, width }) => (
  <>
    <h3
      className="project-heading"
      style={{ marginTop: "40px", marginBottom: "20px" }}
    >
      <strong className="purple">{title}</strong>
    </h3>
    <Row style={width<768? { justifyContent: "space-between", marginLeft: "10px", marginRight: "10px" }: { justifyContent: "center" }}>
      {items.map((tech, idx) => (
        <Col
          xs={5}
          md={2}
          key={idx}
          className="tech-icons text-center"
          title={tech.name}
        >
          <div style={{ fontSize: "60px" }}>{tech.icon}</div>
          <div style={{ fontSize: "16px", marginTop: "12px", color: "#ddd" }}>
            {tech.name}
          </div>
        </Col>
      ))}
    </Row>
  </>
);

function Techstack() {
  const {width}= useWindowSize()
  return (
    <Container fluid className="techstack-section">
      <Section
      width={width}
        title="Languages"
        items={[
          { icon: <DiJavascript1 />, name: "JavaScript" },
          { icon: <SiTypescript />, name: "TypeScript" },
          { icon: <DiPython />, name: "Python" },
          { icon: <DiJava />, name: "Java" },
          { icon: <TbBrandGolang />, name: "Go" },
        ]}
      />

      <Section
      width={width}
        title="Frameworks"
        items={[
          { icon: <DiReact />, name: "React" },
          { icon: <DiNodejs />, name: "Node.js" },
          { icon: <SiNextdotjs />, name: "Next.js" },
          { icon: <SiNestjs />, name: "NestJS" },
          { icon: <SiExpress />, name: "Express" },
          { icon: <SiDotnet />, name: ".NET" },
          { icon: <SiAngular />, name: "Angular" },
        ]}
      />

      <Section
      width={width}
        title="Libraries & UI"
        items={[
          { icon: <DiHtml5 />, name: "HTML5" },
          { icon: <DiCss3 />, name: "CSS3" },
          { icon: <DiBootstrap />, name: "Bootstrap" },
          { icon: <SiTailwindcss />, name: "TailwindCSS" },
          { icon: <SiGraphql />, name: "GraphQL" },
          { icon: <SiStorybook />, name: "Storybook" },
          { icon: <SiJest />, name: "Jest" },
          { icon: <SiGooglemaps />, name: "Google Maps" },
          { icon: <SiMapbox />, name: "Mapbox" },
          { icon: <SiPlaycanvas />, name: "PlayCanvas" },
        ]}
      />

      <Section
      width={width}
        title="Databases"
        items={[
          { icon: <DiMongodb />, name: "MongoDB" },
          { icon: <SiPostgresql />, name: "PostgreSQL" },
          { icon: <SiRedis />, name: "Redis" },
          { icon: <SiSupabase />, name: "Supabase" },
          { icon: <SiFirebase />, name: "Firebase" },
          { icon: <SiMysql />, name: "MySQL" },
        ]}
      />

      <Section
      width={width}
        title="DevOps & Tools"
        items={[
          { icon: <DiGit />, name: "Git" },
          { icon: <DiNpm />, name: "NPM" },
          { icon: <SiDocker />, name: "Docker" },
          { icon: <SiAmazonaws />, name: "AWS" },
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
        ]}
      />

      <Section
      width={width}
        title="Payment Integrations"
        items={[
          { icon: <SiStripe />, name: "Stripe" },
          { icon: <SiPaypal />, name: "PayPal" },
          { icon: <SiAdyen />, name: "Adyen" },
        ]}
      />
    </Container>
  );
}

export default Techstack;
