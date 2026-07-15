import { renderHook, act } from "@testing-library/react";
import { useWindowSize } from "../utils/customHooks/useWindowSize";

function resizeTo(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
}

describe("useWindowSize", () => {
  it("returns the current window size", () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it("updates on window resize", () => {
    const { result } = renderHook(() => useWindowSize());
    act(() => resizeTo(500, 700));
    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(700);

    act(() => resizeTo(1280, 800));
    expect(result.current.width).toBe(1280);
    expect(result.current.height).toBe(800);
  });
});
