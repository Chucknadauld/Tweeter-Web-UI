import { AuthToken, User } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { BaseView } from "./BaseView";

/**
 * View interface for Authentication (Login/Register)
 * Demonstrates interface inheritance from BaseView
 */
export interface AuthenticationView extends BaseView {
  setIsLoading: (isLoading: boolean) => void;
  navigateToFeed: (user: User) => void;
  updateUserInfo: (
    user: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
}

/**
 * Presenter for authentication operations (Login/Register)
 * Demonstrates:
 * - Inheritance (extends Presenter)
 * - Template Method Pattern (authenticateUser method)
 * - Functions as parameters (authenticationOperation)
 */
export class AuthenticationPresenter extends Presenter<AuthenticationView> {
  public constructor(view: AuthenticationView) {
    super(view);
  }

  /**
   * Template method for authentication
   * Demonstrates:
   * - Template method pattern (defines algorithm structure)
   * - Function as parameter (authenticationOperation)
   * - Common structure for Login and Register
   * 
   * This eliminates duplication between Login and Register as described in requirements:
   * "Login and Register have a common structure for authenticating a user and then 
   * instructing the view to navigate somewhere. Use a function with function parameters 
   * to eliminate this duplication."
   */
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
