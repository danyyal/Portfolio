import { useEffect, useState } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

type Reading = { value: number; rating: Metric["rating"] };

const metrics = [
  { name: "LCP", label: "Largest contentful paint", unit: "s" },
  { name: "INP", label: "Interaction to next paint", unit: "ms" },
  { name: "CLS", label: "Cumulative layout shift", unit: "" },
  { name: "FCP", label: "First contentful paint", unit: "s" },
  { name: "TTFB", label: "Time to first byte", unit: "ms" },
] as const;

const ratingText: Record<Metric["rating"], string> = {
  good: "Good",
  "needs-improvement": "Needs work",
  poor: "Poor",
};

function format(name: string, value: number) {
  if (name === "CLS") return value.toFixed(3);
  if (name === "LCP" || name === "FCP") return `${(value / 1000).toFixed(2)} s`;
  return `${Math.round(value)} ms`;
}

// Collected from page load, so a sheet opened later still has the readings.
const seen: Record<string, Reading> = {};
const listeners = new Set<() => void>();
let started = false;

function start() {
  if (started) return;
  started = true;
  const record = (metric: Metric) => {
    seen[metric.name] = { value: metric.value, rating: metric.rating };
    listeners.forEach((listener) => listener());
  };
  const options = { reportAllChanges: true };
  onLCP(record, options);
  onINP(record, options);
  onCLS(record, options);
  onFCP(record);
  onTTFB(record);
}

export function startVitals() {
  try {
    start();
  } catch {
    // unsupported browser: the panel shows dashes
  }
}

function VitalsPanel() {
  const [, refresh] = useState(0);

  useEffect(() => {
    startVitals();
    const listener = () => refresh((count) => count + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <section className="md-section">
      <h3>This page, measured in your browser</h3>
      <dl className="md-vitals">
        {metrics.map((metric) => {
          const reading = seen[metric.name];
          return (
            <div key={metric.name}>
              <dt>
                <strong>{metric.name}</strong> {metric.label}
              </dt>
              <dd>
                {reading ? format(metric.name, reading.value) : "—"}
                {reading && (
                  <span
                    className="md-vital-rating"
                    data-rating={reading.rating}
                  >
                    <i aria-hidden="true" />
                    {ratingText[reading.rating]}
                  </span>
                )}
                {!reading && metric.name === "INP" && (
                  <span className="md-vital-wait">
                    click or type to measure
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export default VitalsPanel;
