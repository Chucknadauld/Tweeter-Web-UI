import { User } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import { FolloweesPresenter } from "../../presenters/FolloweesPresenter";
import UserItem from "../userItem/UserItem";

const FolloweesScroller = () => {
  return (
    <ItemScroller<User>
      presenterGenerator={(view) => new FolloweesPresenter(view)}
      featurePath="/followees"
      itemComponentGenerator={(item) => <UserItem user={item} />}
    />
  );
};

export default FolloweesScroller;