import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpContext,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';

// TODO: 根據專案實際需求設計
export interface ApiRequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  skipLoading?: boolean;
  skipRefresh?: boolean;
  skipResponseInterceptor?: boolean;
  replaceUrlParams?: string[];
  context?: HttpContext;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  // 可根據專案需求注入 loading/toast/auth 等服務

  /** GET 請求 */
  get<T>(
    url: string,
    params?: ApiRequestConfig['params'],
    config?: ApiRequestConfig
  ): Observable<T> {
    const { url: finalUrl, params: finalParams } = this.replaceUrlParams(
      url,
      params,
      config
    );
    return this.http
      .get<T>(finalUrl, {
        ...config,
        params: finalParams,
        headers: new HttpHeaders(config?.headers || {}),
      })
      .pipe(catchError(this.handleError));
  }

  /** POST 請求 */
  post<T, D = any>(
    url: string,
    data?: D,
    config?: ApiRequestConfig
  ): Observable<T> {
    const { url: finalUrl, params: finalParams } = this.replaceUrlParams(
      url,
      config?.params,
      config
    );
    let body: any = data;
    if (config?.headers?.['Content-Type'] === 'multipart/form-data') {
      body = this.objectToFormdata(data || {});
    }
    return this.http
      .post<T>(finalUrl, body, {
        ...config,
        params: finalParams,
        headers: new HttpHeaders(config?.headers || {}),
      })
      .pipe(catchError(this.handleError));
  }

  /** PUT 請求 */
  put<T, D = any>(
    url: string,
    data?: D,
    config?: ApiRequestConfig
  ): Observable<T> {
    const { url: finalUrl, params: finalParams } = this.replaceUrlParams(
      url,
      config?.params,
      config
    );
    return this.http
      .put<T>(finalUrl, data, {
        ...config,
        params: finalParams,
        headers: new HttpHeaders(config?.headers || {}),
      })
      .pipe(catchError(this.handleError));
  }

  /** DELETE 請求 */
  delete<T>(url: string, config?: ApiRequestConfig): Observable<T> {
    const { url: finalUrl, params: finalParams } = this.replaceUrlParams(
      url,
      config?.params,
      config
    );
    return this.http
      .delete<T>(finalUrl, {
        ...config,
        params: finalParams,
        headers: new HttpHeaders(config?.headers || {}),
      })
      .pipe(catchError(this.handleError));
  }

  /** 動態參數替換 */
  private replaceUrlParams(
    url: string,
    params?: Record<string, any>,
    config?: ApiRequestConfig
  ) {
    let finalUrl = url;
    const finalParams = { ...params };
    if (config?.replaceUrlParams) {
      config.replaceUrlParams.forEach((key) => {
        if (finalParams?.[key]) {
          finalUrl = finalUrl.replace(
            `{${key}}`,
            encodeURIComponent(finalParams[key])
          );
          delete finalParams[key];
        } else {
          throw new Error(`Missing parameter for URL replacement: ${key}`);
        }
      });
    }
    return { url: finalUrl, params: finalParams };
  }

  /** 物件轉FormData */
  objectToFormdata(data: Record<string, unknown>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof Blob) {
            formData.append(`${key}`, item, (item as File).name || undefined);
          } else {
            formData.append(`${key}`, JSON.stringify(item));
          }
        });
      } else if (value instanceof Blob) {
        formData.append(key, value, (value as File).name || undefined);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    });
    return formData;
  }

  /** 錯誤處理，可根據專案需求擴充 */
  private handleError = (error: HttpErrorResponse) => {
    this.toast.error(error?.error?.message || error.message || 'API 請求失敗', 'API Error');
    return throwError(() => error);
  };

  // 新增/編輯成功時呼叫此方法顯示toast
  showSuccess(message: string) {
    this.toast.success(message, '操作成功');
  }
}
