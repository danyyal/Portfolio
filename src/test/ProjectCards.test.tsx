import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectCards from "../components/Projects/ProjectCards";

const baseProps = {
  imgPath: "/test-image.png",
  title: "Test Project",
  description: "A test project description",
};

describe("ProjectCards", () => {
  it("renders title, description and screenshot", () => {
    render(<ProjectCards {...baseProps} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A test project description")).toBeInTheDocument();
    expect(screen.getByAltText("Test Project screenshot")).toBeInTheDocument();
  });

  it("renders enabled links when ghLink and demoLink are provided", () => {
    render(
      <ProjectCards
        {...baseProps}
        ghLink="https://github.com/example/repo"
        demoLink="https://example.com"
      />,
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/example/repo",
    );
    expect(screen.getByRole("link", { name: /demo/i })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("disables the GitHub button for private/non-http repos", () => {
    render(<ProjectCards {...baseProps} ghLink="Private repo" />);
    expect(
      screen.queryByRole("link", { name: /github/i }),
    ).not.toBeInTheDocument();
    const disabledBtn = screen.getByText(/github/i).closest("span");
    expect(disabledBtn).toHaveAttribute("aria-disabled", "true");
  });

  it("shows the private badge when isPrivate is set", () => {
    render(<ProjectCards {...baseProps} isPrivate />);
    expect(screen.getByText(/private/i)).toBeInTheDocument();
  });

  it("opens the fullscreen modal when the image is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectCards {...baseProps} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /view test project fullscreen/i }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});
