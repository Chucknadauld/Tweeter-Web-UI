import { AuthToken, Status } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";
import { PostStatusService } from "../services/PostStatusService";

export interface PostStatusView extends BaseView {
  clearPost: () => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private postStatusService: PostStatusService;

  public constructor(view: PostStatusView, postStatusService: PostStatusService) {
    super(view);
    this.postStatusService = postStatusService;
  }

  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    this.view.displayInfoMessage("Posting status...", 0);

    try {
      await this.performPostStatus(authToken, status);
      this.view.clearInfoMessage();
      this.view.clearPost();
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.clearInfoMessage();
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    }
  }

  private async performPostStatus(
    authToken: AuthToken,
    status: Status
  ): Promise<void> {
    await this.postStatusService.postStatus(authToken, status);
  }
}
