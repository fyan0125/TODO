import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { TodoItem } from '../models/todo-item.model';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class TodoFirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private getUid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('尚未登入，無法操作 TODO');
    return uid;
  }

  getTodos(): any {
    const uid = this.getUid();
    const todosRef = collection(this.firestore, `users/${uid}/todos`);
    return collectionData(todosRef, { idField: 'id' });
  }

  addTodo(todo: Omit<TodoItem, 'id'>): Promise<DocumentReference> {
    const uid = this.getUid();
    const todosRef = collection(this.firestore, `users/${uid}/todos`);
    return addDoc(todosRef, todo);
  }

  updateTodo(id: string, data: Partial<TodoItem>): Promise<void> {
    const uid = this.getUid();
    const todoDoc = doc(this.firestore, `users/${uid}/todos/${id}`);
    return updateDoc(todoDoc, data);
  }

  deleteTodo(id: string): Promise<void> {
    const uid = this.getUid();
    const todoDoc = doc(this.firestore, `users/${uid}/todos/${id}`);
    return deleteDoc(todoDoc);
  }
}
