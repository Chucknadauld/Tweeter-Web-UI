import { AuthToken, Status, User } from "tweeter-shared";
import { anything, instance, mock, verify, when } from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let mockAuthToken: AuthToken;
  let mockStatus: Status;
  let mockUser: User;

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    presenter = new PostStatusPresenter(instance(mockView));
    mockAuthToken = new AuthToken("token", Date.now());
    mockUser = new User("First", "Last", "@alias", "url");
    mockStatus = new Status("Test post", mockUser, Date.now());
  });

  it("tells the view to display a posting status message", async () => {
    await presenter.postStatus(mockAuthToken, mockStatus);
    verify(mockView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with correct parameters", async () => {
    await presenter.postStatus(mockAuthToken, mockStatus);
    // Implicit verification - method completes successfully
  });

  it("when posting succeeds, clears post and displays status posted message", async () => {
    await presenter.postStatus(mockAuthToken, mockStatus);

    verify(mockView.clearPost()).once();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("when posting fails, displays error and does not clear post or show success", async () => {
    const error = new Error("Post failed");
    const mockFailingView = mock<PostStatusView>();

    when(mockFailingView.displayInfoMessage(anything(), anything())).thenThrow(
      error,
    );

    const failingPresenter = new PostStatusPresenter(instance(mockFailingView));

    await failingPresenter.postStatus(mockAuthToken, mockStatus);

    verify(mockFailingView.displayErrorMessage(anything())).once();
    verify(mockFailingView.clearPost()).never();
    verify(mockFailingView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
