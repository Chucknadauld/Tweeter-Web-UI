import { useContext, useState, useEffect, useRef } from "react";
import { UserInfoContext, UserInfoActionsContext } from "../userInfo/UserInfoContexts";
import InfiniteScroll from "react-infinite-scroll-component";
import { User, FakeData } from "tweeter-shared";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useParams } from "react-router-dom";
import { PagedItemPresenter, PagedItemView } from "../../presenters/PagedItemPresenter";
import { ToastType } from "../toaster/Toast";

export const PAGE_SIZE = 10;

interface Props<T> {
  readonly presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T>;
  readonly featurePath: string;
  readonly itemComponentGenerator: (item: T) => JSX.Element;
}

function ItemScroller<T>(props: Props<T>) {
  const { displayToast } = useContext(ToastActionsContext);
  const [items, setItems] = useState<T[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<T | null>(null);
  const [presenter, setPresenter] = useState<PagedItemPresenter<T> | null>(null);
  const lastItemRef = useRef<T | null>(null);
  lastItemRef.current = lastItem;

  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const { displayedUser: displayedUserAliasParam } = useParams();

  useEffect(() => {
    const view: PagedItemView<T> = {
      addItems: (newItems: T[]) => setItems((prev) => [...prev, ...newItems]),
      setHasMoreItems: setHasMoreItems,
      setLastItem: setLastItem,
      getLastItem: () => lastItemRef.current,
      displayErrorMessage: (message: string) => {
        displayToast(ToastType.Error, message, 0);
      },
      displayInfoMessage: (message: string, duration: number = 3000) => {
        displayToast(ToastType.Info, message, duration);
      },
      clearInfoMessage: () => {},
    };

    const newPresenter = props.presenterGenerator(view);
    setPresenter(newPresenter);
  }, []);

  useEffect(() => {
    if (authToken && displayedUserAliasParam && displayedUserAliasParam !== displayedUser?.alias) {
      getUser(displayedUserAliasParam).then((toUser) => {
        if (toUser) setDisplayedUser(toUser);
      });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    if (presenter && authToken && displayedUser) {
      loadMoreItems();
    }
  }, [displayedUser, presenter]);

  const getUser = async (alias: string): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  const reset = () => {
    setItems([]);
    setLastItem(null);
    setHasMoreItems(true);
    if (presenter) {
      presenter.reset();
    }
  };

  const loadMoreItems = async () => {
    if (presenter && authToken && displayedUser) {
      await presenter.loadMoreItems(authToken, displayedUser.alias, PAGE_SIZE);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
