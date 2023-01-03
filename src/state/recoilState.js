import { atom, selector } from "recoil";

const todoListState = atom({
  key: "TodoList",
  default: [],
});

const todoListFilterState = atom({
  key: "TodoListFilter",
  default: "Show All",
});

const filteredTodoListState = selector({
  key: "FilteredTodoList",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isComplete);
      case "Show Uncompleted":
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});

export { todoListState, todoListFilterState, filteredTodoListState };
