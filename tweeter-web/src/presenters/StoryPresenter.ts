import { AuthToken, Status, FakeData } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export class StoryPresenter extends PagedItemPresenter<Status> {
  constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected async getLoadMoreItems(
    _authToken: AuthToken,
    _userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
}
