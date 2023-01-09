import React, { useEffect } from "react";
import { RecoilRoot, RecoilValueReadOnly, useRecoilValue } from "recoil";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoList from "../TodoList";
import { filteredTodoListState, TodoItemType } from "../../state/recoilState";
type Props = {
  node: RecoilValueReadOnly<TodoItemType[]>;
  onChange: jest.Mock<any, any>;
};
const RecoilObserver = ({ node, onChange }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

const onChange = jest.fn();
describe("表示確認 TodoListが必要", () => {
  it("renders combobox & textbox & button", () => {
    render(
      <>
        <RecoilRoot>
          <RecoilObserver node={filteredTodoListState} onChange={onChange} />
          <TodoList />
        </RecoilRoot>
      </>
    );
    //screen.debug();
    //screen.getByRole("");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith([]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil1" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil2" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil3" },
    });
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    expect(screen.getByDisplayValue("Recoil1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Recoil2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Recoil3")).toBeInTheDocument();
  });
});
describe("入力確認 TodoLixt が必要。", () => {
  it("combobox への入力", () => {
    render(
      <>
        <RecoilRoot>
          <RecoilObserver node={filteredTodoListState} onChange={onChange} />
          <TodoList />
        </RecoilRoot>
      </>
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith([]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil1" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil2" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil3" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Show Completed" },
    });
    expect(screen.getByRole("combobox")).toHaveDisplayValue(["Completed"]);
    expect(onChange).toHaveBeenLastCalledWith([
      { id: 2, isComplete: true, text: "Recoil1" },
      { id: 3, isComplete: true, text: "Recoil2" },
    ]);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Show Uncompleted" },
    });
    expect(screen.getByRole("combobox")).toHaveDisplayValue(["Uncompleted"]);
    expect(onChange).toHaveBeenLastCalledWith([
      { id: 4, isComplete: false, text: "Recoil3" },
    ]);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Show All" },
    });
    expect(screen.getByRole("combobox")).toHaveDisplayValue(["All"]);
    expect(onChange).toHaveBeenLastCalledWith([
      { id: 2, isComplete: true, text: "Recoil1" },
      { id: 3, isComplete: true, text: "Recoil2" },
      { id: 4, isComplete: false, text: "Recoil3" },
    ]);
  });
});
