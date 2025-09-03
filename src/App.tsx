import React, { useState, useEffect } from "react";
import Preloader from "./components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Demos from "./components/Demos/Demos";
import UnderDevelopmentPage from "./components/UnderDevelopmentPage/UnderDevelopmentPage";
import Particle from "./components/Particle";

const App = () => {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App" id={load ? "no-scroll" : "scroll"}>

      <Preloader load={load} />
        <Navbar />
        <Particle/>
        <ScrollToTop />
      <div style={{ marginTop: '75px', height: 'calc(100dvh - 75px)', overflowY:'scroll' }}>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/project" element={<Projects />} />
          <Route path="/demo" element={<UnderDevelopmentPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/testimonial" element={<Testimonials />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      </div>
  );
}

export default App;
