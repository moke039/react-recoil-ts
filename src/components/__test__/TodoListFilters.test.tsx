import React, { useEffect } from "react";
import { RecoilRoot, RecoilValueReadOnly, useRecoilValue } from "recoil";
import { fireEvent, render, screen } from "@testing-library/react";
//fireEvent()よりもuserEvent()のほうがユーザ操作に近いのでおすすめ
import userEvent from "@testing-library/user-event";
import TodoList from "../TodoList";
import {
  filteredTodoListState,
  todoListState,
  TodoItemType,
} from "../../state/recoilState";
type Props = {
  node: RecoilValueReadOnly<TodoItemType[]>;
  onChange: jest.Mock<any, any>;
};
const RecoilObserver = ({ node, onChange }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
const RecoilObserver2 = ({ node, onChange }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

const onChangeSpy = jest.fn();
const onChangeSpy2 = jest.fn();
describe("初期表示+userEvent()確認。", () => {
  it("renders combobox & textbox & button", () => {
    render(
      <>
        <RecoilRoot>
          <TodoList />
        </RecoilRoot>
      </>
    );
    //screen.debug();
    //screen.getByRole("");

    expect(screen.getByRole("combobox")).toHaveDisplayValue(["All"]);
    expect(screen.getByRole("combobox")).toHaveValue("Show All");
  });
});
describe("入力確認 Recoil や TodoItemに依存するので TodoListとして評価。", () => {
  it("combobox への入力で、表示するtodoTtem[] が変化することを確認する", () => {
    render(
      <>
        <RecoilRoot>
          <RecoilObserver node={filteredTodoListState} onChange={onChangeSpy} />
          <RecoilObserver2 node={todoListState} onChange={onChangeSpy2} />
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
    userEvent.type(screen.getAllByRole("textbox")[0], "Recoil2");
    userEvent.click(screen.getAllByRole("button")[0]);
    userEvent.type(screen.getAllByRole("textbox")[0], "Recoil3");
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    userEvent.click(screen.getAllByRole("checkbox")[1]);

    expect(screen.getByDisplayValue("Recoil1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Recoil2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Recoil3")).toBeInTheDocument();

    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);
    //参考：todoList[]と同じ変化。
    expect(onChangeSpy2).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Show Completed" },
    });
    expect(screen.getByRole("combobox")).toHaveDisplayValue(["Completed"]);
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
    ]);
    //参考：todoList[]は変化していない。
    expect(onChangeSpy2).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);

    userEvent.selectOptions(screen.getByRole("combobox"), "Show All");
    expect(screen.getByRole("combobox")).toHaveDisplayValue(["All"]);
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);

    userEvent.selectOptions(screen.getByRole("combobox"), "Show Uncompleted");
    expect(screen.getByRole("combobox")).toHaveDisplayValue(["Uncompleted"]);
    expect(onChangeSpy).toHaveBeenLastCalledWith([
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);
    //参考：todoList[]は変化していない。
    expect(onChangeSpy2).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
      { id: 2, isComplete: false, text: "Recoil3" },
    ]);

    //ここでは CreatorのAddボタンと Recoil3 の X ボタンのみ表示されている。
    userEvent.click(screen.getAllByRole("button")[1]);
    expect(onChangeSpy).toHaveBeenLastCalledWith([]);
    //参考：todoList[]も変化する。
    expect(onChangeSpy2).toHaveBeenLastCalledWith([
      { id: 0, isComplete: true, text: "Recoil1" },
      { id: 1, isComplete: true, text: "Recoil2" },
    ]);
    expect(screen.queryByDisplayValue("Recoil3")).not.toBeInTheDocument();
  });
});
