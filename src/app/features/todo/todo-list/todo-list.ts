import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoDialog } from '../add-todo-dialog/add-todo-dialog';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { TagComponent } from '../../../shared/components/tag/tag';
import _ from 'lodash';

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  tag: '工作' | '個人' | '家庭';
  priority: '高' | '中' | '低';
  editing?: boolean;
}

const PRIORITY_ORDER = { '高': 0, '中': 1, '低': 2 };
const TAG_COLORS = { '工作': 'primary', '個人': 'accent', '家庭': 'warn' };
const PRIORITY_COLORS = { '高': 'warn', '中': 'primary', '低': 'default' };

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [MatListModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatInputModule, FormsModule, TagComponent],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoListComponent {
  todos: TodoItem[] = [
    { id: 1, title: '學習 Angular 20', completed: false, tag: '工作', priority: '高' },
    { id: 2, title: '整合 Angular Material', completed: false, tag: '個人', priority: '中' },
    { id: 3, title: '完成 CRUD 功能', completed: false, tag: '家庭', priority: '低' },
  ];
  editTitle = '';

  constructor(private dialog: MatDialog) {}

  get sortedUncompletedTodos(): TodoItem[] {
    return _.sortBy(this.todos.filter((t: TodoItem) => !t.completed), (t: TodoItem) => PRIORITY_ORDER[t.priority]);
  }

  get sortedCompletedTodos(): TodoItem[] {
    return _.sortBy(this.todos.filter((t: TodoItem) => t.completed), (t: TodoItem) => PRIORITY_ORDER[t.priority]);
  }

  toggleCompleted(todo: TodoItem) {
    todo.completed = !todo.completed;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTodoDialog, {
      width: '400px',
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((result: Omit<TodoItem, 'id'> | undefined) => {
      if (result) {
        this.todos.push({ ...result, id: Date.now(), completed: false });
      }
    });
  }

  openDeleteDialog(todo: TodoItem) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '300px',
      data: todo,
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.todos = this.todos.filter(t => t.id !== todo.id);
      }
    });
  }

  startEdit(todo: TodoItem) {
    this.todos.forEach(t => t.editing = false);
    todo.editing = true;
    this.editTitle = todo.title;
  }

  saveEdit(todo: TodoItem) {
    if (this.editTitle.trim()) {
      todo.title = this.editTitle;
      todo.editing = false;
    }
  }

  cancelEdit(todo: TodoItem) {
    todo.editing = false;
  }

  getTagColor(tag: '工作' | '個人' | '家庭'): 'primary' | 'accent' | 'warn' | 'default' {
    return TAG_COLORS[tag] as 'primary' | 'accent' | 'warn' | 'default';
  }
  getPriorityColor(priority: '高' | '中' | '低'): 'primary' | 'accent' | 'warn' | 'default' {
    return PRIORITY_COLORS[priority] as 'primary' | 'accent' | 'warn' | 'default';
  }
}
