import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import testimonial from "../../Assets/client-testimonial.mp4";
import { useWindowSize } from "../../utils/customHooks/useWindowSize.ts";

function Testimonials() {
  const { width, height } = useWindowSize();
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container
        style={{
          height: `calc(100dvh - 180px)`,
        }}
        className="d-flex justify-content-center align-items-center flex-column py-5"
      >
        <h2 className="text-white text-center mb-2">Sascha Mueller</h2>
        <p
          className="text-muted text-center mb-4"
          style={{
            fontSize: "1.6rem",
          }}
        >
          CTO and Co-Founder of{" "}
          <a style={{ color: "white" }} href="https://cerpro.io/en/">
            CERPRO
          </a>
        </p>
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "16 / 9",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #ccc",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <iframe
            src={`${testimonial}?autoplay=0`}
            title="Video Testimonial"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          ></iframe>
        </div>
      </Container>
    </Container>
  );
}

export default Testimonials;
