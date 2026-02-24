import { User } from "tweeter-shared";
import UserItemRow from "./UserItemRow";

interface Props {
  user: User;
}

const UserItem = (props: Props) => {
  return <UserItemRow user={props.user} />;
};

export default UserItem;
