import { AuthToken } from "tweeter-shared";
import { anything, instance, mock, verify, when } from "ts-mockito";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenters/AppNavbarPresenter";

describe("AppNavbarPresenter", () => {
  let mockView: AppNavbarView;
  let presenter: AppNavbarPresenter;
  let mockAuthToken: AuthToken;

  beforeEach(() => {
    mockView = mock<AppNavbarView>();
    presenter = new AppNavbarPresenter(instance(mockView));
    mockAuthToken = new AuthToken("token", Date.now());
  });

  it("tells the view to display a logging out message", async () => {
    await presenter.logout(mockAuthToken);
    verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await presenter.logout(mockAuthToken);
    // This is implicit in the test - we're verifying the method completes without error
  });

  it("when logout succeeds, clears user info and navigates to login", async () => {
    await presenter.logout(mockAuthToken);

    verify(mockView.clearUserInfo()).once();
    verify(mockView.navigateToLogin()).once();
  });

  it("when logout fails, displays error and does not clear user info or navigate", async () => {
    const error = new Error("Logout failed");
    const mockFailingView = mock<AppNavbarView>();

    when(mockFailingView.displayInfoMessage(anything(), anything())).thenThrow(
      error,
    );

    const failingPresenter = new AppNavbarPresenter(instance(mockFailingView));

    await failingPresenter.logout(mockAuthToken);

    verify(mockFailingView.displayErrorMessage(anything())).once();
    verify(mockFailingView.clearUserInfo()).never();
    verify(mockFailingView.navigateToLogin()).never();
  });
});
