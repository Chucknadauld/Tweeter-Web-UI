import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FollowersScroller = () => {
  const loadMoreFollowers = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null,
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <UserItemScroller
      loadMoreItems={loadMoreFollowers}
      getUser={getUser}
      featurePath="/followers"
    />
  );
};

export default FollowersScroller;
