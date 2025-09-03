import Particles from "react-tsparticles";

const Particle= ()=> {
  return (
    <Particles
      id="tsparticles"
      params={{
        particles: {
          wobble:{
            enable:true
          },
          number: {
            value: 300,
            density: {
              enable: true,
              value_area: 2500,
            },
          },
          line_linked: {
            enable: true,
            opacity: 30,
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
}

export default Particle;
