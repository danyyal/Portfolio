import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";

// Heavy browser-only dependencies are stubbed out for jsdom.
vi.mock("react-tsparticles", () => ({ default: () => null }));
vi.mock("typewriter-effect", () => ({ default: () => null }));
vi.mock("react-github-calendar", () => ({ default: () => null }));
vi.mock("../components/PdfViewer", () => ({ default: () => null }));
vi.mock("../routes", () => ({ otherRoutes: [] }));

import App from "../App";

function renderApp(initialPath = "/") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("App routing", () => {
  it("renders the home hero on /", () => {
    renderApp("/");
    expect(screen.getByText(/hi, i'm/i)).toBeInTheDocument();
    expect(screen.getByText("Danyyal Ali")).toBeInTheDocument();
  });

  it("renders the projects page on /project", async () => {
    renderApp("/project");
    expect(await screen.findByText(/my recent/i)).toBeInTheDocument();
    expect(screen.getByText("Drevise")).toBeInTheDocument();
  });

  it("renders the testimonial page on /testimonial", async () => {
    renderApp("/testimonial");
    expect(await screen.findByText("Sascha Mueller")).toBeInTheDocument();
  });

  it("renders the 404 page for unknown routes", async () => {
    renderApp("/this/route/does-not-exist");
    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toHaveAttribute("href", "/");
  });

  it("renders hero CTAs linking to projects and resume", () => {
    renderApp("/");
    expect(
      screen.getByRole("link", { name: /explore my work/i }),
    ).toHaveAttribute("href", "/project");
    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "/resume",
    );
  });
});
