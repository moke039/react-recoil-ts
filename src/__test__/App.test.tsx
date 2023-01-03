import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

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
