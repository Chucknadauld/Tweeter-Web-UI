// it should return everything to do with posts (i.e. createinfomessage, deleteinfomessage, createerrormessage, ect.)

import { useContext } from "react";
import { ToastActionsContext } from "../components/toaster/ToastContexts";

const useMessageActions = () => {
  return useContext(ToastActionsContext);
};

export default useMessageActions;
