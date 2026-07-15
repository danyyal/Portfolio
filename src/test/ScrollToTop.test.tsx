import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

function Harness() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Link to="/other">go</Link>} />
        <Route path="/other" element={<p>other page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ScrollToTop", () => {
  it("scrolls the window to the top on every route change", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("link", { name: "go" }));
    expect(await screen.findByText("other page")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });
});
