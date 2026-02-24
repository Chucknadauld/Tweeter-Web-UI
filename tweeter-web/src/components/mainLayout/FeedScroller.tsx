import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import StatusItem from "../statusItem/StatusItem";

const FeedScroller = () => {
  const loadMoreItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <ItemScroller<Status>
      loadMoreItems={loadMoreItems}
      getUser={getUser}
      featurePath="/feed"
      loadErrorPrefix="Failed to load status items"
      provideNavigateToUser
      itemComponentGenerator={(item, helpers) => (
        <StatusItem
          status={item}
          featurePath="/feed"
          navigateToUser={helpers!.navigateToUser}
        />
      )}
    />
  );
};

export default FeedScroller;
