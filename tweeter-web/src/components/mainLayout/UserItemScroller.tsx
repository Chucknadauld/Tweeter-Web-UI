import { useContext } from "react";
import {
  UserInfoContext,
  UserInfoActionsContext,
} from "../userInfo/UserInfoContexts";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useParams } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import UserItem from "../userItem/UserItem";

export const PAGE_SIZE = 10;

interface Props {
  loadMoreItems: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ) => Promise<[User[], boolean]>;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
  featurePath: string;
}

const UserItemScroller = (props: Props) => {
  const { displayToast } = useContext(ToastActionsContext);
  const [items, setItems] = useState<User[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<User | null>(null);

  const addItems = (newItems: User[]) =>
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

  const loadMoreItems = async (lastItem: User | null) => {
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
        `Failed to load users because of exception: ${error}`,
        0,
      );
    }
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
            <UserItem user={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
