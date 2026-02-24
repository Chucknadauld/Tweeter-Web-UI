import { Status } from "tweeter-shared";
import UserItemRow from "../userItem/UserItemRow";
import Post from "./Post";

interface Props {
  status: Status;
}

const StatusItem = (props: Props) => {
  return (
    <UserItemRow user={props.status.user}>
      {props.status.formattedDate}
      <br />
      <Post status={props.status} />
    </UserItemRow>
  );
};

export default StatusItem;
