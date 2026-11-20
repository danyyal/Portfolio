import { useEffect, useRef } from "react";

/* Targeting reticle: four corner brackets that snap onto whatever carries
   data-lock, plus a dot that tracks the pointer exactly. Mouse only. */
function Reticle() {
  const boxRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const dot = dotRef.current;
    if (!box || !dot) return;
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches)
      return;

    document.body.classList.add("m-has-reticle");
    const pointer = { x: -100, y: -100 };
    const current = { x: -100, y: -100, w: 26, h: 26 };
    let target: Element | null = null;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      target =
        (event.target as Element | null)?.closest?.("[data-lock]") ?? null;
      box.classList.toggle("is-locked", Boolean(target));
    };
    const onLeave = () => {
      pointer.x = pointer.y = -100;
      target = null;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      let goal = { x: pointer.x, y: pointer.y, w: 26, h: 26 };
      // re-read every frame so it tracks elements that move or scroll
      if (target?.isConnected) {
        const rect = target.getBoundingClientRect();
        goal = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          w: rect.width + 14,
          h: rect.height + 14,
        };
      }
      current.x += (goal.x - current.x) * 0.34;
      current.y += (goal.y - current.y) * 0.34;
      current.w += (goal.w - current.w) * 0.3;
      current.h += (goal.h - current.h) * 0.3;
      box.style.transform = `translate3d(${current.x - current.w / 2}px, ${current.y - current.h / 2}px, 0)`;
      box.style.width = `${current.w}px`;
      box.style.height = `${current.h}px`;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.body.classList.remove("m-has-reticle");
    };
  }, []);

  return (
    <>
      <div className="m-dot" ref={dotRef} aria-hidden="true" />
      <div className="m-reticle" ref={boxRef} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </>
  );
}

export default Reticle;
