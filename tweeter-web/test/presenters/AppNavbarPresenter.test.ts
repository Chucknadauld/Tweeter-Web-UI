import { AuthToken } from "tweeter-shared";
import { instance, mock, verify, when } from "ts-mockito";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenters/AppNavbarPresenter";
import { UserService } from "../../src/services/UserService";

describe("AppNavbarPresenter", () => {
  let mockView: AppNavbarView;
  let mockUserService: UserService;
  let presenter: AppNavbarPresenter;
  let mockAuthToken: AuthToken;

  beforeEach(() => {
    mockView = mock<AppNavbarView>();
    mockUserService = mock<UserService>();
    presenter = new AppNavbarPresenter(
      instance(mockView),
      instance(mockUserService)
    );
    mockAuthToken = new AuthToken("token", Date.now());
  });

  it("tells the view to display a logging out message", async () => {
    when(mockUserService.logout(mockAuthToken)).thenResolve();

    await presenter.logout(mockAuthToken);

    verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    when(mockUserService.logout(mockAuthToken)).thenResolve();

    await presenter.logout(mockAuthToken);

    verify(mockUserService.logout(mockAuthToken)).once();
  });

  it("when logout succeeds, clears info message, clears user info, and navigates to login", async () => {
    when(mockUserService.logout(mockAuthToken)).thenResolve();

    await presenter.logout(mockAuthToken);

    verify(mockView.clearInfoMessage()).once();
    verify(mockView.clearUserInfo()).once();
    verify(mockView.navigateToLogin()).once();
  });

  it("when logout fails, displays error and does not clear info message, clear user info, or navigate", async () => {
    when(mockUserService.logout(mockAuthToken)).thenReject(
      new Error("network error")
    );

    await presenter.logout(mockAuthToken);

    verify(
      mockView.displayErrorMessage(
        "Failed to log user out because of exception: Error: network error"
      )
    ).once();
    verify(mockView.clearInfoMessage()).never();
    verify(mockView.clearUserInfo()).never();
    verify(mockView.navigateToLogin()).never();
  });
});
