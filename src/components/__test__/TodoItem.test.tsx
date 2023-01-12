import React, { useEffect } from "react";
import { RecoilRoot, RecoilState, useRecoilValue } from "recoil";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoList from "../TodoList";
import TodoItem from "../TodoItem";
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

const testItems: TodoItemType[] = [
  { id: 1, isComplete: false, text: "Recoil1" },
  { id: 2, isComplete: true, text: "Recoil2" },
  { id: 3, isComplete: false, text: "Recoil3" },
];

describe("todoItem[] の表示確認", () => {
  it("renders textbox & checkbox & button", () => {
    render(
      <>
        <RecoilRoot>
          {testItems.map((todoItem) => (
            <TodoItem key={todoItem.id} item={todoItem} />
          ))}
        </RecoilRoot>
      </>
    );
    //screen.debug();
    //screen.getByRole("");
    //同等の要素が複数ある場合は getAllBy... してリスト要素を指定して確認する。
    expect(screen.getByDisplayValue("Recoil1")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
    expect(screen.getAllByRole("button")[0]).toBeEnabled();
    expect(screen.getByDisplayValue("Recoil2")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")[1]).toBeChecked();
    expect(screen.getAllByRole("button")[1]).toBeEnabled();
    expect(screen.getByDisplayValue("Recoil3")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")[2]).not.toBeChecked();
    expect(screen.getAllByRole("button")[2]).toBeEnabled();
  });
});
describe("入力確認 Recoil や TodoItemCreatorに依存するので TodoListとして評価。", () => {
  const onChangeSpy = jest.fn();
  it("完/未完checkbox & 削除buttonへの入力", () => {
    render(
      <>
        <RecoilRoot>
          <RecoilObserver node={todoListState} onChange={onChangeSpy} />
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
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil2" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Recoil3" },
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onChangeSpy).toHaveBeenCalledTimes(4);
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: false, text: "Recoil1" },
      { id: 1, isComplete: false, text: "Recoil2" },
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);

    fireEvent.change(screen.getAllByRole("textbox")[3], {
      target: { value: "coil4" },
    });
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: false, text: "Recoil1" },
      { id: 1, isComplete: false, text: "Recoil2" },
      { id: 2, isComplete: false, text: "coil4" },
    ]);
    fireEvent.click(screen.getAllByRole("checkbox")[2]);
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: false, text: "Recoil1" },
      { id: 1, isComplete: false, text: "Recoil2" },
      { id: 2, isComplete: true, text: "coil4" },
    ]);
    fireEvent.click(screen.getAllByRole("button")[3]);
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: false, text: "Recoil1" },
      { id: 1, isComplete: false, text: "Recoil2" },
    ]);
  });
});
