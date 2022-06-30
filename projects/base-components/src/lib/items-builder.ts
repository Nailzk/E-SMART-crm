import { IBaseItem } from 'communication';

export class ItemsBuilder<T extends IBaseItem> {
  private _items: T[] = [];

  private _item: T;

  get items(): T[] {
    return this._items;
  }

  get item(): T {
    return this._item;
  }

  replaceItem(item: T) {
    this._item = item;
  }

  replaceItems(items: T[]) {
    this._items = items;
  }
}
