import { Component, signal, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoDialog } from '../add-todo-dialog/add-todo-dialog';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import _ from 'lodash';
import { TodoItemComponent } from '../../../shared/components/todo-item/todo-item';
import { TodoTag, TodoPriority } from '../../../core/enums/todo.enums';
import { TodoItem } from '../../../core/models/todo-item.model';
import { TodoFirestoreService } from '../../../core/services/todo-firestore.service';
import { ToastService } from '../../../core/services/toast.service';

const TAG_COLORS: Record<TodoTag, 'primary' | 'accent' | 'warn' | 'default'> = {
  [TodoTag.Work]: 'primary',
  [TodoTag.Personal]: 'accent',
  [TodoTag.Family]: 'warn',
};
const PRIORITY_COLORS: Record<TodoPriority, 'primary' | 'accent' | 'warn' | 'default'> = {
  [TodoPriority.High]: 'warn',
  [TodoPriority.Medium]: 'primary',
  [TodoPriority.Low]: 'default',
};
const PRIORITY_ORDER: Record<TodoPriority, number> = {
  [TodoPriority.High]: 0,
  [TodoPriority.Medium]: 1,
  [TodoPriority.Low]: 2,
};

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [MatListModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, FormsModule, TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoListComponent {
  todos = signal<TodoItem[]>([]);
  editTitle = signal<string>('');
  editTag = signal<TodoTag>(TodoTag.Work);
  editPriority = signal<TodoPriority>(TodoPriority.Medium);

  sortedUncompletedTodos = computed(() =>
    _.sortBy(this.todos().filter((t: TodoItem) => !t.completed), (t: TodoItem) => PRIORITY_ORDER[t.priority])
  );
  sortedCompletedTodos = computed(() =>
    _.sortBy(this.todos().filter((t: TodoItem) => t.completed), (t: TodoItem) => PRIORITY_ORDER[t.priority])
  );

  private firestore = inject(TodoFirestoreService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  constructor() {
    this.firestore.getTodos().subscribe((todos: TodoItem[]) => {
      this.todos.set(todos);
    });
  }

  toggleCompleted(todo: TodoItem) {
    this.todos.update(list => list.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTodoDialog, {
      width: '400px',
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((result: Omit<TodoItem, 'id'> | undefined) => {
      if (result) {
        this.firestore.addTodo(result).then(() => {
          this.toast.success('新增項目成功');
        });
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
        this.firestore.deleteTodo(String(todo.id)).then(() => {
          this.toast.success('刪除項目成功');
        });
      }
    });
  }

  startEdit(todo: TodoItem) {
    this.todos.update(list => list.map(t => ({ ...t, editing: t.id === todo.id })));
    this.editTitle.set(todo.title);
    this.editTag.set(todo.tag);
    this.editPriority.set(todo.priority as TodoPriority);
  }

  saveEdit(todo: TodoItem) {
    if (this.editTitle().trim()) {
      this.todos.update(list => list.map(t =>
        t.id === todo.id
          ? { ...t, title: this.editTitle(), tag: this.editTag(), priority: this.editPriority(), editing: false }
          : t
      ));
    }
  }

  cancelEdit(todo: TodoItem) {
    this.todos.update(list => list.map(t => t.id === todo.id ? { ...t, editing: false } : t));
  }

  getTagColor(tag: TodoTag): 'primary' | 'accent' | 'warn' | 'default' {
    return TAG_COLORS[tag] as 'primary' | 'accent' | 'warn' | 'default';
  }

  getPriorityColor(priority: TodoPriority): 'primary' | 'accent' | 'warn' | 'default' {
    return PRIORITY_COLORS[priority] as 'primary' | 'accent' | 'warn' | 'default';
  }

  saveEditFromChild(todo: TodoItem, event: {title: string, tag: TodoTag, priority: TodoPriority}) {
    this.firestore.updateTodo(String(todo.id), {
      title: event.title,
      tag: event.tag,
      priority: event.priority,
      editing: false
    }).then(() => {
      this.toast.success('編輯項目成功');
    });
  }
}
