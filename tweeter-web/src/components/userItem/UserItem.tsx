import { User } from "tweeter-shared";
import { Link } from "react-router-dom";

interface Props {
  user: User;
}

const UserItem = (props: Props) => {
  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              - <Link to={props.user.alias}>{props.user.alias}</Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
