import { AuthToken, User, FakeData } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export class FollowersPresenter extends PagedItemPresenter<User> {
  public constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(this.lastItem, pageSize, userAlias);
  }

  protected getItemDescription(): string {
    return "load followers";
  }
}
