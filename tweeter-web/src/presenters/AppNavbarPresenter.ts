import { AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

export interface AppNavbarView extends BaseView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  public constructor(view: AppNavbarView) {
    super(view);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.performLogout(authToken);
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "Failed to log user out");
  }

  private async performLogout(authToken: AuthToken): Promise<void> {
    // Simulate server call
    await new Promise((res) => setTimeout(res, 1000));
  }
}
