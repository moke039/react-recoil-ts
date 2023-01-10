import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import App from "./App";

describe("表示確認", () => {
  it("renders title", () => {
    render(<App />);
    //screen.debug();
    //screen.getByRole("");
    const titleElement = screen.getByText(/example/i);
    expect(titleElement).toBeInTheDocument();
  });
});
describe("combobox確認", () => {
  it("renders combobox", () => {
    render(<App />);
    const filterElement = screen.getByRole("combobox");
    expect(filterElement).toBeValid();
    expect(filterElement).toHaveValue("Show All");
  });
  it("select combobox", () => {
    render(<App />);
    const filterElement = screen.getByRole("combobox");
    userEvent.selectOptions(filterElement, "Show Uncompleted");
    userEvent.selectOptions(filterElement, "Show Completed");
    expect(filterElement).toHaveValue("Show Completed");
  });
});
it("snapshot", () => {
  const component = renderer.create(<App />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
