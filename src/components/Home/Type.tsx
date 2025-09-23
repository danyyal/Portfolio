import Typewriter from "typewriter-effect";
import "./Type.css";
function Type() {
  return (
    <div className="typewriter-container">
      <Typewriter
        options={{
          strings: [
            "💻 Software Developer",
            "🌐 MERN Stack Developer",
            "🧑‍💻 Freelancer",
            "🚀 Open Source Contributor",
            "⚙️ Full-Stack Problem Solver",
          ],
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
          delay: 75,
        }}
      />
    </div>
  );
}

export default Type;
