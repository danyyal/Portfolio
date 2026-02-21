import { Container, Row } from "react-bootstrap";
import Particle from "../Particle.js";
import pdf from "../../Assets/Resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { useWindowSize } from "../../utils/customHooks/useWindowSize";
import { Button } from "@mui/material";
import PdfViewer from "../PdfViewer";

function ResumeNew() {
  const { width } = useWindowSize();
  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row
          style={{
            justifyContent: "center",
            padding: "0px 0px 20px 0px",
            position: "relative",
          }}
        >
          <Button
            variant="outlined"
            style={{
              maxWidth: "250px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
              href={pdf}
              download={"Danyyal Ali Mern.pdf"}
            >
              <AiOutlineDownload />
              &nbsp;Download CV
            </a>
          </Button>
        </Row>

        <PdfViewer fileUrl={pdf} height={width < 400 ? "500px" : "660px"} />
      </Container>
    </div>
  );
}

export default ResumeNew;
