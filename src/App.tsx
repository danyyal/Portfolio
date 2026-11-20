import { useState, useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Preloader from "./components/Pre";
import RouteFallback from "./components/RouteFallback";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import "./style.css";
import "./App.css";
import Particle from "./components/Particle";
import Footer from "./components/Footer";
import { otherRoutes } from "./routes";
import { useMode } from "./context/ModeContext";

// Only the landing page ships in the first bundle; the rest load on demand.
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Testimonials = lazy(
  () => import("./components/Testimonials/Testimonials"),
);
const Resume = lazy(() => import("./components/Resume/ResumeNew"));
const NotFound = lazy(() => import("./components/NotFound"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const MissionPage = lazy(() => import("./mission/MissionPage"));

const App = () => {
  const [load, setLoad] = useState(true);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { mode } = useMode();

  useEffect(() => {
    const timer = setTimeout(() => setLoad(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mission mode replaces the landing page, chrome included.
  if (mode === "mission" && location.pathname === "/") {
    return (
      <Suspense fallback={<div className="mission-boot" />}>
        <ScrollToTop />
        <MissionPage />
      </Suspense>
    );
  }

  return (
    <div className="App" id={load ? "no-scroll" : "scroll"}>
      <Preloader load={load} />
      <Navbar />
      <Particle />
      <ScrollToTop />
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
      <main className="app-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Suspense fallback={<RouteFallback />}>
              <Routes location={location}>
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
            </Suspense>
          </motion.div>
        </AnimatePresence>
        <Footer />
      </main>
      <BackToTop />
    </div>
  );
};

export default App;
