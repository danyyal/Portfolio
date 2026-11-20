import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeProvider, useMode } from "../context/ModeContext";
import { aiModels, career, skillGroups, systems } from "../data/profile";
import { projects } from "../data/projects";
import en from "../i18n/locales/en.json";

function Probe() {
  const { mode, toggleMode } = useMode();
  return <button onClick={toggleMode}>{mode}</button>;
}

describe("site mode", () => {
  it("defaults to classic and remembers a switch", async () => {
    const { unmount } = render(
      <ModeProvider>
        <Probe />
      </ModeProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("classic");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("mission");
    expect(localStorage.getItem("site-mode")).toBe("mission");
    unmount();

    render(
      <ModeProvider>
        <Probe />
      </ModeProvider>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("mission");
  });

  it("falls back to classic without a provider", () => {
    render(<Probe />);
    expect(screen.getByRole("button")).toHaveTextContent("classic");
  });
});

describe("profile data", () => {
  it("names the company Drevise everywhere", () => {
    const everything = JSON.stringify({
      aiModels,
      career,
      systems,
      projects,
      en,
    });
    expect(everything).not.toMatch(/cerpro/i);
    expect(career[0].company).toBe("Drevise");
  });

  it("gives every project a one-line summary", () => {
    const summaries = en.projects as Record<string, string>;
    for (const project of projects) {
      const key = project.summaryKey.replace("projects.", "");
      expect(summaries[key], key).toBeTruthy();
    }
  });

  it("has no duplicate skills inside a group", () => {
    for (const group of skillGroups) {
      expect(new Set(group.items).size).toBe(group.items.length);
    }
  });
});
