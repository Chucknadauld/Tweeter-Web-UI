import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

const FeedScroller = () => {
  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <StatusItemScroller
      loadMoreItems={loadMoreFeedItems}
      getUser={getUser}
      featurePath="/feed"
    />
  );
};

export default FeedScroller;
