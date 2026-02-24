import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ToastActionsContext } from "../../toaster/ToastContexts";
import { UserInfoActionsContext } from "../../userInfo/UserInfoContexts";
import AuthenticationFields from "../AuthenticationFields";
import { doAuthenticatedOperation } from "../../../utils/doAuthenticatedOperation";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    await doAuthenticatedOperation(
      displayToast,
      setIsLoading,
      "Failed to log user in",
      () => login(alias, password),
      (user: User, authToken: AuthToken) => {
        updateUserInfo(user, user, authToken, rememberMe);
        navigate(props.originalUrl ?? `/feed/${user.alias}`);
      }
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
