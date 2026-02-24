import { AuthToken, User, FakeData } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export class FolloweesPresenter extends PagedItemPresenter<User> {
  constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected getLoadMoreItemsOperation(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ) => Promise<[User[], boolean]> {
    return async (authToken, userAlias, pageSize, lastItem) =>
      FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }
}
