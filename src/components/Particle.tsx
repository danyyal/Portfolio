import Particles from "react-tsparticles";
import { useTheme } from "../context/ThemeContext";

const isSmallScreen =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

const Particle = () => {
  const { theme } = useTheme();

  const particleColor = theme === "dark" ? "#9bd8ff" : "#6366f1";
  const lineColor =
    theme === "dark"
      ? "rgba(125, 211, 252, 0.12)"
      : "rgba(99, 102, 241, 0.14)";

  return (
    <Particles
      key={theme}
      id="tsparticles"
      params={{
        particles: {
          wobble: {
            enable: true,
          },
          number: {
            value: isSmallScreen ? 110 : 300,
            density: {
              enable: true,
              value_area: 2500,
            },
          },
          color: {
            value: particleColor,
          },
          line_linked: {
            enable: true,
            opacity: 30,
            color: lineColor,
          },
          move: {
            direction: "right",
            speed: 0.3,
          },
          size: {
            value: 1,
          },
          opacity: {
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.05,
            },
          },
          shape: {
            type: "circle",
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: "grab",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            grab: {
              distance: 170,
              line_linked: {
                opacity: 0.45,
              },
            },
            push: {
              particles_nb: 1,
            },
          },
        },
        retina_detect: true,
      }}
    />
  );
};

export default Particle;
