import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle.js";
import pdf from "../../Assets/Resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { useWindowSize } from "../../utils/customHooks/useWindowSize";
import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react'

function ResumeNew() {
  const {width} = useWindowSize();
  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row style={{ justifyContent: "center", padding:'0px 0px 20px 0px', position: "relative" }}>
          <Button variant="primary" style={{ maxWidth: "250px", display:'flex', justifyContent:'center' }}>
            <a
              style={{ color: "white", textDecoration: "none",display:'flex', alignItems:'center', gap:'12px' }}
              href={pdf}
              download={"Danyyal Ali Mern.pdf"}
            >
              <AiOutlineDownload />
              &nbsp;Download CV
            </a>
          </Button>
        </Row>

          <RPConfig licenseKey={"eyJkYXRhIjoiZXlKMElqb2labkpsWlMxMGNtbGhiQ0lzSW1GMmRTSTZNVGMxTnprNE1EYzVPU3dpWkcwaU9pSmtZVzU1ZVdGc0xXUmxkaTUyWlhKalpXd3VZWEJ3THlJc0ltNGlPaUk1WldSbE1UVXpabVF5WWpka1pHRTVJaXdpWlhod0lqb3hOelUzT1Rnd056azVMQ0prYlhRaU9pSnpjR1ZqYVdacFl5SjkiLCJzaWduYXR1cmUiOiJiN0FwS2JOTzhHU2w1MWZhVlVjT0VKVWpXTEZpUDFEdC9aK2ZRS3dCR05kQittTHk0QjVtanRmMVgzUXY2RUNBaE94ZStwODNNcnROSHdwOFdxOFlOcFBhSWdxWHp1YVVvWlFuc3ZRY2JLSnVGK1BzV3J1ZjdvM25wY1ZXY3RHYlJjTVNubUtmSEdZenRhMHlXeVdRNkxHWTl1ZEZLaEN5RjhvNE5YR1VkMHZBMXg0R3BMTXR2UXNCTlFSU0dzbHViQXNienRaRGtnd2VoUU9XVEhzbmQvbzZyOHMvMzUreXhaaWVISGFaQkJiZ3NqNEZQTnFWa2l2S01oZkJhYUIxcXluUVQvcUdHUTA0WDBoUzVVUU9CYjlKckM5SlRZSW5rNGY2cWNKSUo2YmlLOCtLY2VtNUZlTWFFUXhmMEFOa01VM0x4RnNIN3U5VzlUNkFxekRDekE9PSJ9"}>
            <RPProvider src={pdf}>
              <RPDefaultLayout style={{ height: width<400?'500px': '660px' }}>
                <RPPages />
              </RPDefaultLayout>
            </RPProvider>
          </RPConfig>
      </Container>
    </div>
  );
}

export default ResumeNew;
