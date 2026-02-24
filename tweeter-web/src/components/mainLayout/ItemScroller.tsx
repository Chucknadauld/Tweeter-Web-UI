import { useContext, useState, useEffect } from "react";
import {
  UserInfoContext,
  UserInfoActionsContext,
} from "../userInfo/UserInfoContexts";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useNavigate, useParams } from "react-router-dom";
import { doFailureReportingOperation, DisplayToast } from "../../utils/doFailureReportingOperation";

export const PAGE_SIZE = 10;

export interface ItemScrollerHelpers {
  navigateToUser: (event: React.MouseEvent) => void;
}

interface Props<T> {
  readonly loadMoreItems: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ) => Promise<[T[], boolean]>;
  readonly getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
  readonly featurePath: string;
  readonly itemComponentGenerator: (
    item: T,
    helpers?: ItemScrollerHelpers
  ) => JSX.Element;
  readonly loadErrorPrefix: string;
  readonly provideNavigateToUser?: boolean;
}

function getAliasFromClick(event: React.MouseEvent): string {
  const href = (event.target as HTMLElement).closest("a")?.getAttribute("href") ?? "";
  return href.split("/").filter(Boolean).pop() ?? "";
}

function ItemScroller<T>(props: Props<T>) {
  const { displayToast } = useContext(ToastActionsContext);
  const [items, setItems] = useState<T[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<T | null>(null);

  const addItems = (newItems: T[]) =>
    setItems((prev) => [...prev, ...newItems]);

  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const { displayedUser: displayedUserAliasParam } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser?.alias
    ) {
      props.getUser(authToken, displayedUserAliasParam).then((toUser) => {
        if (toUser) setDisplayedUser(toUser);
      });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    loadMoreItems(null);
  }, [displayedUser]);

  const reset = () => {
    setItems([]);
    setLastItem(null);
    setHasMoreItems(true);
  };

  const loadMoreItems = async (last: T | null) => {
    const result = await doFailureReportingOperation(
      displayToast as DisplayToast,
      props.loadErrorPrefix,
      () =>
        props.loadMoreItems(
          authToken!,
          displayedUser!.alias,
          PAGE_SIZE,
          last
        )
    );
    if (result) {
      const [newItems, hasMore] = result;
      setHasMoreItems(hasMore);
      setLastItem(newItems.at(-1) ?? null);
      addItems(newItems);
    }
  };

  const navigateToUser = (event: React.MouseEvent) => {
    void (async () => {
      event.preventDefault();
      const alias = getAliasFromClick(event);
      const toUser = await doFailureReportingOperation(
        displayToast as DisplayToast,
        "Failed to get user",
        () => props.getUser(authToken!, alias)
      );
      if (toUser && !toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${props.featurePath}/${toUser.alias}`);
      }
    })();
  };

  const helpers: ItemScrollerHelpers | undefined = props.provideNavigateToUser
    ? { navigateToUser }
    : undefined;

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
            {props.itemComponentGenerator(item, helpers)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
