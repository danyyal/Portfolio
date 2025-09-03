import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import cerpro from "../../Assets/Projects/cerpro.png";
import lebara from "../../Assets/Projects/lebara.png";
import yjsg from "../../Assets/Projects/yjsg.png";
import spacedventures from "../../Assets/Projects/spacedventures.png";
import riskcomply from "../../Assets/Projects/riskcomply.png";
import liftoffleads from "../../Assets/Projects/liftoffleads.png";
import fridaypos from "../../Assets/Projects/fridaypos.png";
import tambr from "../../Assets/Projects/tambr.png";
import portalio from "../../Assets/Projects/portalio.png";
import './Projects.css'
const additionalProjects=[
  'TTS', 'Drone App', 'Divebell'
]
function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
      <div className="section-header">
  <h1 className="project-heading">
    <span className="section-title">My Recent</span> <strong className="purple-glow">Works</strong>
  </h1>
  <p className="section-subtitle">
    Here are a few projects I've worked on recently — from creative frontends to robust backends.
  </p>
</div>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={lebara}
              isBlog={false}
              title="Lebara"
              demoLink={"https://www.lebara.co.uk/en/home.html"}
              description="Lebara is a mobile virtual network operator (MVNO) that provides affordable prepaid mobile services across multiple European countries, originally targeting immigrant communities with competitive international calling rates. The company operates as a budget-friendly alternative to major carriers, offering simple no-contract plans with a focus on international connectivity."
              ghLink="https://github.com/Lebara-Ltd/storybook"
              isPrivate={true}
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={cerpro}
              isBlog={false}
              title="CERPRO"
              demoLink={"https://platform.cerpro.io"}
              description="CERPRO is a German AI-powered SaaS platform that automatically extracts features and specifications from technical drawings to generate quality inspection reports for manufacturing companies. The solution targets SME manufacturers in the metalworking industry, helping them save up to 70% of time on manual quality documentation processes while reducing human errors."
              ghLink="https://github.com/saschamuellercerpro/cerpro"
              isPrivate={true}
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={yjsg}
              isBlog={false}
              title="YJSG"
              demoLink={"https://jobsearchgenius.ai/"}
              description="Job Search Genius is an AI-powered career platform that provides comprehensive tools for job seekers to create tailored resumes, craft compelling cover letters, prepare for interviews, and negotiate competitive salary packages. The platform analyzes specific jobs offers a complete system designed to streamline the job search process while helping users stand out in competitive markets."
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={spacedventures}
              isBlog={false}
              title="Spaced Ventures"
              demoLink={"https://www.33fg.com/"}
              description="Spaced ventures now known as Mach33 is a specialized financial services firm focused exclusively on the space industry, offering investment research, capital markets solutions, and asset management services tailored to accelerate space commercialization. The company positions itself as an alternative asset manager with deep expertise in identifying and capitalizing on opportunities within the rapidly growing space industrialization sector"
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={riskcomply}
              isBlog={false}
              title="Risk Comply"
              demoLink={"https://riskcomply.online"}
              description="RiskComply is a vendor-to-client compliance management platform that streamlines regulatory processes through modules for client management, project tracking, vendor oversight, and compliance reporting. The system centralizes communication, file management, and requirement tracking to help businesses manage their compliance obligations and vendor relationships efficiently."
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={liftoffleads}
              isBlog={false}
              demoLink={"https://portal.liftoffleads.com/"}
              title="Liftoff Leads"
              description="LiftoffLeads is a lead generation service specifically designed for photography studios, where studio owners can register through their client portal to access lead generation campaigns. The platform connects photography businesses with potential customers by converting qualified leads into business clients to help studios grow their client base."
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={fridaypos}
              isBlog={false}
              title="Friday POS"
              demoLink={"https://www.fridaypos.com/"}
              description="Friday POS is a cloud-based restaurant management system designed for multi-location businesses, offering integrated POS functionality with real-time inventory management, GPS delivery tracking, self-service kiosks, and centralized operations. The platform includes kitchen displays, automated ordering, mobile reporting apps, and QuickBooks/Xero integration, positioning itself as a complete business ecosystem for scalable restaurant chain growth."
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={tambr}
              isBlog={false}
              title="Tambr"
              demoLink={"https://www.tambr.app/"}
              description="Tambr is a business management platform specifically designed for companies that serve performing artists. It's an online booking system that provides businesses with many tools, including easy booking, customer management, integrated payment processing, and detailed analytics and reporting. The platform is focused on helping businesses streamline their operations and grow their client base while maintaining strong customer relationships."
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={portalio}
              isBlog={false}
              title="Portal.io"
              demoLink={"https://portal.io/"}
              description="Portal.io is a powerful, industry-specific SaaS tool that empowers AV, IT, and security integrators to create proposals faster, manage complex product data easily, and drive seamless client approvals and payments—all backed by live integrations and strong customer support."
              ghLink="Private repo"
              isPrivate={true}
            />
          </Col>

          <Row style={{ justifyContent: "center", paddingTop: "30px" }}>
          <Col md={12}>
            <h3 className="project-heading" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
              Other <strong className="purple">Projects</strong>
            </h3>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "15px", 
              justifyContent: "center" 
            }}>
              {additionalProjects.map((project, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    color: "white",
                    fontSize: "0.95rem",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    (e.target as any).style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                    (e.target as any).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as any).style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    (e.target as any).style.transform = "translateY(0px)";
                  }}
                >
                  {project}
                </div>
              ))}
            </div>
          </Col>
        </Row>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
