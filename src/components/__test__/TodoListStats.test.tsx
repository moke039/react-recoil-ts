import React, { useEffect } from "react";
import { RecoilRoot, RecoilValueReadOnly, useRecoilValue } from "recoil";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoList from "../TodoList";
import { filteredTodoListState, TodoItemType } from "../../state/recoilState";
type Props = {
  node: RecoilValueReadOnly<TodoItemType[]>;
  onChange: jest.Mock<any, any>;
};
const RecoilSniffer = ({ node, onChange }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

const onChangeSpy = jest.fn();
describe("表示確認 Recoil や TodoItemに依存するので TodoListとして評価。", () => {
  it("stats 表示確認 完/未完数・割合の変化を確認する", () => {
    render(
      <>
        <RecoilRoot>
          <RecoilSniffer node={filteredTodoListState} onChange={onChangeSpy} />
          <TodoList />
        </RecoilRoot>
      </>
    );
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenLastCalledWith([]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil1" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Total items: 1")).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil2" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Total items: 2")).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil3" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Total items: 3")).toBeInTheDocument();

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
