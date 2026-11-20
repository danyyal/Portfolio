/* Procedural surfaces for the mission-mode sky. Everything is drawn on a
   canvas that wraps horizontally, so it maps onto a sphere without a seam. */

export type PlanetKind = "gas" | "rock" | "ice";

export type PlanetSpec = {
  id: string;
  kind: PlanetKind;
  /** dark → light, at least three stops */
  palette: string[];
  ring?: string;
  storm?: string;
  seed: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Value noise on a grid that wraps in x. */
function makeNoise(seed: number, period: number) {
  const rand = mulberry32(seed);
  const size = period;
  const grid = new Float32Array(size * size);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  const at = (x: number, y: number) =>
    grid[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = smooth(x - x0);
    const fy = smooth(y - y0);
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
    return top + (bottom - top) * fy;
  };
}

function makeFbm(seed: number, octaves: number) {
  const layers = Array.from({ length: octaves }, (_, i) =>
    makeNoise(seed + i * 101, 8 << i),
  );
  return (u: number, v: number) => {
    let sum = 0;
    let amp = 0.5;
    let total = 0;
    for (let i = 0; i < layers.length; i++) {
      const freq = 8 << i;
      sum += layers[i](u * freq, v * freq) * amp;
      total += amp;
      amp *= 0.5;
    }
    return sum / total;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function sampleRamp(stops: [number, number, number][], t: number) {
  const clamped = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(clamped);
  const f = clamped - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export type EarthMaps = {
  /** day-side surface colour */
  color: HTMLCanvasElement;
  /** R: land mask · G: city lights · B: cloud cover */
  data: HTMLCanvasElement;
};

/* Paints the Earth in slices between frames, so the launch countdown never
   stutters. Returns a function that cancels the work. */
export function paintEarth(
  done: (maps: EarthMaps) => void,
  width = 2048,
  height = 1024,
): () => void {
  const color = document.createElement("canvas");
  const data = document.createElement("canvas");
  color.width = data.width = width;
  color.height = data.height = height;
  const colorCtx = color.getContext("2d")!;
  const dataCtx = data.getContext("2d")!;
  const colorImage = colorCtx.createImageData(width, height);
  const dataImage = dataCtx.createImageData(width, height);

  const land = makeFbm(7, 7);
  const detail = makeFbm(31, 7);
  const moisture = makeFbm(71, 5);
  const cloud = makeFbm(53, 7);
  const swirl = makeFbm(97, 3);
  const towns = makeFbm(113, 3);
  const grain = makeNoise(131, 1024);
  const heights = new Float32Array(width * height);

  const heightRow = (y: number) => {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      heights[y * width + x] = land(u, v * 0.5) * 0.6 + detail(u * 2, v) * 0.4;
    }
  };

  const colourRow = (y: number) => {
    const v = y / height;
    const lat = Math.abs(v - 0.5) * 2;
    const up = Math.max(0, y - 1) * width;
    const down = Math.min(height - 1, y + 1) * width;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const index = y * width + x;
      const h = heights[index];
      const left = heights[y * width + ((x - 1 + width) % width)];
      const right = heights[y * width + ((x + 1) % width)];
      const shore = smoothstep(0.495, 0.512, h);

      // ocean: turquoise shelves falling away to deep blue
      const depth = clamp01((0.5 - h) / 0.16);
      const shelf = Math.pow(1 - depth, 3);
      let r = 5 + shelf * 34;
      let g = 30 + shelf * 104;
      let b = 82 + shelf * 82;

      if (shore > 0) {
        const elevation = clamp01((h - 0.5) / 0.26);
        const wet = clamp01((moisture(u + 0.5, v * 0.5 + 0.3) - 0.32) / 0.36);
        // deserts sit in a belt either side of the tropics
        const arid =
          clamp01(1 - Math.abs(lat - 0.3) / 0.2) * clamp01(1.5 - wet * 2.4);
        // rainforest where it is wet, savanna where it is not
        let lr = 122 - wet * 96;
        let lg = 126 - wet * 44;
        let lb = 62 - wet * 30;
        lr += (176 - lr) * arid;
        lg += (148 - lg) * arid;
        lb += (98 - lb) * arid;
        // cold steppe toward the poles
        const cold = smoothstep(0.55, 0.8, lat);
        lr += (118 - lr) * cold;
        lg += (120 - lg) * cold;
        lb += (100 - lb) * cold;
        // bare rock, then snow, with height
        const rock = smoothstep(0.42, 0.72, elevation);
        lr += (112 - lr) * rock;
        lg += (100 - lg) * rock;
        lb += (88 - lb) * rock;
        const snow = smoothstep(0.78, 0.92, elevation + lat * 0.25);
        lr += (240 - lr) * snow;
        lg += (244 - lg) * snow;
        lb += (250 - lb) * snow;
        // relief: slopes facing the sun are brighter
        const slope =
          ((left - right) * 30 + (heights[down + x] - heights[up + x]) * 21) *
          (width / 2048);
        const shade = Math.min(1.35, Math.max(0.55, 1 + slope));
        r += (lr * shade - r) * shore;
        g += (lg * shade - g) * shore;
        b += (lb * shade - b) * shore;
      }

      const ice = smoothstep(0.84, 0.9, lat + (h - 0.5) * 0.25);
      r += (238 - r) * ice;
      g += (244 - g) * ice;
      b += (250 - b) * ice;

      const i = index * 4;
      colorImage.data[i] = r;
      colorImage.data[i + 1] = g;
      colorImage.data[i + 2] = b;
      colorImage.data[i + 3] = 255;

      // towns cluster on low, temperate land
      const cluster = smoothstep(0.56, 0.74, towns(u * 2 + 0.2, v + 0.6));
      const spark = smoothstep(0.62, 0.95, grain(u * 1024, v * 512));
      const lights =
        shore *
        (1 - ice) *
        cluster *
        spark *
        clamp01(1.3 - clamp01((h - 0.5) / 0.26) * 2.2) *
        clamp01(1.25 - lat * 1.35);

      // clouds: warped so they curl, thicker along the storm tracks
      const bend = (swirl(u, v * 0.5) - 0.5) * 0.14;
      const cover =
        cloud(u * 2 + 0.37 + bend, v + 0.2 + bend * 0.6) * 0.72 +
        detail(u * 4 + 0.11, v * 2 + 0.7) * 0.28;
      const tracks = 0.62 + 0.38 * Math.cos(lat * Math.PI * 3.2) ** 2;
      const clouds = smoothstep(0.55, 0.75, cover * tracks + 0.09) * 0.96;

      dataImage.data[i] = shore * 255;
      dataImage.data[i + 1] = lights * 255;
      dataImage.data[i + 2] = clouds * 255;
      dataImage.data[i + 3] = 255;
    }
  };

  let row = 0;
  let pass = 0;
  let timer = 0;
  const step = () => {
    // a few milliseconds of rows, then hand the frame back
    const stopAt = performance.now() + 7;
    while (pass < 2 && performance.now() < stopAt) {
      (pass === 0 ? heightRow : colourRow)(row++);
      if (row >= height) {
        row = 0;
        pass++;
      }
    }
    if (pass < 2) {
      timer = window.setTimeout(step, 0);
      return;
    }
    colorCtx.putImageData(colorImage, 0, 0);
    dataCtx.putImageData(dataImage, 0, 0);
    done({ color, data });
  };
  timer = window.setTimeout(step, 0);
  return () => window.clearTimeout(timer);
}

/** A soft, lumpy puff for exhaust smoke. */
export function drawPuff(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(77);
  for (let i = 0; i < 9; i++) {
    const x = 64 + (rand() - 0.5) * 44;
    const y = 64 + (rand() - 0.5) * 44;
    const radius = 26 + rand() * 20;
    const blob = ctx.createRadialGradient(x, y, 0, x, y, radius);
    blob.addColorStop(0, "rgba(255,255,255,0.5)");
    blob.addColorStop(0.55, "rgba(255,255,255,0.16)");
    blob.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = blob;
    ctx.fillRect(0, 0, 128, 128);
  }
  return canvas;
}

/** A streak that is bright at the head and fades along its tail. */
export function drawStreak(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 16;
  const ctx = canvas.getContext("2d")!;
  const tail = ctx.createLinearGradient(0, 0, 256, 0);
  tail.addColorStop(0, "rgba(255,255,255,0)");
  tail.addColorStop(0.85, "rgba(200,225,255,0.55)");
  tail.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = tail;
  ctx.fillRect(0, 6, 256, 4);
  return canvas;
}

export function drawPlanet(
  spec: PlanetSpec,
  width = 512,
  height = 256,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(width, height);
  const stops = spec.palette.map(hexToRgb);
  const mottling = makeFbm(spec.seed, 4);
  const warp = makeFbm(spec.seed + 400, 3);
  const rand = mulberry32(spec.seed * 13 + 5);
  const bandCount = 5 + Math.floor(rand() * 5);
  const bandPhase = rand() * 6.28;

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const lat = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const m = mottling(u, v * 0.5);
      let t: number;
      if (spec.kind === "gas") {
        const bend = (warp(u, v * 0.5) - 0.5) * 0.09;
        t =
          0.5 +
          0.36 * Math.sin((v + bend) * bandCount * Math.PI + bandPhase) +
          (m - 0.5) * 0.22;
      } else if (spec.kind === "ice") {
        const bend = (warp(u, v * 0.5) - 0.5) * 0.05;
        t =
          0.45 +
          0.2 * Math.sin((v + bend) * bandCount * 0.7 * Math.PI + bandPhase) +
          (m - 0.5) * 0.3 +
          Math.max(0, lat - 0.72) * 1.6;
      } else {
        t = 0.15 + m * 0.9 - lat * 0.12;
      }
      const [r, g, b] = sampleRamp(stops, t);
      const i = (y * width + x) * 4;
      image.data[i] = r;
      image.data[i + 1] = g;
      image.data[i + 2] = b;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  // Anything near an edge is repeated on the far side so it wraps cleanly.
  const stamp = (cx: number, draw: (x: number) => void) => {
    draw(cx);
    draw(cx - width);
    draw(cx + width);
  };

  if (spec.kind === "rock") {
    const craters = 14 + Math.floor(rand() * 12);
    for (let i = 0; i < craters; i++) {
      const cx = rand() * width;
      const cy = height * (0.18 + rand() * 0.64);
      const radius = 3 + rand() * 11;
      stamp(cx, (x) => {
        ctx.beginPath();
        ctx.ellipse(x, cy, radius, radius * 0.92, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.38)";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x - 1, cy - 1, radius, radius * 0.92, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    }
  }

  if (spec.storm) {
    const cx = width * (0.2 + rand() * 0.6);
    const cy = height * (0.38 + rand() * 0.28);
    stamp(cx, (x) => {
      const glow = ctx.createRadialGradient(x, cy, 1, x, cy, 30);
      glow.addColorStop(0, spec.storm!);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.translate(x, cy);
      ctx.scale(1.7, 0.75);
      ctx.translate(-x, -cy);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, cy, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  return canvas;
}

/** A radial strip: opaque bands with a few darker gaps, like ring divisions. */
export function drawRing(color: string, seed: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 4;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(seed + 900);
  const [r, g, b] = hexToRgb(color);
  for (let x = 0; x < canvas.width; x++) {
    const edge = Math.min(1, x / 18, (canvas.width - x) / 18);
    const gap = rand() > 0.86 ? 0.15 : 1;
    const alpha = (0.35 + rand() * 0.5) * edge * gap;
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fillRect(x, 0, 1, canvas.height);
  }
  return canvas;
}

/** Soft round sprite so stars are discs, not squares. */
export function drawStarSprite(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.25, "rgba(255,255,255,0.85)");
  glow.addColorStop(0.6, "rgba(255,255,255,0.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  return canvas;
}

export { mulberry32 };
