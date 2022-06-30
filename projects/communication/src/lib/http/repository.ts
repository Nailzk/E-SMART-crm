import { Observable } from 'rxjs';
import { IBaseItem, IPaginationResponse } from '../interface';

export abstract class Repository<T extends IBaseItem> {
  abstract getItems(params?: any): Observable<IPaginationResponse<T>>;
  abstract deleteItem(id: number): Observable<void>;
  abstract patchItem(item: Partial<T>): Observable<T>;
  abstract createItem(item: T): Observable<T>;
}
