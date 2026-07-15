import { Container } from "react-bootstrap";
import Particle from "../Particle";
import testimonial from "../../Assets/client-testimonial.mp4";

function Testimonials() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container className="d-flex justify-content-center align-items-center flex-column py-5">
        <h2
          className="text-center mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Sascha Mueller
        </h2>
        <p
          className="text-center mb-4"
          style={{ color: "var(--text-secondary)", fontSize: "1.25rem" }}
        >
          CTO and Co-Founder of{" "}
          <a
            style={{ color: "var(--text-purple)" }}
            href="https://cerpro.io/en/"
            target="_blank"
            rel="noreferrer"
          >
            CERPRO
          </a>
        </p>
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <video
            src={testimonial}
            title="Video Testimonial"
            controls
            playsInline
            preload="metadata"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </div>
      </Container>
    </Container>
  );
}

export default Testimonials;
