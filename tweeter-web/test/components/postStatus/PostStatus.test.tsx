import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { anything, instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/hooks/useUserInfo";
import "@testing-library/jest-dom";

jest.mock("../../../src/hooks/useUserInfo", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    mockUserInstance = new User("First", "Last", "@alias", "url");
    mockAuthTokenInstance = new AuthToken("token", Date.now());

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with both buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when text field has text", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "Test status");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when text field is cleared", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "Test status");
    expect(postButton).toBeEnabled();

    await user.clear(textField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls presenter's postStatus method with correct parameters when Post Status is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postButton, textField, user } = renderPostStatusAndGetElements();

    await user.type(textField, "Test status");
    await user.click(postButton);

    verify(mockPresenter.postStatus(anything(), anything())).once();
  });
});

const renderPostStatus = () => {
  return render(<PostStatus />);
};

const renderPostStatusAndGetElements = () => {
  const user = userEvent.setup();

  renderPostStatus();

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByPlaceholderText("What's on your mind?");

  return { postButton, clearButton, textField, user };
};
