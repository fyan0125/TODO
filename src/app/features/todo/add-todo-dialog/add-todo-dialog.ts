import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-todo-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './add-todo-dialog.html',
  styleUrls: ['./add-todo-dialog.scss']
})
export class AddTodoDialog {
  title = '';
  tag: '工作' | '個人' | '家庭' = '工作';
  priority: '高' | '中' | '低' = '中';

  constructor(private dialogRef: MatDialogRef<AddTodoDialog>) {}

  submit() {
    if (this.title.trim()) {
      this.dialogRef.close({ title: this.title, tag: this.tag, priority: this.priority });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
