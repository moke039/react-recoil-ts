import React, { useEffect } from "react";
import { RecoilRoot, RecoilState, useRecoilValue } from "recoil";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoItemCreator from "../TodoItemCreator";
import { TodoItemType, todoListState } from "../../state/recoilState";

//Recoil関連の処理を覗き込む関数コンポーネントを定義する。
type Props = {
  node: RecoilState<TodoItemType[]>;
  onChangeSpy: jest.Mock<any, any>;
  // ダミー、スタブ、フェイクはテスト対象へ何かしらを与える。
  // スパイはテスト対象の出力を確認する。モックはこれに加えテスト対象への入力もある。
  // スパイ、モックは結合度が高く、メンテナンスが煩雑になりがちだが必要な場面もある。
  // Jset.spyOn() はスパイと言いつつスタブにもなれるので、ちょっと違和感があるかも。
};
const RecoilObserver = ({ node, onChangeSpy }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChangeSpy(value), [onChangeSpy, value]);
  return null;
};

describe("表示確認", () => {
  it("renders textbox & button", () => {
    render(<TodoItemCreator />);
    // ↓ でテストを失敗させて、要素を確認する。
    //screen.debug();
    //screen.getByRole("");
    //screen.queryBy... は要素がないことを確認するのに使用する。
    //screen.findBy... は非同期で出現する要素を確認するのに使用する。
    //参考 https://qiita.com/ossan-engineer/items/4757d7457fafd44d2d2f
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(/add/i)).toBeInTheDocument();
  });
});
describe("入力確認", () => {
  //jest.fn() で関数モックを生成し、スパイとして呼び出し回数や引数を確認する。
  const onChangeSpy = jest.fn();
  it("textbox & buttonへの入力でtodoItem[]が1つできる。", () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={todoListState} onChangeSpy={onChangeSpy} />
        <TodoItemCreator />
      </RecoilRoot>
    );
    const textEl = screen.getByRole("textbox");
    fireEvent.change(textEl, { target: { value: "Recoil" } });
    const buttonEl = screen.getByRole("button");
    fireEvent.click(buttonEl);

    expect(onChangeSpy).toHaveBeenCalledTimes(2);
    expect(onChangeSpy).toHaveBeenCalledWith([]); // Initial state on render.
    expect(onChangeSpy).toHaveBeenCalledWith([
      { id: 0, isComplete: false, text: "Recoil" },
    ]); // New value on change.
  });
  it("textbox & buttonへの入力でtodoItem[]が2つできる。", () => {
    render(
      <RecoilRoot>
        <RecoilObserver node={todoListState} onChangeSpy={onChangeSpy} />
        <TodoItemCreator />
      </RecoilRoot>
    );
    const textEl = screen.getByRole("textbox");
    fireEvent.change(textEl, { target: { value: "Recoil" } });
    const buttonEl = screen.getByRole("button");
    fireEvent.click(buttonEl);
    expect(onChangeSpy).toHaveBeenCalledTimes(2);
    expect(onChangeSpy).toHaveBeenCalledWith([]);
    expect(onChangeSpy).toHaveBeenCalledWith([
      { id: 1, isComplete: false, text: "Recoil" },
    ]);

    fireEvent.change(textEl, { target: { value: "Recoil2" } });
    fireEvent.click(buttonEl);
    expect(onChangeSpy).toHaveBeenCalledTimes(3);
    expect(onChangeSpy).toHaveBeenCalledWith([]);
    expect(onChangeSpy).toHaveBeenCalledWith([
      { id: 1, isComplete: false, text: "Recoil" },
    ]);
    expect(onChangeSpy).toHaveBeenCalledWith([
      { id: 1, isComplete: false, text: "Recoil" },
      { id: 2, isComplete: false, text: "Recoil2" },
    ]);
  });
});
