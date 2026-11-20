import { useState } from "react";
import examples from "../../data/modelExamples.json";

type Example = {
  width: number;
  height: number;
  inputCaption: string;
  heatCaption: string;
  outputCaption: string;
  found: string;
  note?: string;
};

const steps = [
  { file: "input", label: "Input", caption: "inputCaption" },
  { file: "heat", label: "Raw output", caption: "heatCaption" },
  { file: "output", label: "Result", caption: "outputCaption" },
] as const;

export function hasExample(slug?: string) {
  return Boolean(slug && slug in (examples as Record<string, Example>));
}

/* One real run of the model: what went in, what the network produced, and
   what was decoded from it. */
function ExampleStrip({ slug }: { slug: string }) {
  const example = (examples as Record<string, Example>)[slug];
  const [active, setActive] = useState(2);
  if (!example) return null;
  const step = steps[active];

  return (
    <section className="md-section">
      <h3>One real run, step by step</h3>
      <div className="md-example-tabs" role="tablist" aria-label="Steps">
        {steps.map((item, index) => (
          <button
            key={item.file}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={active === index ? "is-on" : ""}
            onClick={() => setActive(index)}
          >
            <span>{index + 1}</span> {item.label}
          </button>
        ))}
      </div>
      <figure className="md-example">
        <div
          className="md-example-frame"
          style={{ aspectRatio: `${example.width} / ${example.height}` }}
        >
          {steps.map((item, index) => (
            <img
              key={item.file}
              src={`/examples/${slug}/${item.file}.webp`}
              alt={example[item.caption]}
              width={example.width}
              height={example.height}
              loading="lazy"
              className={active === index ? "is-on" : ""}
            />
          ))}
        </div>
        <figcaption>{example[step.caption]}</figcaption>
      </figure>
      <p className="md-example-found">{example.found}</p>
      <p className="md-table-note">
        {example.note ??
          "Run on a drawing made for this site, so no customer drawing is shown. The model and its weights are the real ones."}
      </p>
    </section>
  );
}

export default ExampleStrip;
