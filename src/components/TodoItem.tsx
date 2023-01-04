import React from "react";
import { useRecoilState } from "recoil";
import { TodoItemType, todoListState } from "../state/recoilState";

type Props = {
  item: TodoItemType;
};
function TodoItem({ item }: Props) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: e.target.value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

function replaceItemAtIndex(
  arr: TodoItemType[],
  index: number,
  newValue: TodoItemType
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: TodoItemType[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default TodoItem;
