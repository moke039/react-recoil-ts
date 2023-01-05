import React, { useEffect } from "react";
import { RecoilRoot, RecoilState, useRecoilValue } from "recoil";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoItemCreator from "../TodoItemCreator";
import { TodoItemType, todoListState } from "../../state/recoilState";
type Props = {
  node: RecoilState<TodoItemType[]>;
  onChange: jest.Mock<any, any>;
};
const RecoilObserver = ({ node, onChange }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

describe("表示確認", () => {
  it("renders textbox & button", () => {
    render(<TodoItemCreator />);
    //screen.debug();
    //screen.getByRole("");
    const titleElement = screen.getByText(/add/i);
    expect(titleElement).toBeInTheDocument();
  });
});
describe("入力確認", () => {
  const onChange = jest.fn();
  it("textbox & buttonへの入力", () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={todoListState} onChange={onChange} />
        <TodoItemCreator />
      </RecoilRoot>
    );
    const textEl = screen.getByRole("textbox");
    fireEvent.change(textEl, { target: { value: "Recoil" } });
    const buttonEl = screen.getByRole("button");
    fireEvent.click(buttonEl);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith([]); // Initial state on render.
    expect(onChange).toHaveBeenCalledWith([
      { id: 0, isComplete: false, text: "Recoil" },
    ]); // New value on change.
  });
  it("textbox & buttonへの複数入力", () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={todoListState} onChange={onChange} />
        <TodoItemCreator />
      </RecoilRoot>
    );
    const textEl = screen.getByRole("textbox");
    fireEvent.change(textEl, { target: { value: "Recoil" } });
    const buttonEl = screen.getByRole("button");
    fireEvent.click(buttonEl);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onChange).toHaveBeenCalledWith([
      { id: 1, isComplete: false, text: "Recoil" },
    ]);

    fireEvent.change(textEl, { target: { value: "Recoil2" } });
    fireEvent.click(buttonEl);
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onChange).toHaveBeenCalledWith([
      { id: 1, isComplete: false, text: "Recoil" },
    ]);
    expect(onChange).toHaveBeenCalledWith([
      { id: 1, isComplete: false, text: "Recoil" },
      { id: 2, isComplete: false, text: "Recoil2" },
    ]);
  });
});
