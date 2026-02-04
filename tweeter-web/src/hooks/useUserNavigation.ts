import { useNavigate } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useMessageActions from "./useMessageActions";
import useUserInfoActions from "./useUserInfoActions";
import useUserInfo from "./useUserInfo";
import { ToastType } from "../components/toaster/Toast";

const useUserNavigation = () => {
  const { displayToast } = useMessageActions();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const navigate = useNavigate();

  const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());
      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0
      );
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  return { navigateToUser };
};

export default useUserNavigation;
