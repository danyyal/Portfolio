import { useEffect, useRef, useState } from "react";
import type { ModelChart } from "../../data/modelDetails";

const HEIGHT = 190;
const PAD = { top: 22, right: 18, bottom: 30, left: 44 };

function niceDomain(points: number[]): [number, number] {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const step = max - min > 0.3 ? 0.2 : 0.01;
  const low = Math.floor(min / step) * step;
  const high = Math.min(1, Math.ceil(max / step) * step);
  return [low, high === low ? low + step : high];
}

/* One series, so the title names it and there is no legend. */
function LineChart({ chart }: { chart: ModelChart }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => setWidth(Math.max(260, wrap.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const { points } = chart;
  const [low, high] = niceDomain(points);
  const innerWidth = width - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const x = (index: number) =>
    PAD.left + (index / Math.max(1, points.length - 1)) * innerWidth;
  const y = (value: number) =>
    PAD.top + (1 - (value - low) / (high - low)) * innerHeight;
  const path = points
    .map((value, index) => `${index ? "L" : "M"}${x(index)} ${y(value)}`)
    .join(" ");
  const ticks = [low, (low + high) / 2, high];
  const digits = high - low > 0.3 ? 1 : 3;
  const markIndex = chart.mark ? chart.mark.index - 1 : null;
  const xLabels = [1, Math.ceil(points.length / 2), points.length];

  return (
    <figure className="md-chart">
      <figcaption>{chart.title}</figcaption>
      <div
        ref={wrapRef}
        className="md-chart-plot"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - rect.left - PAD.left) / innerWidth;
          setHover(
            Math.min(
              points.length - 1,
              Math.max(0, Math.round(ratio * (points.length - 1))),
            ),
          );
        }}
        onPointerLeave={() => setHover(null)}
      >
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`${chart.title}. Starts at ${points[0]}, ends at ${
            points[points.length - 1]
          } after ${points.length} ${chart.unit.toLowerCase()}s.`}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className="md-chart-grid"
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
              />
              <text
                className="md-chart-tick"
                x={PAD.left - 8}
                y={y(tick) + 4}
                textAnchor="end"
              >
                {tick.toFixed(digits)}
              </text>
            </g>
          ))}
          {xLabels.map((label) => (
            <text
              key={label}
              className="md-chart-tick"
              x={x(label - 1)}
              y={HEIGHT - 8}
              textAnchor="middle"
            >
              {label === 1 ? `${chart.unit} 1` : label}
            </text>
          ))}
          <path className="md-chart-line" d={path} />
          {markIndex !== null && (
            <g>
              <circle
                className="md-chart-dot"
                cx={x(markIndex)}
                cy={y(points[markIndex])}
                r={5}
              />
              <text
                className="md-chart-mark"
                x={Math.min(x(markIndex), width - PAD.right - 4)}
                y={y(points[markIndex]) - 12}
                textAnchor={markIndex > points.length * 0.8 ? "end" : "middle"}
              >
                {chart.mark!.label}
              </text>
            </g>
          )}
          {hover !== null && (
            <g>
              <line
                className="md-chart-cross"
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={HEIGHT - PAD.bottom}
              />
              <circle
                className="md-chart-dot"
                cx={x(hover)}
                cy={y(points[hover])}
                r={4}
              />
            </g>
          )}
        </svg>
        {hover !== null && (
          <div
            className="md-chart-tip"
            style={{
              left: Math.min(Math.max(x(hover), 70), width - 70),
              top: y(points[hover]),
            }}
          >
            {chart.unit} {hover + 1} ·{" "}
            <strong>{points[hover].toFixed(3)}</strong>
          </div>
        )}
      </div>
    </figure>
  );
}

export default LineChart;
