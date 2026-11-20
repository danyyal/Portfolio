import { useEffect, useRef, useState } from "react";

const TEXT = ["Ø", "2", "5", "H", "7"];
// gaps between neighbours, in character widths: "25" and "H7" sit tight
const GAPS = [0.5, 0.06, 0.9, 0.06];
const STRIP = 74;
const THRESHOLD = 0.5;

type Kind = "region" | "centre";

function parseColor(value: string): [number, number, number] {
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/* Draws what a region heatmap and a centre map look like for one short
   dimension text. Computed in the browser as an illustration. */
function CharMaps() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [counts, setCounts] = useState<Record<Kind, number>>({
    region: 0,
    centre: 0,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const draw = () => {
      const width = Math.max(240, wrap.clientWidth);
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const height = STRIP * 3 + 16;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const styles = getComputedStyle(wrap);
      const surface = parseColor(styles.getPropertyValue("--md-surface"));
      const accent = parseColor(styles.getPropertyValue("--md-accent"));
      const ink = styles.getPropertyValue("--md-ink").trim();
      const line = styles.getPropertyValue("--md-line").trim();

      const charWidth = Math.min(46, (width - 40) / 7.2);
      const total =
        charWidth * (TEXT.length + GAPS.reduce((sum, gap) => sum + gap, 0));
      const centres: number[] = [];
      let cursor = (width - total) / 2 + charWidth / 2;
      TEXT.forEach((_, index) => {
        centres.push(cursor);
        cursor += charWidth * (1 + (GAPS[index] ?? 0));
      });

      ctx.clearRect(0, 0, width, height);

      // strip 1: the crop itself
      ctx.strokeStyle = line;
      ctx.strokeRect(0.5, 0.5, width - 1, STRIP - 1);
      ctx.fillStyle = ink;
      ctx.font = `500 ${charWidth * 1.15}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      TEXT.forEach((char, index) =>
        ctx.fillText(char, centres[index], STRIP / 2 + 2),
      );

      const next: Record<Kind, number> = { region: 0, centre: 0 };
      (["region", "centre"] as Kind[]).forEach((kind, stripIndex) => {
        const top = (STRIP + 8) * (stripIndex + 1);
        const spreadX = charWidth * (kind === "region" ? 0.66 : 0.24);
        const spreadY = STRIP * (kind === "region" ? 0.34 : 0.17);
        const pixelsWide = Math.floor(width * ratio);
        const pixelsHigh = Math.floor(STRIP * ratio);
        const image = ctx.createImageData(pixelsWide, pixelsHigh);
        const midRow: number[] = [];
        for (let py = 0; py < pixelsHigh; py++) {
          const y = py / ratio - STRIP / 2;
          for (let px = 0; px < pixelsWide; px++) {
            const x = px / ratio;
            let value = 0;
            for (const centre of centres) {
              const dx = (x - centre) / spreadX;
              const dy = y / spreadY;
              value = Math.max(value, Math.exp(-(dx * dx + dy * dy) / 2));
            }
            if (py === Math.floor(pixelsHigh / 2)) midRow.push(value);
            // pale to strong in one hue, with a bright core at the peak
            const core = Math.max(0, (value - 0.82) / 0.18) * 0.55;
            const i = (py * pixelsWide + px) * 4;
            for (let c = 0; c < 3; c++) {
              const base = surface[c] + (accent[c] - surface[c]) * value;
              image.data[i + c] = base + (255 - base) * core;
            }
            image.data[i + 3] = 255;
          }
        }
        ctx.putImageData(image, 0, Math.floor(top * ratio));
        ctx.strokeStyle = line;
        ctx.strokeRect(0.5, top + 0.5, width - 1, STRIP - 1);

        // count separate blobs above the threshold along the middle row
        let inside = false;
        for (const value of midRow) {
          if (value >= THRESHOLD && !inside) next[kind]++;
          inside = value >= THRESHOLD;
        }
      });
      setCounts(next);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="md-section">
      <h3>Why a centre map keeps characters apart</h3>
      <div className="md-maps" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`A five-character text crop, and two heatmaps of it. The region heatmap separates ${counts.region} blobs, the centre map separates ${counts.centre}.`}
        />
        <dl className="md-maps-legend">
          <div>
            <dt>Input crop</dt>
            <dd>{TEXT.length} characters</dd>
          </div>
          <div>
            <dt>Region heatmap</dt>
            <dd>{counts.region} blobs above threshold</dd>
          </div>
          <div>
            <dt>Centre map</dt>
            <dd>{counts.centre} peaks above threshold</dd>
          </div>
        </dl>
      </div>
      <p className="md-table-note">
        An illustration of the two target types, computed in your browser. It is
        not model output: no drawing data is shown on this site.
      </p>
    </section>
  );
}

export default CharMaps;
