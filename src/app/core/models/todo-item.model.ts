import { TodoPriority, TodoTag } from "../enums/todo.enums";

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  tag: TodoTag;
  priority: TodoPriority;
  editing?: boolean;
}