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
describe("入力確認 TodoLixt が必要。", () => {
  it("stats 表示確認", () => {
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
    expect(screen.getByText("Total items: 3")).toBeInTheDocument();
    expect(screen.getByText("Items completed: 1")).toBeInTheDocument();
    expect(screen.getByText("Items not completed: 2")).toBeInTheDocument();
    expect(screen.getByText("Percent completed: 33")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(screen.getByText("Total items: 3")).toBeInTheDocument();
    expect(screen.getByText("Items completed: 2")).toBeInTheDocument();
    expect(screen.getByText("Items not completed: 1")).toBeInTheDocument();
    expect(screen.getByText("Percent completed: 67")).toBeInTheDocument();
  });
});
