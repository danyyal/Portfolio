import { useState, useEffect, Suspense } from "react";
import Preloader from "./components/Pre";
import RouteFallback from "./components/RouteFallback";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Testimonials from "./components/Testimonials/Testimonials";
import Resume from "./components/Resume/ResumeNew";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import BackToTop from "./components/BackToTop";
import "./style.css";
import "./App.css";
import Particle from "./components/Particle";
import Footer from "./components/Footer";
import { otherRoutes } from "./routes";

const App = () => {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoad(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App" id={load ? "no-scroll" : "scroll"}>
      <Preloader load={load} />
      <Navbar />
      <Particle />
      <ScrollToTop />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/testimonial" element={<Testimonials />} />
          {otherRoutes.map(({ link, component: Component }) => (
            <Route
              key={link}
              path={link}
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </main>
      <BackToTop />
    </div>
  );
};

export default App;
