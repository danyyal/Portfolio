import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import './Home.css'
const Home = ()=> {
  return (
    <>
      <Container fluid className="home-section" id="home">
  <Particle />
  <Container className="home-content">
    <Row>
      <Col md={7} className="home-header">
      <h1 className="greeting">
  <span className="intro-text">Hi, I'm </span>
  <span className="name-highlight">Danyyal Ali 👨‍💻</span>
</h1>
<h2 className="sub-greeting">
  Turning ideas into code, <span className="highlight">one line at a time.</span>
</h2>
          <Type />

          <div className="quick-tags">
  <span className="tag">🚀 Passionate Developer</span>
  <span className="tag">💡 Problem Solver</span>
  <span className="tag">🛠️ MERN Stack Expert</span>
  <span className="tag">🎯 Pixel-Perfect UI</span>
</div>
      </Col>

      <Col md={5} className="image-col">
        <div className="image-wrapper">
          <img
            src={homeLogo}
            alt="home"
            className="img-fluid animated-image"
            style={{ maxHeight: "450px" }}
          />
        </div>
      </Col>
    </Row>
  </Container>
  <Home2 />
</Container>

    </>

  );
}

export default Home;
