import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../context/ThemeContext";

function renderNavbar() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("Navbar", () => {
  it("renders all primary navigation links", () => {
    renderNavbar();
    for (const label of [
      "Home",
      "About",
      "Projects",
      "Resume",
      "Testimonial",
      "Playground",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("brand logo links to home via client-side routing", () => {
    renderNavbar();
    const brand = screen.getByRole("link", { name: /danyyal/i });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("toggles between dark and light themes", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole("button", { name: /toggle theme/i });

    expect(document.body.classList.contains("light-mode")).toBe(false);
    await user.click(toggle);
    expect(document.body.classList.contains("light-mode")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");

    await user.click(toggle);
    expect(document.body.classList.contains("light-mode")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("marks the current route's link as active", () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/project"]}>
          <Navbar />
        </MemoryRouter>
      </ThemeProvider>,
    );
    const projectsLink = screen.getByText("Projects").closest("a");
    expect(projectsLink).toHaveClass("active");
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).not.toHaveClass("active");
  });
});
