import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ToastActionsContext } from "../../toaster/ToastContexts";
import { UserInfoActionsContext } from "../../userInfo/UserInfoContexts";
import AuthenticationFields from "../AuthenticationFields";
import { AuthenticationPresenter, AuthenticationView } from "../../../presenters/AuthenticationPresenter";
import { ToastType } from "../../toaster/Toast";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [presenter] = useState(() => {
    const view: AuthenticationView = {
      setIsLoading: setIsLoading,
      navigateToFeed: (user: User) => {
        navigate(props.originalUrl ?? `/feed/${user.alias}`);
      },
      updateUserInfo: (user: User, authToken: AuthToken, rememberMe: boolean) => {
        updateUserInfo(user, user, authToken, rememberMe);
      },
      displayErrorMessage: (message: string) => {
        displayToast(ToastType.Error, message, 0);
      },
      displayInfoMessage: (message: string, duration: number = 3000) => {
        displayToast(ToastType.Info, message, duration);
      },
    };
    return new AuthenticationPresenter(view);
  });

  const navigate = useNavigate();
  const { updateUserInfo } = useContext(UserInfoActionsContext);
  const { displayToast } = useContext(ToastActionsContext);

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    await presenter.authenticateUser(
      () => login(alias, password),
      rememberMe,
      props.originalUrl
    );
  };

  const login = async (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> => {
    const user = FakeData.instance.firstUser;
    if (user === null) throw new Error("Invalid alias or password");
    return [user, FakeData.instance.authToken];
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        setAlias={setAlias}
        setPassword={setPassword}
        onEnter={loginOnEnter}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
