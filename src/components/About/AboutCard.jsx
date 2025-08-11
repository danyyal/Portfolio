import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Danyyal Ali </span>
            from <span className="purple"> Lahore, Pakistan.</span>
            <br />
            I am currently employed as a Senior Software Engineer at Confiz.
            <br />
            I have completed Integrated BSCS in Computer Science from Government College University.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Badminton
            </li>
            <li className="about-activity">
              <ImPointRight /> Reading Books
            </li>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "I don’t just write code—I craft experiences."{" "}
          </p>
          <footer className="blockquote-footer">Danyyal</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
