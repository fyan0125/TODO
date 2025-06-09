import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { TodoItem } from '../models/todo-item.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoFirestoreService {
  private firestore = inject(Firestore);

  getTodos(): any {
    const todosRef = collection(this.firestore, 'todos');
    console.log('getTodos', todosRef);
    return collectionData(todosRef, { idField: 'id' });
  }

  addTodo(todo: Omit<TodoItem, 'id'>): Promise<DocumentReference> {
    const todosRef = collection(this.firestore, 'todos');
    return addDoc(todosRef, todo);
  }

  updateTodo(id: string, data: Partial<TodoItem>): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoDoc, data);
  }

  deleteTodo(id: string): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    return deleteDoc(todoDoc);
  }
}
