import { AuthToken, User } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

export interface AuthenticationView extends BaseView {
  setIsLoading: (isLoading: boolean) => void;
  navigateToFeed: (user: User) => void;
  updateUserInfo: (
    user: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
}

export class AuthenticationPresenter extends Presenter<AuthenticationView> {
  public constructor(view: AuthenticationView) {
    super(view);
  }

  public async authenticateUser(
    authenticationOperation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string
  ): Promise<void> {
    this.view.setIsLoading(true);

    await this.doAuthenticatedOperation(
      authenticationOperation,
      "Failed to authenticate user",
      ([user, authToken]) => {
        this.view.updateUserInfo(user, authToken, rememberMe);
        this.view.navigateToFeed(user);
      }
    );

    this.view.setIsLoading(false);
  }
}
