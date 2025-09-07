import { motion } from "framer-motion";
import { Container, Row, Col, Nav } from "react-bootstrap";
import {
  AiFillGithub,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import { otherRoutes } from "../App";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <Container fluid className="footer bg-dark text-light py-5">
      {/* Top Row: Buttons */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="d-flex flex-wrap gap-3 justify-content-center"
          >
            {otherRoutes.map((btn, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Nav.Link
                  as={Link}
                  to={btn.link}
                  className="px-3 py-2 rounded-pill border border-secondary text-light hover-gradient transition"
                >
                  {btn.text}
                </Nav.Link>
              </motion.div>
            ))}
          </motion.div>
        </Col>
      </Row>

      {/* Bottom Row: Trademark + Socials */}
      <Row className="align-items-center">
        {/* Left Side */}
        <Col md="4" className="text-center mb-3 mb-md-0">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fw-bold"
          >
            Developed by <span className="text-info">Danyyal Ali Yar</span>
          </motion.h3>
        </Col>

        {/* Center: Copyright */}
        <Col md="4" className="text-center mb-3 mb-md-0">
          <p className="mb-0">© {year}. All rights reserved.</p>
        </Col>

        {/* Right Side: Social Links */}
        <Col md="4" className="text-center">
          <motion.ul
            className="list-unstyled d-flex justify-content-center gap-4 fs-3 m-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.li whileHover={{ scale: 1.2 }}>
              <a
                href="https://github.com/danyyal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light hover-gradient"
              >
                <AiFillGithub />
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.2 }}>
              <a
                href="https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light hover-gradient"
              >
                <FaLinkedinIn />
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.2 }}>
              <a
                href="https://www.instagram.com/danyyal_ali_yar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light hover-gradient"
              >
                <AiFillInstagram />
              </a>
            </motion.li>
          </motion.ul>
        </Col>
      </Row>

      {/* Small CSS tweaks */}
      <style>{`
        .hover-gradient:hover {
          background: linear-gradient(90deg, #f093fb, #f5576c);
          color: white !important;
          border-color: transparent !important;
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </Container>
  );
}

export default Footer;
