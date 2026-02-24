import { AuthToken, FakeData, User } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import UserItem from "../userItem/UserItem";

const FollowersScroller = () => {
  const loadMoreItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <ItemScroller<User>
      loadMoreItems={loadMoreItems}
      getUser={getUser}
      featurePath="/followers"
      loadErrorPrefix="Failed to load users"
      itemComponentGenerator={(item) => (
        <UserItem user={item} featurePath="/followers" />
      )}
    />
  );
};

export default FollowersScroller;
