import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../../../src/components/authentication/login/Login";
import { MemoryRouter } from "react-router-dom";
import { instance, mock, verify } from "ts-mockito";
import { AuthenticationPresenter } from "../../../../src/presenters/AuthenticationPresenter";
import "@testing-library/jest-dom";

describe("Login Component", () => {
  it("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables sign-in button when alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "@testuser");
    await user.type(passwordField, "password");

    expect(signInButton).toBeEnabled();
  });

  it("disables sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "@testuser");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
  });

  it("calls presenter's login method with correct parameters when sign-in is pressed", async () => {
    const mockPresenter = mock<AuthenticationPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalHook = jest.requireActual(
      "../../../../src/hooks/useAuthenticationPresenter",
    );
    jest
      .spyOn(originalHook, "useAuthenticationPresenter")
      .mockReturnValue(mockPresenterInstance);

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "@testuser");
    await user.type(passwordField, "password");
    await user.click(signInButton);

    verify(mockPresenter.authenticateUser(anything(), anything())).once();
  });
});

const renderLogin = (originalUrl: string) => {
  return render(
    <MemoryRouter>
      <Login originalUrl={originalUrl} />
    </MemoryRouter>,
  );
};

const renderLoginAndGetElements = (originalUrl: string) => {
  const user = userEvent.setup();

  renderLogin(originalUrl);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("Alias");
  const passwordField = screen.getByLabelText("Password");

  return { signInButton, aliasField, passwordField, user };
};
