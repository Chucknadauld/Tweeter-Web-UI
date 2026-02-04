import { useContext } from "react";
import { ToastListContext } from "../components/toaster/ToastContexts";

const useMessageList = () => {
  return useContext(ToastListContext);
};

export default useMessageList;
