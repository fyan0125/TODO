import { Component, input, output, EventEmitter, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TagComponent } from '../../../shared/components/tag/tag';
import { TodoTag, TodoPriority } from '../../../core/enums/todo.enums';
import { TodoItem } from '../../../core/models/todo-item.model';

@Component({
  selector: 'app-todo-item',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    TagComponent,
  ],
  templateUrl: './todo-item.html',
  styleUrls: ['./todo-item.scss'],
})
export class TodoItemComponent {
  todo = input.required<TodoItem>();
  priorityColor = input<'primary' | 'accent' | 'warn' | 'default'>('default');
  editMode = signal(false);
  editTitle = signal('');
  editTag = signal<TodoTag>(TodoTag.Work);
  editPriority = signal<TodoPriority>(TodoPriority.Medium);

  tagOptions = [TodoTag.Work, TodoTag.Personal, TodoTag.Family];
  priorityOptions = [TodoPriority.High, TodoPriority.Medium, TodoPriority.Low];

  onToggleCompleted = output<TodoItem>();
  onDelete = output<void>();
  onSave = output<{ title: string; tag: TodoTag; priority: TodoPriority }>();

  startEdit() {
    this.editMode.set(true);
    this.editTitle.set(this.todo().title);
    this.editTag.set(this.todo().tag);
    this.editPriority.set(this.todo().priority);
  }
  cancelEdit() {
    this.editMode.set(false);
  }
  saveEdit() {
    if (this.editTitle().trim()) {
      this.onSave.emit({
        title: this.editTitle(),
        tag: this.editTag(),
        priority: this.editPriority(),
      });
      this.editMode.set(false);
    }
  }
  toggleCompleted() {
    this.onToggleCompleted.emit(this.todo());
  }
  delete() {
    this.onDelete.emit();
  }
  onTitleInput(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.editTitle.set(value);
  }
}
