import { Component, input, output } from '@angular/core';
import { TodoTag, TodoPriority } from '../../../core/enums/todo.enums';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FilterButton } from '../../../shared/components/filter-button/filter-button';

@Component({
  selector: 'app-todo-filter-bar',
  imports: [MatButtonModule, CommonModule, FilterButton],
  templateUrl: './todo-filter-bar.html',
  styleUrl: './todo-filter-bar.scss',
})
export class TodoFilterBar {
  tagFilter = input<TodoTag[]>([
    TodoTag.Work,
    TodoTag.Personal,
    TodoTag.Family,
  ]);
  priorityFilter = input<TodoPriority[]>([
    TodoPriority.High,
    TodoPriority.Medium,
    TodoPriority.Low,
  ]);
  tagFilterChange = output<TodoTag[]>();
  priorityFilterChange = output<TodoPriority[]>();

  tagOptions: TodoTag[] = [TodoTag.Work, TodoTag.Personal, TodoTag.Family];
  priorityOptions: TodoPriority[] = [
    TodoPriority.High,
    TodoPriority.Medium,
    TodoPriority.Low,
  ];

  toggleTag(tag: TodoTag) {
    const current = [...this.tagFilter()];
    const idx = current.indexOf(tag);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(tag);
    }
    this.tagFilterChange.emit(current);
  }

  togglePriority(priority: TodoPriority) {
    const current = [...this.priorityFilter()];
    const idx = current.indexOf(priority);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(priority);
    }
    this.priorityFilterChange.emit(current);
  }
}
