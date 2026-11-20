import { useCallback, useRef, useState } from "react";
import { career } from "../data/profile";

type Side = "left" | "right";

type Figure = {
  name: string;
  /** star positions as fractions of the stage */
  stars: [number, number][];
  lines: [number, number][];
  /** which stars carry the role's highlights, and which way the label runs */
  anchors: { star: number; side: Side }[];
};

/* Rough asterism shapes, drawn by hand and spaced so labels have room. */
const figures: Figure[] = [
  {
    name: "Orion",
    stars: [
      [0.36, 0.14],
      [0.62, 0.18],
      [0.55, 0.47],
      [0.5, 0.5],
      [0.45, 0.53],
      [0.38, 0.86],
      [0.66, 0.8],
    ],
    lines: [
      [0, 1],
      [0, 4],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 6],
      [5, 6],
    ],
    anchors: [
      { star: 0, side: "left" },
      { star: 1, side: "right" },
      { star: 2, side: "right" },
      { star: 5, side: "left" },
      { star: 6, side: "right" },
    ],
  },
  {
    name: "Cassiopeia",
    stars: [
      [0.3, 0.2],
      [0.4, 0.52],
      [0.5, 0.36],
      [0.6, 0.66],
      [0.7, 0.34],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    anchors: [
      { star: 0, side: "left" },
      { star: 4, side: "right" },
      { star: 3, side: "right" },
    ],
  },
  {
    name: "Cygnus",
    stars: [
      [0.5, 0.1],
      [0.5, 0.4],
      [0.5, 0.9],
      [0.34, 0.52],
      [0.66, 0.3],
      [0.5, 0.66],
    ],
    lines: [
      [0, 1],
      [1, 5],
      [5, 2],
      [1, 3],
      [1, 4],
    ],
    anchors: [
      { star: 4, side: "right" },
      { star: 3, side: "left" },
      { star: 2, side: "right" },
    ],
  },
  {
    name: "Lyra",
    stars: [
      [0.42, 0.14],
      [0.48, 0.4],
      [0.6, 0.44],
      [0.58, 0.82],
      [0.45, 0.78],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
    ],
    anchors: [
      { star: 0, side: "left" },
      { star: 2, side: "right" },
      { star: 4, side: "left" },
    ],
  },
];

function Constellations() {
  const [index, setIndex] = useState(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const total = career.length;
  const entry = career[index];
  const figure = figures[index % figures.length];

  const step = useCallback(
    (delta: number) => setIndex((prev) => (prev + delta + total) % total),
    [total],
  );

  return (
    <div className="m-const">
      <div
        className="m-const-stage"
        tabIndex={0}
        role="group"
        aria-label={`${entry.role} at ${entry.company}. Use left and right arrow keys to change role.`}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
        }}
        onPointerDown={(event) => {
          dragStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = dragStart.current;
          dragStart.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          // ignore mostly-vertical drags so the page can still be scrolled
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            step(dx < 0 ? 1 : -1);
          }
        }}
      >
        <div className="m-const-figure" key={figure.name + index}>
          <svg className="m-const-lines" aria-hidden="true">
            {figure.lines.map(([from, to]) => (
              <line
                key={`${from}-${to}`}
                x1={`${figure.stars[from][0] * 100}%`}
                y1={`${figure.stars[from][1] * 100}%`}
                x2={`${figure.stars[to][0] * 100}%`}
                y2={`${figure.stars[to][1] * 100}%`}
              />
            ))}
          </svg>
          {figure.stars.map(([x, y], starIndex) => {
            const anchorIndex = figure.anchors.findIndex(
              (anchor) => anchor.star === starIndex,
            );
            const anchor = figure.anchors[anchorIndex];
            const highlight = anchor
              ? entry.highlights[anchorIndex]
              : undefined;
            return (
              <div
                key={starIndex}
                className={`m-star ${highlight ? "is-major" : ""}`}
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  animationDelay: `${starIndex * 70}ms`,
                }}
              >
                <i />
                {highlight && (
                  <p className={`m-star-label is-${anchor.side}`}>
                    <span className="m-star-no">
                      {String(anchorIndex + 1).padStart(2, "0")}
                    </span>
                    {highlight}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="m-const-head">
        <button
          type="button"
          className="m-arrow"
          data-lock
          aria-label="Previous role"
          onClick={() => step(-1)}
        >
          &#8592;
        </button>
        <div className="m-const-title" aria-live="polite">
          <p className="m-const-sub">
            {figure.name} · {index + 1} of {total}
          </p>
          <p className="m-const-name">{entry.company}</p>
          <p className="m-const-role">
            {entry.role} · {entry.period}
            {entry.isCurrent && <span className="m-now">Now</span>}
          </p>
        </div>
        <button
          type="button"
          className="m-arrow"
          data-lock
          aria-label="Next role"
          onClick={() => step(1)}
        >
          &#8594;
        </button>
      </div>

      <p className="m-const-summary">{entry.summary}</p>
      <ol className="m-const-list">
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ol>
      <div className="m-chips">
        {entry.tech.map((tech) => (
          <span key={tech} className="m-chip">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Constellations;
