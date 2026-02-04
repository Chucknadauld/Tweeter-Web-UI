import { useContext } from "react";
import { ToastActionsContext } from "../components/toaster/ToastContexts";

const useMessageActions = () => {
  return useContext(ToastActionsContext);
};

export default useMessageActions;
