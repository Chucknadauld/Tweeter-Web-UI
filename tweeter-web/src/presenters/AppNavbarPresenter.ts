import { AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";
import { UserService } from "../services/UserService";

export interface AppNavbarView extends BaseView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private userService: UserService;

  public constructor(view: AppNavbarView, userService: UserService) {
    super(view);
    this.userService = userService;
  }

  public async logout(authToken: AuthToken): Promise<void> {
    this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.performLogout(authToken);
      this.view.clearInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "Failed to log user out");
  }

  private async performLogout(authToken: AuthToken): Promise<void> {
    await this.userService.logout(authToken);
  }
}
