import { AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

export interface PagedItemView<T> extends BaseView {
  addItems: (newItems: T[]) => void;
  setHasMoreItems: (hasMore: boolean) => void;
  setLastItem: (item: T | null) => void;
  getLastItem: () => T | null;
}

export abstract class PagedItemPresenter<T> extends Presenter<PagedItemView<T>> {
  protected constructor(view: PagedItemView<T>) {
    super(view);
  }

  protected abstract getLoadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ): Promise<[T[], boolean]>;

  reset(): void {}

  async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number
  ): Promise<void> {
    const lastItem = this.view.getLastItem();
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getLoadMoreItems(
        authToken,
        userAlias,
        pageSize,
        lastItem
      );
      this.view.setHasMoreItems(hasMore);
      this.view.setLastItem(newItems.at(-1) ?? null);
      this.view.addItems(newItems);
    }, "Failed to load items");
  }
}
