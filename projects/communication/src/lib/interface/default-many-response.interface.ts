import { IBaseItem } from './base-item';

export interface IPaginationResponse<T extends IBaseItem> {
  data: T[];
  page: number;
  pageCount: number;
  total: number;
  count: number;
}
