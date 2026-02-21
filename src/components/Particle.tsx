import Particles from "react-tsparticles";
import { useTheme } from "../context/ThemeContext";

const Particle = () => {
  const { theme } = useTheme();

  const particleColor = theme === "dark" ? "#ffffff" : "#9d4edd";
  const lineColor =
    theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(160, 100, 200, 0.15)";

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
            value: 300,
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
            speed: 0.05,
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
            onclick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
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
