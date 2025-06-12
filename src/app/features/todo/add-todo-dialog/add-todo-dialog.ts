import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TodoTag, TodoPriority } from '../../../core/enums/todo.enums';

@Component({
  selector: 'app-add-todo-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './add-todo-dialog.html',
  styleUrls: ['./add-todo-dialog.scss'],
})
export class AddTodoDialog {
  title = signal('');
  tag = signal<TodoTag>(TodoTag.Work);
  priority = signal<TodoPriority>(TodoPriority.Medium);

  private dialogRef = inject(MatDialogRef<AddTodoDialog>);

  submit() {
    if (this.title().trim()) {
      this.dialogRef.close({
        title: this.title(),
        tag: this.tag(),
        priority: this.priority(),
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
