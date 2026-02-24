import { Status } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import { StoryPresenter } from "../../presenters/StoryPresenter";
import StatusItem from "../statusItem/StatusItem";

const StoryScroller = () => {
  return (
    <ItemScroller<Status>
      presenterGenerator={(view) => new StoryPresenter(view)}
      featurePath="/story"
      itemComponentGenerator={(item) => <StatusItem status={item} />}
    />
  );
};

export default StoryScroller;
