import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import "../i18n";

// jsdom is missing these browser APIs used by framer-motion & friends
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
window.ResizeObserver = window.ResizeObserver ?? (ObserverStub as never);
window.IntersectionObserver =
  window.IntersectionObserver ?? (ObserverStub as never);

window.scrollTo = vi.fn() as never;

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.body.classList.remove("light-mode");
  vi.clearAllMocks();
});
