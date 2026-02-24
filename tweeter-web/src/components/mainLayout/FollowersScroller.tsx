import { User } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import { FollowersPresenter } from "../../presenters/FollowersPresenter";
import UserItem from "../userItem/UserItem";

const FollowersScroller = () => {
  return (
    <ItemScroller<User>
      presenterGenerator={(view) => new FollowersPresenter(view)}
      featurePath="/followers"
      itemComponentGenerator={(item) => <UserItem user={item} />}
    />
  );
};

export default FollowersScroller;
