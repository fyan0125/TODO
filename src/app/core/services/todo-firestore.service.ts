import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { TodoItem } from '../models/todo-item.model';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class TodoFirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private loading = inject(LoadingService);

  getTodos(): any {
    const uid = this.getUid();
    const todosRef = collection(this.firestore, `users/${uid}/todos`);
    return collectionData(todosRef, { idField: 'id' });
  }

  async addTodo(todo: Omit<TodoItem, 'id'>): Promise<DocumentReference> {
    this.loading.show();
    try {
      const uid = this.getUid();
      const todosRef = collection(this.firestore, `users/${uid}/todos`);
      return await addDoc(todosRef, todo);
    } finally {
      this.loading.hide();
    }
  }

  async updateTodo(id: string, data: Partial<TodoItem>): Promise<void> {
    this.loading.show();
    try {
      const uid = this.getUid();
      const todoDoc = doc(this.firestore, `users/${uid}/todos/${id}`);
      return await updateDoc(todoDoc, data);
    } finally {
      this.loading.hide();
    }
  }

  async deleteTodo(id: string): Promise<void> {
    this.loading.show();
    try {
      const uid = this.getUid();
      const todoDoc = doc(this.firestore, `users/${uid}/todos/${id}`);
      return await deleteDoc(todoDoc);
    } finally {
      this.loading.hide();
    }
  }

  private getUid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('尚未登入，無法操作 TODO');
    return uid;
  }
}
