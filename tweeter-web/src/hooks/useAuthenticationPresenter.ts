import { useContext, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { ToastActionsContext } from "../components/toaster/ToastContexts";
import { UserInfoActionsContext } from "../components/userInfo/UserInfoContexts";
import { ToastType } from "../components/toaster/Toast";
import { AuthenticationPresenter, AuthenticationView } from "../presenters/AuthenticationPresenter";

export function useAuthenticationPresenter(
  setIsLoading: (value: boolean) => void,
  originalUrl?: string
) {
  const navigate = useNavigate();
  const { displayToast } = useContext(ToastActionsContext);
  const { updateUserInfo } = useContext(UserInfoActionsContext);
  const displayToastRef = useRef(displayToast);
  const updateUserInfoRef = useRef(updateUserInfo);
  displayToastRef.current = displayToast;
  updateUserInfoRef.current = updateUserInfo;

  const view = useMemo<AuthenticationView>(
    () => ({
      setIsLoading,
      navigateToFeed: (user: User) =>
        navigate(originalUrl ?? `/feed/${user.alias}`),
      updateUserInfo: (user: User, authToken: AuthToken, rememberMe: boolean) =>
        updateUserInfoRef.current(user, user, authToken, rememberMe),
      displayErrorMessage: (message: string) =>
        displayToastRef.current(ToastType.Error, message, 0),
      displayInfoMessage: (message: string, duration: number = 3000) =>
        displayToastRef.current(ToastType.Info, message, duration),
    }),
    [setIsLoading, navigate, originalUrl]
  );

  return useMemo(() => new AuthenticationPresenter(view), [view]);
}
