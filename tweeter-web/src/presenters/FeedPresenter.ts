import { AuthToken, Status, FakeData } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export class FeedPresenter extends PagedItemPresenter<Status> {
  constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected getLoadMoreItemsOperation(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ) => Promise<[Status[], boolean]> {
    return async (authToken, userAlias, pageSize, lastItem) =>
      FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
}
