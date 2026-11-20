import Tilt from "react-parallax-tilt";

/* A syntax-highlighted "editor window" — the developer's self-portrait. */
function CodeCard() {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      transitionSpeed={1800}
      scale={1.02}
    >
      <div className="code-card">
        <div className="code-card-bar">
          <span className="window-dot dot-red" />
          <span className="window-dot dot-yellow" />
          <span className="window-dot dot-green" />
          <span className="code-card-title">aboutMe.ts</span>
        </div>
        <pre className="code-card-body">
          <code>
            <span className="tok-kw">const</span>{" "}
            <span className="tok-var">danyyal</span>{" "}
            <span className="tok-op">=</span> {"{"}
            {"\n"}
            {"  "}role<span className="tok-op">:</span>{" "}
            <span className="tok-str">"Senior Full-Stack AI Engineer"</span>,
            {"\n"}
            {"  "}currentlyAt<span className="tok-op">:</span>{" "}
            <span className="tok-str">"Drevise"</span>,{"\n"}
            {"  "}stack<span className="tok-op">:</span> [
            <span className="tok-str">"React"</span>,{" "}
            <span className="tok-str">"Python"</span>,{" "}
            <span className="tok-str">"Three.js"</span>],{"\n"}
            {"  "}loves<span className="tok-op">:</span>{" "}
            <span className="tok-str">"models that ship"</span>,{"\n"}
            {"  "}coffee<span className="tok-op">:</span>{" "}
            <span className="tok-kw">Infinity</span>,{"\n"}
            {"  "}openToWork<span className="tok-op">:</span>{" "}
            <span className="tok-bool">true</span>,{"\n"}
            {"}"};{"\n"}
            {"\n"}
            <span className="tok-var">danyyal</span>.
            <span className="tok-fn">ship</span>(
            <span className="tok-str">"something great"</span>)
            <span className="code-caret" />
          </code>
        </pre>
      </div>
    </Tilt>
  );
}

export default CodeCard;
