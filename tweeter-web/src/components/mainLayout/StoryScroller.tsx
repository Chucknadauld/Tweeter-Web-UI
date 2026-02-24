import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import StatusItem from "../statusItem/StatusItem";

const StoryScroller = () => {
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
      featurePath="/story"
      loadErrorPrefix="Failed to load status items"
      provideNavigateToUser
      itemComponentGenerator={(item, helpers) => (
        <StatusItem
          status={item}
          featurePath="/story"
          navigateToUser={helpers!.navigateToUser}
        />
      )}
    />
  );
};

export default StoryScroller;
