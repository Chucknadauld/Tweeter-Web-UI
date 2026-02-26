import { AuthToken, Status } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

export interface PostStatusView extends BaseView {
  clearPost: () => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  public constructor(view: PostStatusView) {
    super(view);
  }

  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    this.view.displayInfoMessage("Posting status...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.performPostStatus(authToken, status);
      this.view.clearPost();
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "Failed to post the status");
  }

  private async performPostStatus(
    authToken: AuthToken,
    status: Status,
  ): Promise<void> {
    // Simulate server call
    await new Promise((f) => setTimeout(f, 2000));
  }
}
