import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import Home from "../Home";

describe("Home Page", () => {
  it("should render and find home element by data-testid", () => {
    // Create a routes stub to provide React Router context
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: Home,
      },
    ]);

    // Render the app stub at the home route
    render(<Stub initialEntries={["/"]} />);

    // Find the element with data-testid="home-page" (note: the actual testid in the component)
    const homeElement = screen.getByTestId("home-page");

    // Check that it exists
    expect(homeElement).toBeInTheDocument();

    // Also verify the content
    expect(homeElement).toHaveTextContent("Home");
  });
});
