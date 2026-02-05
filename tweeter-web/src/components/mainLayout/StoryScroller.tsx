import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

const StoryScroller = () => {
  const loadMoreStory = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null,
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastStatus, pageSize);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ) => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <StatusItemScroller
      loadMoreItems={loadMoreStory}
      getUser={getUser}
      featurePath="/story"
    />
  );
};

export default StoryScroller;
