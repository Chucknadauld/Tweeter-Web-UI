import { AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

export interface PagedItemView<T> extends BaseView {
  addItems: (items: T[]) => void;
  setHasMoreItems: (hasMore: boolean) => void;
  setLastItem: (item: T | null) => void;
}

export abstract class PagedItemPresenter<T> extends Presenter<PagedItemView<T>> {
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;

  protected constructor(view: PagedItemView<T>) {
    super(view);
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
    this.view.setHasMoreItems(value);
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
    this.view.setLastItem(value);
  }

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(
        authToken,
        userAlias,
        pageSize
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number
  ): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
