import {
  inject,
  Injectable,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { TodoItem } from '../models/todo-item.model';
import { map, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class TodoFirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private loading = inject(LoadingService);
  private injector = inject(EnvironmentInjector);

  /**
   * 取得目前使用者的 todos 資料串流。
   *
   * Angular 20+ 與 AngularFire 要求所有 Firebase API 必須在 Angular DI context 下呼叫，
   * 否則會出現「Calling Firebase APIs outside of an Injection context」警告。
   *
   * 由於 collectionData 是 Observable，subscribe 時才會真正執行 collection(...)，
   * 這時 context 可能已經不是 Angular zone，因此必須用 runInInjectionContext 包裹，
   * 確保每次呼叫 Firebase API 都在正確的 DI context 內。
   *
   * 參考：https://github.com/angular/angularfire/blob/main/docs/zones.md
   */
  getTodos(): Observable<TodoItem[]> {
    return runInInjectionContext(this.injector, () => {
      const uid = this.getUid();
      const todosRef = collection(this.firestore, `users/${uid}/todos`);
      return collectionData(todosRef, { idField: 'id' }).pipe(
        map((data) =>
          data.map((item) => ({ ...item, id: item.id } as TodoItem))
        )
      );
    });
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
