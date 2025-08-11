import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 className="home-about-description-header">
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I fell in love with turning ideas into code—and might have built too many things out of sheer curiosity. 😅
              <br />
              <br />
              I thrive in the wild world of{" "}
              <i>
                <b className="purple">React.js, Next.js, and Angular.js</b>
              </i>
              and I’ve wrangled my share of back-end beasts like{" "}
              <i>
                <b className="purple">Node.js, Nest.js, Python, and Three.js</b> for immersive 3D experiences
              </i>
              .
              <br />
              <br />
              On the frontend, I treat every pixel and interaction with surgical care—because that’s where users form their first impressions. It’s not just code; it’s the craft of experience, and I take that seriously.
              <br />
              <br />

              My playground includes{" "}
              <i>
                <b className="purple">
                  databases (PostgreSQL, MongoDB, Firebase)
                </b>
              </i>
              ,{" "}
              <i>
                <b className="purple">payments (Stripe, PayPal)</b>
              </i>
              , and the occasional{" "}
              <i>
                <b className="purple">Blockchain</b>
              </i>{" "}
              experiment.
              <br />
              <br />
              When I’m not architecting full-stack apps, I obsess over{" "}
              <i>
                <b className="purple">canvas magic (Fabric.js)</b>
              </i>{" "}
              and{" "}
              <i>
                <b className="purple">3D web experiences</b>
              </i>
              —because why should reality have all the fun?
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/danyyal"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/danyyal_ali_yar"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
