import { useEffect, useMemo, useRef, useState } from "react";
import { skillGroups } from "../data/profile";

type Tag = { label: string; group: string };

function SkillSphere({ reduceMotion }: { reduceMotion: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const filterRef = useRef(filter);
  filterRef.current = filter;
  const [flat, setFlat] = useState(false);

  const tags = useMemo<Tag[]>(
    () =>
      skillGroups.flatMap((group) =>
        group.items.map((label) => ({ label, group: group.title })),
      ),
    [],
  );

  // Fibonacci sphere: even spacing, no clumping at the poles
  const points = useMemo(
    () =>
      tags.map((_, i) => {
        const y = 1 - (2 * (i + 0.5)) / tags.length;
        const radius = Math.sqrt(1 - y * y);
        const angle = i * Math.PI * (3 - Math.sqrt(5));
        return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
      }),
    [tags],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const nodes = Array.from(stage.querySelectorAll<HTMLElement>(".m-tag"));
    let radius = 200;
    let isFlat = false;

    const measure = () => {
      const size = stage.clientWidth;
      // below this the longest labels are wider than the ball itself
      isFlat = size < 520;
      setFlat(isFlat);
      radius = Math.min(size, 640) / 2 - 70;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);

    let rotX = -0.25;
    let rotY = 0.4;
    let velX = 0;
    let velY = reduceMotion ? 0 : 0.0022;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;

    const onDown = (event: PointerEvent) => {
      if (isFlat) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("is-dragging");
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      velY = (event.clientX - lastX) * 0.004;
      velX = -(event.clientY - lastY) * 0.004;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onUp = () => {
      dragging = false;
      stage.classList.remove("is-dragging");
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (isFlat) return;
      rotX += velX;
      rotY += velY;
      if (!dragging) {
        // ease back to a slow idle spin
        velX *= 0.95;
        velY += ((reduceMotion ? 0 : 0.0022) - velY) * 0.03;
      }
      const sinX = Math.sin(rotX);
      const cosX = Math.cos(rotX);
      const sinY = Math.sin(rotY);
      const cosY = Math.cos(rotY);
      const active = filterRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const p = points[i];
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        // short focal length: a strong near/far size difference reads as a ball
        const perspective = 2.4 / (2.4 - z2);
        const depth = (z2 + 1) / 2;
        const match = active === "All" || tags[i].group === active;
        const node = nodes[i];
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius * perspective}px, ${y1 * radius * perspective}px, 0) scale(${0.62 + depth * 0.62})`;
        node.style.opacity = String((0.18 + depth * 0.82) * (match ? 1 : 0.14));
        node.style.zIndex = String(Math.round(depth * 100));
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, [points, tags, reduceMotion]);

  return (
    <div className="m-skills">
      <div className="m-filters" role="group" aria-label="Filter skills">
        {["All", ...skillGroups.map((group) => group.title)].map((name) => (
          <button
            key={name}
            type="button"
            data-lock
            className={`m-filter ${filter === name ? "is-on" : ""}`}
            aria-pressed={filter === name}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        className={`m-sphere ${flat ? "is-flat" : ""}`}
        ref={stageRef}
        aria-label="Skills"
      >
        {tags.map((tag) => (
          <span
            key={`${tag.group}-${tag.label}`}
            className={`m-tag ${
              flat && filter !== "All" && tag.group !== filter ? "is-dim" : ""
            }`}
          >
            {tag.label}
          </span>
        ))}
      </div>
      {!flat && <p className="m-hint">Drag to spin</p>}
    </div>
  );
}

export default SkillSphere;
