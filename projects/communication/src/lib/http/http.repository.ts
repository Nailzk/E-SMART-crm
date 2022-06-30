import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBaseItem, IPaginationResponse } from '../interface';
import { Repository } from './repository';

@Injectable()
export class HttpRepository<T extends IBaseItem> extends Repository<T> {
  protected _httpOptions: any = {
    withCredentials: true,
  };

  constructor(@Inject(HttpClient) protected readonly _http: HttpClient) {
    super();
  }

  protected get _baseUrl(): string {
    throw new Error(`Implement _baseUrl for ${this.constructor.name}`);
  }

  public getItems(params?: any): Observable<IPaginationResponse<T>> {
    const httpParams = new HttpParams({ fromObject: params });

    return this._http
      .get<IPaginationResponse<T>>(this._baseUrl, { ...this._httpOptions, params: httpParams })
      .pipe(map(this._transformEventResponse), map(this.transform));
  }

  public deleteItem(id: number): Observable<void> {
    return this._http
      .delete<void>(`${this._baseUrl}/${id}`, { ...this._httpOptions })
      .pipe(map(this._transformEventResponse));
  }

  public patchItem(item: Partial<T>): Observable<T> {
    if (!item?.id) {
      throw new Error(`Provide id for patch item ${this.constructor.name}`);
    }

    return this._http
      .patch<T>(`${this._baseUrl}/${item.id}`, item, { ...this._httpOptions })
      .pipe(map(this._transformEventResponse));
  }

  public createItem(item: T): Observable<T> {
    return this._http.post(this._baseUrl, item, { ...this._httpOptions }).pipe(map(this._transformEventResponse));
  }

  protected transform(item: IPaginationResponse<T>): any {
    return item;
  }

  private _transformEventResponse = (item: any): any => item;
}
