import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import {
  drawPlanet,
  drawPuff,
  drawRing,
  drawStarSprite,
  drawStreak,
  mulberry32,
  paintEarth,
  type EarthMaps,
  type PlanetSpec,
} from "./textures";

export type FlightState = {
  /** pad: countdown running · ascent: rocket climbing · orbit: page is live */
  phase: "pad" | "ascent" | "orbit";
  /** performance.now() when the current phase began */
  since: number;
  /** engines lit while still on the pad */
  ignite?: boolean;
};

export const ASCENT_MS = 2600;

type Props = {
  flight: MutableRefObject<FlightState>;
  planets: PlanetSpec[];
  reduceMotion: boolean;
};

const FOV = 55;
const ROCKET_DEPTH = 34;
const EARTH_RADIUS = 60;
/** how far the camera travels from the top of the page to the bottom */
const FIELD_DEPTH = 3400;
const FIELD_HALF_WIDTH = 2100;
const FIELD_HALF_HEIGHT = 1700;
const DUST_BOX = 900;

function buildRocket() {
  const rocket = new THREE.Group();

  const hullProfile: THREE.Vector2[] = [];
  const bodyRadius = 0.5;
  hullProfile.push(new THREE.Vector2(0.36, 0));
  hullProfile.push(new THREE.Vector2(bodyRadius, 0.35));
  hullProfile.push(new THREE.Vector2(bodyRadius, 5.2));
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    // ogive nose: the radius falls away on a curve, not a straight taper
    hullProfile.push(
      new THREE.Vector2(
        bodyRadius * Math.cos((t * Math.PI) / 2) ** 0.8,
        5.2 + t * 2,
      ),
    );
  }
  const hull = new THREE.Mesh(
    new THREE.LatheGeometry(hullProfile, 48),
    new THREE.MeshStandardMaterial({
      color: 0xdfe6f2,
      metalness: 0.55,
      roughness: 0.34,
    }),
  );
  rocket.add(hull);

  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.505, 0.505, 0.14, 48),
    new THREE.MeshStandardMaterial({ color: 0x10131c, roughness: 0.6 }),
  );
  band.position.y = 5.0;
  rocket.add(band);

  const lowerBand = band.clone();
  lowerBand.scale.y = 2.2;
  lowerBand.position.y = 1.55;
  rocket.add(lowerBand);

  const noseCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 16),
    new THREE.MeshStandardMaterial({
      color: 0x20242f,
      metalness: 0.8,
      roughness: 0.3,
    }),
  );
  noseCap.scale.y = 1.9;
  noseCap.position.y = 7.02;
  rocket.add(noseCap);

  const porthole = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 24, 16),
    new THREE.MeshStandardMaterial({
      color: 0x2b6cff,
      emissive: 0x1b4fd0,
      emissiveIntensity: 0.9,
      metalness: 0.4,
      roughness: 0.2,
    }),
  );
  porthole.scale.z = 0.35;
  porthole.position.set(0, 4.25, 0.47);
  rocket.add(porthole);

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.95, -0.55);
  finShape.lineTo(0.95, 0.15);
  finShape.lineTo(0, 1.9);
  finShape.closePath();
  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.06,
    bevelEnabled: false,
  });
  finGeometry.translate(0, 0, -0.03);
  const finMaterial = new THREE.MeshStandardMaterial({
    color: 0xc5cede,
    metalness: 0.5,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 4; i++) {
    const pivot = new THREE.Group();
    const fin = new THREE.Mesh(finGeometry, finMaterial);
    fin.position.set(0.46, 0.25, 0);
    pivot.add(fin);
    pivot.rotation.y = (i * Math.PI) / 2 + Math.PI / 4;
    rocket.add(pivot);
  }

  const bellProfile = [
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.24, -0.2),
    new THREE.Vector2(0.4, -0.62),
  ];
  const bell = new THREE.Mesh(
    new THREE.LatheGeometry(bellProfile, 32),
    new THREE.MeshStandardMaterial({
      color: 0x1b1f2b,
      metalness: 0.7,
      roughness: 0.45,
      side: THREE.DoubleSide,
    }),
  );
  rocket.add(bell);

  const flame = new THREE.Group();
  const flameLayer = (
    radius: number,
    length: number,
    color: number,
    opacity: number,
  ) => {
    const geometry = new THREE.ConeGeometry(radius, length, 24, 1);
    // wide end at the nozzle, tip pointing down
    geometry.rotateX(Math.PI);
    geometry.translate(0, -length / 2, 0);
    return new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        // the canvas is transparent, so additive layers would composite dark
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
  };
  flame.add(flameLayer(0.6, 6.2, 0xff6a1f, 0.3));
  flame.add(flameLayer(0.4, 4.2, 0xffa23f, 0.6));
  flame.add(flameLayer(0.22, 2.4, 0xfff3d6, 0.95));
  flame.position.y = -0.6;
  flame.visible = false;
  rocket.add(flame);

  return { rocket, flame };
}

