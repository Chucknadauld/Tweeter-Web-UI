import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FolloweesScroller = () => {
  const loadMoreFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null,
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <UserItemScroller
      loadMoreItems={loadMoreFollowees}
      getUser={getUser}
      featurePath="/followees"
    />
  );
};

export default FolloweesScroller;
