import { AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

/**
 * View interface for ItemScroller - extends BaseView
 * Demonstrates interface inheritance
 */
export interface ItemScrollerView extends BaseView {
  setItems: (items: any[]) => void;
  setHasMoreItems: (hasMore: boolean) => void;
  setLastItem: (item: any | null) => void;
}

/**
 * Presenter for ItemScroller component
 * Demonstrates:
 * - Inheritance (extends Presenter)
 * - Generic types (T parameter)
 * - Template method pattern usage (calls parent's methods)
 */
export class ItemScrollerPresenter<T> extends Presenter<ItemScrollerView> {
  private loadMoreItemsOperation: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ) => Promise<[T[], boolean]>;

  public constructor(
    view: ItemScrollerView,
    loadMoreItemsOperation: (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: T | null
    ) => Promise<[T[], boolean]>
  ) {
    super(view);
    this.loadMoreItemsOperation = loadMoreItemsOperation;
  }

  /**
   * Uses the template method pattern from base Presenter
   */
  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.loadMoreItemsOperation(
        authToken,
        userAlias,
        pageSize,
        lastItem
      );

      this.view.setHasMoreItems(hasMore);
      this.view.setLastItem(newItems.at(-1) ?? null);
      this.view.setItems(newItems);
    }, "Failed to load items");
  }
}