function buildStars(
  count: number,
  seed: number,
  sprite: THREE.Texture,
  size: number,
) {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // a deep corridor, not a shell: the camera flies down it as the page scrolls
    let x = (rand() - 0.5) * 2 * FIELD_HALF_WIDTH;
    let y = (rand() - 0.5) * 2 * FIELD_HALF_HEIGHT;
    // keep the flight path itself clear, so no star swells across the screen
    if (Math.abs(x) < 70 && Math.abs(y) < 70) {
      x += Math.sign(x || 1) * 90;
      y += Math.sign(y || 1) * 90;
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 500 - rand() * (FIELD_DEPTH + 2800);
    // mostly white, a few warm and a few cool
    const tint = rand();
    const brightness = 0.55 + rand() * 0.45;
    colors[i * 3] = brightness * (tint > 0.9 ? 1 : 0.92);
    colors[i * 3 + 1] = brightness * (tint > 0.9 ? 0.86 : 0.95);
    colors[i * 3 + 2] = brightness * (tint < 0.15 ? 1 : 0.93);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
}

function SkyCanvas({ flight, planets, reduceMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch {
      // no WebGL: the CSS sky behind the canvas carries the page
      canvas.style.display = "none";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    /* ---- deep sky: stars, Earth, the rocket ---- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 2000);

    const sprite = track(new THREE.CanvasTexture(drawStarSprite()));
    const starField = new THREE.Group();
    const farStars = buildStars(17000, 11, sprite, 5.2);
    const nearStars = buildStars(1700, 29, sprite, 10.5);
    starField.add(farStars, nearStars);
    scene.add(starField);
    track(farStars.geometry);
    track(nearStars.geometry);
    track(farStars.material as THREE.Material);
    track(nearStars.material as THREE.Material);

    scene.add(new THREE.AmbientLight(0x8fa4d8, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(-6, 5, 8);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x4f8dff, 1.3);
    rim.position.set(7, -2, 2);
    scene.add(rim);

    // the sun sits up and to the left, so the terminator crosses the limb
    const sunDirection = new THREE.Vector3(-0.62, 0.38, 0.68).normalize();
    const blank = track(new THREE.DataTexture(new Uint8Array(4), 1, 1));
    blank.needsUpdate = true;
    const earthUniforms = {
      colorMap: { value: blank as THREE.Texture },
      dataMap: { value: blank as THREE.Texture },
      sunDirection: { value: sunDirection },
      cloudShift: { value: 0 },
      ready: { value: 0 },
    };
    const earthMaterial = track(
      new THREE.ShaderMaterial({
        uniforms: earthUniforms,
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = viewPosition.xyz;
            gl_Position = projectionMatrix * viewPosition;
          }`,
        fragmentShader: `
          uniform sampler2D colorMap;
          uniform sampler2D dataMap;
          uniform vec3 sunDirection;
          uniform float cloudShift;
          uniform float ready;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(-vViewPosition);
            float sun = dot(normal, sunDirection);
            float day = smoothstep(-0.14, 0.32, sun);

            vec3 surface = mix(vec3(0.02, 0.09, 0.25), texture2D(colorMap, vUv).rgb, ready);
            vec4 data = texture2D(dataMap, vUv) * ready;
            vec2 cloudUv = vec2(vUv.x + cloudShift, vUv.y);
            float cloud = texture2D(dataMap, cloudUv).b * ready;
            // the same clouds, sampled a little toward the sun, cast the shadow
            float shadow = texture2D(dataMap, cloudUv + vec2(-0.0035, 0.0022)).b * ready;

            vec3 lit = surface * mix(0.012, 1.18, day);
            lit *= 1.0 - shadow * 0.42 * day;

            // sunlight glints off open water
            vec3 halfway = normalize(sunDirection + viewDir);
            float glint = pow(max(dot(normal, halfway), 0.0), 70.0);
            lit += vec3(1.0, 0.93, 0.8) * glint * (1.0 - data.r) * (1.0 - cloud) * day * 0.9;

            vec3 cloudColor = mix(vec3(0.02, 0.025, 0.04), vec3(1.0), day);
            lit = mix(lit, cloudColor, cloud * 0.94);

            // cities on the night side, dimmed under cloud
            lit += vec3(1.0, 0.74, 0.4) * data.g * (1.0 - day) * (1.0 - cloud * 0.85) * 1.9;

            // a warm band where day turns to night
            float dusk = smoothstep(-0.16, 0.08, sun) * (1.0 - smoothstep(0.08, 0.42, sun));
            lit += vec3(0.95, 0.36, 0.1) * dusk * 0.13;

            // air glows at grazing angles, mostly on the day side
            float graze = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.2);
            lit += vec3(0.22, 0.5, 1.0) * graze * (0.12 + 0.95 * day);

            gl_FragColor = vec4(lit, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    );
    const earth = new THREE.Mesh(
      track(new THREE.SphereGeometry(EARTH_RADIUS, 192, 128)),
      earthMaterial,
    );
    // tilted so temperate and tropical latitudes face the camera
    earth.rotation.set(-0.86, 0, 0.2);
    let earthReady = false;
    const showEarth = (maps: EarthMaps) => {
      const colorMap = track(new THREE.CanvasTexture(maps.color));
      colorMap.colorSpace = THREE.SRGBColorSpace;
      const dataMap = track(new THREE.CanvasTexture(maps.data));
      for (const map of [colorMap, dataMap]) {
        map.wrapS = THREE.RepeatWrapping;
        map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
      earthUniforms.colorMap.value = colorMap;
      earthUniforms.dataMap.value = dataMap;
      earthReady = true;
    };
    // a quick surface first, then a sharper one on machines that can afford it
    const roomy =
      window.innerWidth >= 900 && (navigator.hardwareConcurrency ?? 4) > 4;
    let cancelEarthPaint = paintEarth(
      (maps) => {
        showEarth(maps);
        if (roomy) cancelEarthPaint = paintEarth(showEarth, 4096, 2048);
      },
      2048,
      1024,
    );
    const atmosphere = new THREE.Mesh(
      track(new THREE.SphereGeometry(EARTH_RADIUS * 1.05, 128, 96)),
      track(
        new THREE.ShaderMaterial({
          uniforms: { sunDirection: { value: sunDirection } },
          transparent: true,
          depthWrite: false,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
          fragmentShader: `
            uniform vec3 sunDirection;
            varying vec3 vNormal;
            void main() {
              vec3 normal = normalize(vNormal);
              float rim = pow(clamp(0.7 - normal.z, 0.0, 1.0), 5.0);
              float lit = smoothstep(-0.45, 0.5, dot(normal, sunDirection));
              vec3 tint = mix(vec3(0.95, 0.45, 0.2), vec3(0.3, 0.58, 1.0), smoothstep(0.0, 0.5, lit));
              gl_FragColor = vec4(tint, 1.0) * rim * (0.25 + 1.9 * lit);
            }`,
        }),
      ),
    );
    const earthGroup = new THREE.Group();
    earthGroup.add(earth, atmosphere);
    earthGroup.visible = false;
    // everything staged in front of the lens rides with the camera
    const rig = new THREE.Group();
    scene.add(rig);
    rig.add(earthGroup);

    const { rocket, flame } = buildRocket();
    rocket.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        track(mesh.geometry);
        track(mesh.material as THREE.Material);
      }
    });
    rig.add(rocket);

    /* exhaust: a recycled pool of puffs, plus a glow at the nozzle */
    const puffTexture = track(new THREE.CanvasTexture(drawPuff()));
    type Puff = {
      sprite: THREE.Sprite;
      age: number;
      life: number;
      vx: number;
      vy: number;
      size: number;
    };
    const puffs: Puff[] = Array.from({ length: 90 }, () => {
      const sprite = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: puffTexture,
            transparent: true,
            depthWrite: false,
            opacity: 0,
          }),
        ),
      );
      sprite.visible = false;
      rig.add(sprite);
      return { sprite, age: 0, life: 0, vx: 0, vy: 0, size: 1 };
    });
    let nextPuff = 0;
    const emitPuff = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      size: number,
      life: number,
    ) => {
      const puff = puffs[nextPuff];
      nextPuff = (nextPuff + 1) % puffs.length;
      puff.age = 0;
      puff.life = life;
      puff.vx = vx;
      puff.vy = vy;
      puff.size = size;
      puff.sprite.position.set(x, y, -ROCKET_DEPTH - 0.4);
      puff.sprite.material.rotation = Math.random() * Math.PI * 2;
      puff.sprite.visible = true;
    };
    const hot = new THREE.Color(0xffc27a);
    const cool = new THREE.Color(0xb9c2d6);

    const engineGlow = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: sprite,
          color: 0xffa24a,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0,
        }),
      ),
    );
    rig.add(engineGlow);

    /* a satellite crossing above the limb */
    const satellite = new THREE.Group();
    const panelMaterial = track(
      new THREE.MeshStandardMaterial({
        color: 0x1e3f8f,
        emissive: 0x0a1c4a,
        metalness: 0.6,
        roughness: 0.35,
        side: THREE.DoubleSide,
      }),
    );
    const panelGeometry = track(new THREE.PlaneGeometry(1.5, 0.62));
    for (const side of [-1, 1]) {
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.x = side * 1.2;
      satellite.add(panel);
    }
    const bus = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.6, 0.6, 0.6)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xdbe6f7,
          metalness: 0.7,
          roughness: 0.3,
        }),
      ),
    );
    const dish = new THREE.Mesh(
      track(new THREE.ConeGeometry(0.3, 0.22, 20, 1, true)),
      bus.material,
    );
    dish.position.y = 0.44;
    satellite.add(bus, dish);
    satellite.visible = false;
    rig.add(satellite);

    /* an occasional shooting star */
    const meteor = new THREE.Mesh(
      track(new THREE.PlaneGeometry(26, 0.5)),
      track(
        new THREE.MeshBasicMaterial({
          map: track(new THREE.CanvasTexture(drawStreak())),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0,
        }),
      ),
    );
    meteor.visible = false;
    rig.add(meteor);

    /* dust near the lens: two boxes leapfrog so it streams past for the whole flight */
    const dustBoxes = [0, 1].map((box) => {
      const rand = mulberry32(301 + box);
      const count = window.innerWidth < 760 ? 160 : 320;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        let x = (rand() - 0.5) * 900;
        let y = (rand() - 0.5) * 700;
        if (Math.abs(x) < 30 && Math.abs(y) < 30) {
          x += Math.sign(x || 1) * 40;
          y += Math.sign(y || 1) * 40;
        }
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = -rand() * DUST_BOX;
      }
      const geometry = track(new THREE.BufferGeometry());
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      const points = new THREE.Points(
        geometry,
        track(
          new THREE.PointsMaterial({
            size: 1.5,
            map: sprite,
            color: 0xbcd8ff,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      scene.add(points);
      return points;
    });

    /* nebulae: faint clouds off to the sides, deeper along the route */
    const nebulae = [
      { color: 0x3b86ff, x: -820, y: 260, z: -1100, size: 1300 },
      { color: 0x7c5cff, x: 900, y: -180, z: -1750, size: 1500 },
      { color: 0xff9ec7, x: -700, y: -420, z: -2500, size: 1200 },
      { color: 0x2f6fe0, x: 760, y: 380, z: -3150, size: 1600 },
      { color: 0x5aa6ff, x: -960, y: 120, z: -3900, size: 1400 },
    ].map((spec, index) => {
      const cloud = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: sprite,
            color: spec.color,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      cloud.position.set(spec.x, spec.y, spec.z);
      cloud.scale.set(spec.size, spec.size, 1);
      scene.add(cloud);
      return { cloud, base: 0.055 + (index % 3) * 0.015, phase: index * 1.7 };
    });

    /* the lens leans a little toward the pointer */
    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    let flyZ = 0;
    let camX = 0;
    let camY = 0;
    let meteorAt = performance.now() + 5000;
    let meteorFrom = new THREE.Vector3();

    /* ---- project worlds: an ortho overlay pinned to DOM slots ---- */
    const overlay = new THREE.Scene();
    const overlayCamera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      -2000,
      2000,
    );
    overlay.add(new THREE.AmbientLight(0x6f7fae, 0.55));
    const worldLight = new THREE.DirectionalLight(0xffffff, 2.6);
    worldLight.position.set(-0.7, 0.75, 1);
    overlay.add(worldLight);

    const sphereGeometry = track(new THREE.SphereGeometry(1, 64, 48));
    const ringGeometry = track(new THREE.RingGeometry(1.32, 2.05, 96, 1));
    // map the strip across the ring's radius so the divisions read
    {
      const position = ringGeometry.attributes.position;
      const uv = ringGeometry.attributes.uv;
      const point = new THREE.Vector3();
      for (let i = 0; i < position.count; i++) {
        point.fromBufferAttribute(position, i);
        uv.setXY(i, (point.length() - 1.32) / (2.05 - 1.32), 0.5);
      }
    }

    type World = {
      id: string;
      group: THREE.Group;
      globe: THREE.Mesh;
      spec: PlanetSpec;
      slot: HTMLElement | null;
      scale: number;
      spin: number;
    };
    const worlds: World[] = planets.map((spec, index) => {
      const group = new THREE.Group();
      const material = track(
        new THREE.MeshStandardMaterial({
          color: spec.palette[1],
          roughness: 0.9,
        }),
      );
      const globe = new THREE.Mesh(sphereGeometry, material);
      globe.rotation.z = ((index % 3) - 1) * 0.22;
      group.add(globe);
      if (spec.ring) {
        const ringTexture = track(
          new THREE.CanvasTexture(drawRing(spec.ring, spec.seed)),
        );
        ringTexture.colorSpace = THREE.SRGBColorSpace;
        const ring = new THREE.Mesh(
          ringGeometry,
          track(
            new THREE.MeshBasicMaterial({
              map: ringTexture,
              transparent: true,
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          ),
        );
        ring.rotation.x = Math.PI / 2 - 0.34;
        ring.rotation.y = ((index % 2) * 2 - 1) * 0.2;
        group.add(ring);
      }
      group.visible = false;
      overlay.add(group);
      return {
        id: spec.id,
        group,
        globe,
        spec,
        slot: null,
        scale: 0,
        spin: 0.05 + (index % 4) * 0.02,
      };
    });

    // Surfaces are painted one per frame so the countdown never stutters.
    let nextSurface = 0;
    const paintNextSurface = () => {
      const world = worlds[nextSurface++];
      if (!world) return;
      const texture = track(new THREE.CanvasTexture(drawPlanet(world.spec)));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      const material = world.globe.material as THREE.MeshStandardMaterial;
      material.map = texture;
      material.color.set(0xffffff);
      material.needsUpdate = true;
    };

    const findSlots = () => {
      for (const world of worlds) {
        world.slot = document.querySelector<HTMLElement>(
          `[data-world="${world.id}"]`,
        );
      }
    };

    let width = 1;
    let height = 1;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      overlayCamera.left = -width / 2;
      overlayCamera.right = width / 2;
      overlayCamera.top = height / 2;
      overlayCamera.bottom = -height / 2;
      overlayCamera.updateProjectionMatrix();
      findSlots();
    };
    resize();
    window.addEventListener("resize", resize);
    // slots mount after the first paint and move when filters change
    const slotTimer = window.setInterval(findSlots, 1200);

    const halfHeightAt = (depth: number) =>
      depth * Math.tan(THREE.MathUtils.degToRad(FOV / 2));

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const state = flight.current;
      const elapsed = now - state.since;
      const scroll = window.scrollY;
      const viewHalf = halfHeightAt(ROCKET_DEPTH);

      if (nextSurface < worlds.length) paintNextSurface();

      /* stars drift, fall past during the climb, and slide with the scroll */
      const climbed =
        state.phase === "orbit"
          ? 1
          : state.phase === "ascent"
            ? Math.pow(Math.min(1, elapsed / ASCENT_MS), 2.4)
            : 0;
      // during the climb the stars fall past; afterwards the page scroll flies us through them
      starField.position.y = -climbed * 620;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - height,
      );
      const progress = Math.min(1, Math.max(0, scroll / maxScroll));
      const targetZ = reduceMotion ? 0 : -progress * FIELD_DEPTH;
      // eased, so a flick of the wheel reads as thrust and coasting, not a jump cut
      flyZ += (targetZ - flyZ) * Math.min(1, dt * 4.2);
      camX +=
        ((reduceMotion ? 0 : pointer.x * 26) - camX) * Math.min(1, dt * 2.6);
      camY +=
        ((reduceMotion ? 0 : -pointer.y * 17) - camY) * Math.min(1, dt * 2.6);
      rig.position.z = flyZ;

      const speed = Math.min(1, Math.abs(targetZ - flyZ) / 220);
      const k = Math.floor(-flyZ / DUST_BOX);
      dustBoxes.forEach((box, index) => {
        // each box sits where the camera is, or one box-length ahead
        const slot = k + ((index + k) % 2 === 0 ? 0 : 1);
        box.position.z = -slot * DUST_BOX;
        const material = box.material as THREE.PointsMaterial;
        const goal =
          state.phase === "orbit" ? 0.16 + 0.5 * speed + 0.14 * progress : 0;
        material.opacity += (goal - material.opacity) * Math.min(1, dt * 3);
      });
      for (const { cloud, base, phase } of nebulae) {
        const ahead = flyZ - cloud.position.z; // > 0 while the cloud is still in front
        const near =
          Math.min(1, Math.max(0, (ahead + 200) / 500)) *
          Math.min(1, Math.max(0, (2600 - ahead) / 900));
        cloud.material.opacity =
          state.phase === "orbit"
            ? base * near * (0.85 + 0.15 * Math.sin(now * 0.0004 + phase))
            : 0;
      }

      /* rocket */
      const rocketScale = (viewHalf * 2 * 0.36) / 7.2;
      const padX = Math.min(
        viewHalf * camera.aspect * 0.62,
        viewHalf * camera.aspect - 2.4,
      );
      const padY = -viewHalf + viewHalf * 0.3;
      rocket.scale.setScalar(rocketScale);
      let thrust = 0;
      let rumble = 0;
      if (state.phase === "pad") {
        rocket.visible = true;
        flame.visible = Boolean(state.ignite);
        rocket.position.set(padX, padY, -ROCKET_DEPTH);
        if (state.ignite) {
          // engines lit, clamps still on: a short flame and smoke along the pad
          thrust = 0.35;
          rumble = 0.5;
          flame.scale.set(1, 0.3 + Math.random() * 0.14, 1);
          for (const side of [-1, 1]) {
            emitPuff(
              padX,
              padY - rocketScale * 0.7,
              side * (2.5 + Math.random() * 3.5) * rocketScale,
              (0.2 + Math.random() * 0.8) * rocketScale,
              (1.1 + Math.random() * 0.9) * rocketScale,
              1.5 + Math.random() * 0.9,
            );
          }
        }
      } else if (state.phase === "ascent") {
        const t = Math.min(1, elapsed / ASCENT_MS);
        const climb = t * t * t * (viewHalf * 3.4);
        thrust = 1;
        rumble = 1 - t;
        rocket.visible = true;
        flame.visible = true;
        rocket.position.set(
          padX + (Math.random() - 0.5) * rumble * 0.05,
          padY + climb,
          -ROCKET_DEPTH,
        );
        flame.scale.set(
          1 + Math.random() * 0.12,
          0.85 + Math.random() * 0.4 + t * 0.6,
          1 + Math.random() * 0.12,
        );
        // a trail down the flight path, and a billow where it left the pad
        for (let i = 0; i < 2; i++) {
          emitPuff(
            rocket.position.x + (Math.random() - 0.5) * rocketScale * 0.5,
            rocket.position.y - rocketScale * (3.4 + Math.random() * 1.6),
            (Math.random() - 0.5) * 1.6 * rocketScale,
            -(1.5 + Math.random() * 2.5) * rocketScale,
            (0.8 + Math.random() * 0.8) * rocketScale,
            1.3 + Math.random() * 1.1,
          );
        }
        if (t < 0.4) {
          emitPuff(
            padX,
            padY - rocketScale * 0.7,
            (Math.random() - 0.5) * 9 * rocketScale,
            (0.3 + Math.random()) * rocketScale,
            (1.4 + Math.random() * 1.2) * rocketScale,
            1.8 + Math.random(),
          );
        }
      } else {
        rocket.visible = false;
      }

      engineGlow.visible = thrust > 0 && rocket.visible;
      if (engineGlow.visible) {
        const flicker = 0.85 + Math.random() * 0.3;
        engineGlow.position.set(
          rocket.position.x,
          rocket.position.y - rocketScale * 0.9,
          -ROCKET_DEPTH + 0.3,
        );
        engineGlow.scale.setScalar(rocketScale * (4 + thrust * 7) * flicker);
        engineGlow.material.opacity = 0.55 * flicker;
      }

      for (const puff of puffs) {
        if (!puff.sprite.visible) continue;
        puff.age += dt;
        const life = puff.age / puff.life;
        if (life >= 1) {
          puff.sprite.visible = false;
          continue;
        }
        puff.sprite.position.x += puff.vx * dt;
        puff.sprite.position.y += puff.vy * dt;
        puff.vx *= 1 - dt * 1.4;
        puff.vy *= 1 - dt * 1.4;
        puff.sprite.scale.setScalar(puff.size * (1 + life * 3.2));
        puff.sprite.material.opacity =
          0.55 * (1 - life) * Math.min(1, life * 8);
        puff.sprite.material.color.lerpColors(hot, cool, Math.min(1, life * 3));
      }

      /* the whole view shakes while the engines are at full power */
      const shake = reduceMotion ? 0 : rumble * 0.0035;
      camera.position.set(camX, camY, flyZ);
      camera.lookAt(camX * 0.3, camY * 0.3, flyZ - 400);
      camera.rotation.x += (Math.random() - 0.5) * shake;
      camera.rotation.y += (Math.random() - 0.5) * shake;
      camera.rotation.z += (Math.random() - 0.5) * shake * 0.6;

      /* Earth rises under us once we are up, then falls away with the scroll */
      const settle =
        state.phase === "orbit"
          ? reduceMotion
            ? 1
            : 1 - Math.pow(1 - Math.min(1, elapsed / 2400), 3)
          : 0;
      const earthDepth = 112;
      const earthHalf = halfHeightAt(earthDepth);
      const limbY = -earthHalf * 0.46;
      const hiddenY = -earthHalf * 1.5;
      const sink = (scroll / Math.max(1, height)) * earthHalf * 0.95;
      earthGroup.visible = state.phase === "orbit" && sink < earthHalf * 1.7;
      earthGroup.position.set(
        0,
        hiddenY + (limbY - hiddenY) * settle - EARTH_RADIUS - sink,
        -earthDepth,
      );
      // the painted surface fades in over the plain ocean it replaces
      if (earthReady && earthUniforms.ready.value < 1) {
        earthUniforms.ready.value = Math.min(
          1,
          earthUniforms.ready.value + dt * 1.2,
        );
      }
      if (!reduceMotion) {
        earth.rotation.y += dt * 0.012;
        earthUniforms.cloudShift.value += dt * 0.0016;
      }

      /* satellite: one slow pass across the sky, then round again */
      const aboveFold = scroll < height;
      satellite.visible = state.phase === "orbit" && aboveFold && !reduceMotion;
      if (satellite.visible) {
        const span = halfHeightAt(70) * camera.aspect + 6;
        const lap = ((elapsed / 1000) % 46) / 46;
        satellite.position.set(
          -span + lap * span * 2,
          halfHeightAt(70) * (0.5 - lap * 0.22),
          -70,
        );
        satellite.rotation.set(0.5, elapsed * 0.00025, 0.25);
      }

      /* shooting star */
      if (state.phase === "orbit" && !reduceMotion && now > meteorAt) {
        const life = (now - meteorAt) / 900;
        if (life >= 1) {
          meteor.visible = false;
          meteorAt = now + 5000 + Math.random() * 9000;
        } else {
          if (!meteor.visible) {
            const half = halfHeightAt(120);
            meteorFrom = new THREE.Vector3(
              (Math.random() - 0.3) * half * camera.aspect,
              half * (0.35 + Math.random() * 0.5),
              -120,
            );
            meteor.rotation.z = -0.42 - Math.random() * 0.3;
            meteor.visible = aboveFold;
          }
          const travel = life * 70;
          meteor.position.set(
            meteorFrom.x + Math.cos(meteor.rotation.z) * travel,
            meteorFrom.y + Math.sin(meteor.rotation.z) * travel,
            meteorFrom.z,
          );
          meteor.material.opacity = Math.sin(life * Math.PI) * 0.9;
        }
      }

      /* worlds follow their slots */
      for (const world of worlds) {
        const slot = world.slot;
        if (!slot || !slot.isConnected) {
          world.group.visible = false;
          continue;
        }
        const rect = slot.getBoundingClientRect();
        const onScreen =
          rect.bottom > -120 && rect.top < height + 120 && rect.width > 0;
        world.group.visible = onScreen && state.phase === "orbit";
        if (!world.group.visible) continue;
        const hot = slot.closest(".m-world")?.matches(":hover, :focus-visible");
        const target = (rect.width / 2) * (hot ? 1.08 : 1);
        world.scale += (target - world.scale) * Math.min(1, dt * 9);
        world.group.position.set(
          rect.left + rect.width / 2 - width / 2,
          height / 2 - (rect.top + rect.height / 2),
          0,
        );
        world.group.scale.setScalar(world.scale);
        if (!reduceMotion) world.globe.rotation.y += dt * world.spin;
      }

      renderer.clear();
      renderer.render(scene, camera);
      renderer.clearDepth();
      renderer.render(overlay, overlayCamera);
    };
    frame = requestAnimationFrame(tick);

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(slotTimer);
      cancelEarthPaint();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, [flight, planets, reduceMotion]);

  return <canvas ref={canvasRef} className="m-sky" aria-hidden="true" />;
}

export default SkyCanvas;
