import { AuthToken, Status, FakeData } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export class StoryPresenter extends PagedItemPresenter<Status> {
  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(this.lastItem, pageSize);
  }

  protected getItemDescription(): string {
    return "load story items";
  }
}
