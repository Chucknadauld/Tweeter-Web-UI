import { AuthToken, User, FakeData } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export class FollowersPresenter extends PagedItemPresenter<User> {
  constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected async getLoadMoreItems(
    _authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }
}
