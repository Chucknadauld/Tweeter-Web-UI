import { AuthToken, Status, User } from "tweeter-shared";
import { instance, mock, verify, when } from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { PostStatusService } from "../../src/services/PostStatusService";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let mockPostStatusService: PostStatusService;
  let presenter: PostStatusPresenter;
  let mockAuthToken: AuthToken;
  let mockStatus: Status;
  let mockUser: User;

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    mockPostStatusService = mock<PostStatusService>();
    presenter = new PostStatusPresenter(
      instance(mockView),
      instance(mockPostStatusService)
    );
    mockAuthToken = new AuthToken("token", Date.now());
    mockUser = new User("First", "Last", "@alias", "url");
    mockStatus = new Status("Test post", mockUser, Date.now());
  });

  it("tells the view to display a posting status message", async () => {
    when(mockPostStatusService.postStatus(mockAuthToken, mockStatus)).thenResolve();

    await presenter.postStatus(mockAuthToken, mockStatus);

    verify(mockView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status and auth token", async () => {
    when(mockPostStatusService.postStatus(mockAuthToken, mockStatus)).thenResolve();

    await presenter.postStatus(mockAuthToken, mockStatus);

    verify(mockPostStatusService.postStatus(mockAuthToken, mockStatus)).once();
  });

  it("when posting succeeds, clears info message, clears post, and displays status posted message", async () => {
    when(mockPostStatusService.postStatus(mockAuthToken, mockStatus)).thenResolve();

    await presenter.postStatus(mockAuthToken, mockStatus);

    verify(mockView.clearInfoMessage()).once();
    verify(mockView.clearPost()).once();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("when posting fails, clears info message and displays error but does not clear post or display status posted", async () => {
    when(mockPostStatusService.postStatus(mockAuthToken, mockStatus)).thenReject(
      new Error("server error")
    );

    await presenter.postStatus(mockAuthToken, mockStatus);

    verify(mockView.clearInfoMessage()).once();
    verify(
      mockView.displayErrorMessage(
        "Failed to post the status because of exception: Error: server error"
      )
    ).once();
    verify(mockView.clearPost()).never();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
