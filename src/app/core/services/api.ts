import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * 統一API呼叫方法
   * @param method HTTP方法（GET、POST、PUT、DELETE...）
   * @param path API路徑
   * @param params 查詢參數或body
   */
  request<T>(method: string, path: string, params?: any): Observable<T> {
    // 目前僅回傳空資料，未串接API
    return of({} as T);
  }
}
