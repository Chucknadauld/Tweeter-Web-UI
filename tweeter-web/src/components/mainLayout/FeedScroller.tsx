import { Status } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import { FeedPresenter } from "../../presenters/FeedPresenter";
import StatusItem from "../statusItem/StatusItem";

const FeedScroller = () => {
  return (
    <ItemScroller<Status>
      presenterGenerator={(view) => new FeedPresenter(view)}
      featurePath="/feed"
      itemComponentGenerator={(item) => <StatusItem status={item} />}
    />
  );
};

export default FeedScroller;
