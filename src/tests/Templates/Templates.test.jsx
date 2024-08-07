import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import Templates from "../../pages/Templates/Templates";
import Template from "../../pages/Templates/pages/Template";

afterEach(cleanup);

describe("A truthy statement", () => {
  it("should be equal to 2", () => {
    expect(1 + 1).toEqual(2);
  });
  it("should render Templates component with Templates title", () => {
    render(<Templates />);
    screen.getByText("Templates")
    expect(screen.getByText("Templates")).toBeInTheDocument()
    expect(screen.getByText("create")).toBeInTheDocument()
  });
  it("Should render Template component", () => {
    render(<Template />);
    screen.debug();
  });
});
