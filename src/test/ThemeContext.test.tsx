import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>current: {theme}</button>
  );
}

describe("ThemeContext", () => {
  it("defaults to dark theme", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByText("current: dark")).toBeInTheDocument();
    expect(document.body.classList.contains("light-mode")).toBe(false);
  });

  it("respects a previously stored theme", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByText("current: light")).toBeInTheDocument();
    expect(document.body.classList.contains("light-mode")).toBe(true);
  });

  it("toggles and persists the theme", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("current: light")).toBeInTheDocument();
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.body.classList.contains("light-mode")).toBe(true);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("current: dark")).toBeInTheDocument();
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.body.classList.contains("light-mode")).toBe(false);
  });

  it("throws when useTheme is used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      "useTheme must be used within ThemeProvider",
    );
    spy.mockRestore();
  });
});
