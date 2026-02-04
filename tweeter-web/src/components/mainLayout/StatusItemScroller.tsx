import { useContext } from "react";
import {
  UserInfoContext,
  UserInfoActionsContext,
} from "../userInfo/UserInfoContexts";
import { AuthToken, Status, User } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useNavigate, useParams } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import StatusItem from "../statusItem/StatusItem";

export const PAGE_SIZE = 10;

interface Props {
  loadMoreItems: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ) => Promise<[Status[], boolean]>;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
  featurePath: string;
}

const StatusItemScroller = (props: Props) => {
  const { displayToast } = useContext(ToastActionsContext);
  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<Status | null>(null);
  const navigate = useNavigate();

  const addItems = (newItems: Status[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const { displayedUser: displayedUserAliasParam } = useParams();

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      props.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    loadMoreItems(null);
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    setLastItem(() => null);
    setHasMoreItems(() => true);
  };

  const loadMoreItems = async (lastItem: Status | null) => {
    try {
      const [newItems, hasMore] = await props.loadMoreItems(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        lastItem,
      );

      setHasMoreItems(() => hasMore);
      setLastItem(() => newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to load status items because of exception: ${error}`,
        0,
      );
    }
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await props.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${props.featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0,
      );
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems(lastItem)}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem
              status={item}
              featurePath={props.featurePath}
              navigateToUser={navigateToUser}
            />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
