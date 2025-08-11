import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/../Assets/Resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useWindowSize } from "../../utils/customHooks/useWindowSize.ts";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const {width} = useWindowSize();

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button variant="primary" style={{ maxWidth: "250px" }}>
            <a
              style={{ color: "white", textDecoration: "none" }}
              href={pdf}
              download={"Danyyal Ali Mern.pdf"}
            >
              <AiOutlineDownload />
              &nbsp;Download CV
            </a>
          </Button>
        </Row>

        <Row className="resume">
          <Document file={pdf} className="d-flex justify-content-center">
            <Page pageNumber={1} scale={width > 786 ? 1.7 : 0.6} />
          </Document>
        </Row>

        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button variant="primary" style={{ maxWidth: "250px" }}>
            <a
              style={{ color: "white", textDecoration: "none" }}
              href={pdf}
              download={"Danyyal Ali Mern.pdf"}
            >
              <AiOutlineDownload />
              &nbsp;Download CV
            </a>
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
