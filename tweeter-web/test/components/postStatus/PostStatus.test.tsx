import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { AuthToken, Status, User } from "tweeter-shared";
import useUserInfo from "../../../src/hooks/useUserInfo";
import { usePostStatusPresenter } from "../../../src/hooks/usePostStatusPresenter";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("../../../src/hooks/useUserInfo", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../src/hooks/usePostStatusPresenter", () => ({
  usePostStatusPresenter: jest.fn(),
}));

jest.mock("../../../src/components/toaster/ToastContexts", () => {
  const React = require("react");
  return {
    ToastActionsContext: React.createContext({
      displayToast: jest.fn(() => "mock-toast-id"),
      deleteToast: jest.fn(),
      deleteAllToasts: jest.fn(),
      displayExistingToast: jest.fn(),
    }),
  };
});

describe("PostStatus Component", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;
  let mockPostStatus: jest.Mock;

  beforeAll(() => {
    mockUserInstance = new User("First", "Last", "@alias", "url");
    mockAuthTokenInstance = new AuthToken("token", Date.now());
    mockPostStatus = jest.fn().mockResolvedValue(undefined);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });

    (usePostStatusPresenter as jest.Mock).mockReturnValue({
      postStatus: mockPostStatus,
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

    await waitFor(() => {
      expect(postButton).toBeEnabled();
      expect(clearButton).toBeEnabled();
    });
  });

  it("disables both buttons when text field is cleared", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "Test status");

    await waitFor(() => {
      expect(postButton).toBeEnabled();
    });

    await user.clear(textField);

    await waitFor(() => {
      expect(postButton).toBeDisabled();
      expect(clearButton).toBeDisabled();
    });
  });

  it("calls presenter's postStatus with correct parameters when Post Status button is pressed", async () => {
    const { postButton, textField, user } = renderPostStatusAndGetElements();

    await user.type(textField, "My post text");
    await user.click(postButton);

    await waitFor(() => {
      expect(mockPostStatus).toHaveBeenCalledTimes(1);
      const [authToken, status] = mockPostStatus.mock.calls[0];
      expect(authToken).toBe(mockAuthTokenInstance);
      expect(status).toBeInstanceOf(Status);
      expect(status.post).toBe("My post text");
      expect(status.user).toBe(mockUserInstance);
    });
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
