import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import sortBy from 'lodash-es/sortBy';
import { TodoItemComponent } from '../todo-item/todo-item';
import { TodoTag, TodoPriority } from '../../../core/enums/todo.enums';
import { TodoItem } from '../../../core/models/todo-item.model';
import { TodoFirestoreService } from '../../../core/services/todo-firestore.service';
import { ToastService } from '../../../core/services/toast.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TodoFilterBar } from '../todo-filter-bar/todo-filter-bar';

const TAG_COLORS: Record<TodoTag, 'primary' | 'accent' | 'warn' | 'default'> = {
  [TodoTag.Work]: 'primary',
  [TodoTag.Personal]: 'accent',
  [TodoTag.Family]: 'warn',
};
const PRIORITY_COLORS: Record<
  TodoPriority,
  'primary' | 'accent' | 'warn' | 'default'
> = {
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
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    TodoItemComponent,
    MatPaginatorModule,
    TodoFilterBar,
  ],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoListComponent {
  todos = signal<TodoItem[]>([]);
  editTitle = signal<string>('');
  editTag = signal<TodoTag>(TodoTag.Work);
  editPriority = signal<TodoPriority>(TodoPriority.Medium);

  tagOptions: TodoTag[] = [TodoTag.Work, TodoTag.Personal, TodoTag.Family];
  tagFilter = signal<TodoTag[]>([TodoTag.Work, TodoTag.Personal, TodoTag.Family]);
  priorityOptions: TodoPriority[] = [TodoPriority.High, TodoPriority.Medium, TodoPriority.Low];
  priorityFilter = signal<TodoPriority[]>([TodoPriority.High, TodoPriority.Medium, TodoPriority.Low]);

  toggleTag(tag: TodoTag) {
    const current = this.tagFilter().slice();
    const idx = current.indexOf(tag);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(tag);
    }
    this.tagFilter.set(current);
    this.uncompletedPageIndex.set(0);
    this.completedPageIndex.set(0);
  }

  togglePriority(priority: TodoPriority) {
    const current = this.priorityFilter().slice();
    const idx = current.indexOf(priority);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(priority);
    }
    this.priorityFilter.set(current);
    this.uncompletedPageIndex.set(0);
    this.completedPageIndex.set(0);
  }

  filteredTodos = computed(() => {
    return this.todos().filter(t =>
      this.tagFilter().includes(t.tag) && this.priorityFilter().includes(t.priority)
    );
  });

  sortedUncompletedTodos = computed(() =>
    sortBy(
      this.filteredTodos().filter((t: TodoItem) => !t.completed),
      (t: TodoItem) => PRIORITY_ORDER[t.priority]
    )
  );
  sortedCompletedTodos = computed(() =>
    sortBy(
      this.filteredTodos().filter((t: TodoItem) => t.completed),
      (t: TodoItem) => PRIORITY_ORDER[t.priority]
    )
  );

  pageSize = 10;
  uncompletedPageIndex = signal(0);
  completedPageIndex = signal(0);

  pagedUncompletedTodos = computed(() => {
    const all = this.sortedUncompletedTodos();
    const start = this.uncompletedPageIndex() * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });
  pagedCompletedTodos = computed(() => {
    const all = this.sortedCompletedTodos();
    const start = this.completedPageIndex() * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  uncompletedTotalLength = computed(() => this.sortedUncompletedTodos().length);
  completedTotalLength = computed(() => this.sortedCompletedTodos().length);

  onUncompletedPage(event: { pageIndex: number }) {
    this.uncompletedPageIndex.set(event.pageIndex);
  }
  onCompletedPage(event: { pageIndex: number }) {
    this.completedPageIndex.set(event.pageIndex);
  }

  private firestore = inject(TodoFirestoreService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  constructor() {
    this.firestore.getTodos().subscribe((todos: TodoItem[]) => {
      this.todos.set(todos);
    });
  }

  toggleCompleted(todo: TodoItem) {
    this.firestore.updateTodo(String(todo.id), { completed: !todo.completed })
      .then(() => {
        this.toast.success('已更新完成狀態');
      });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTodoDialog, {
      width: '400px',
      panelClass: 'custom-dialog',
    });
    dialogRef
      .afterClosed()
      .subscribe((result: Omit<TodoItem, 'id'> | undefined) => {
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
    this.todos.update((list) =>
      list.map((t) => ({ ...t, editing: t.id === todo.id }))
    );
    this.editTitle.set(todo.title);
    this.editTag.set(todo.tag);
    this.editPriority.set(todo.priority as TodoPriority);
  }

  saveEdit(todo: TodoItem) {
    if (this.editTitle().trim()) {
      this.todos.update((list) =>
        list.map((t) =>
          t.id === todo.id
            ? {
                ...t,
                title: this.editTitle(),
                tag: this.editTag(),
                priority: this.editPriority(),
                editing: false,
              }
            : t
        )
      );
    }
  }

  cancelEdit(todo: TodoItem) {
    this.todos.update((list) =>
      list.map((t) => (t.id === todo.id ? { ...t, editing: false } : t))
    );
  }

  getPriorityColor(
    priority: TodoPriority
  ): 'primary' | 'accent' | 'warn' | 'default' {
    return PRIORITY_COLORS[priority] as
      | 'primary'
      | 'accent'
      | 'warn'
      | 'default';
  }

  saveEditFromChild(
    todo: TodoItem,
    event: { title: string; tag: TodoTag; priority: TodoPriority }
  ) {
    this.firestore
      .updateTodo(String(todo.id), {
        title: event.title,
        tag: event.tag,
        priority: event.priority,
        editing: false,
      })
      .then(() => {
        this.toast.success('編輯項目成功');
      });
  }
}
