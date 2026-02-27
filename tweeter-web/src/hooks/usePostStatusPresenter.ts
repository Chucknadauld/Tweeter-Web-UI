import { useMemo } from "react";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../presenters/PostStatusPresenter";
import { PostStatusService } from "../services/PostStatusService";
import { PostStatusServiceImpl } from "../services/PostStatusServiceImpl";

const defaultService = new PostStatusServiceImpl();

export function usePostStatusPresenter(
  view: PostStatusView,
  postStatusService?: PostStatusService
) {
  const service = postStatusService ?? defaultService;
  return useMemo(
    () => new PostStatusPresenter(view, service),
    [view, service]
  );
}
