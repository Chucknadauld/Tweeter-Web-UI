import { useContext } from "react";
import { ToastActionsContext } from "../components/toaster/ToastContexts";
import { ToastType } from "../components/toaster/Toast";

const useMessageActions = () => {
  const { displayToast, deleteToast, deleteAllToasts, displayExistingToast } =
    useContext(ToastActionsContext);

  const createInfoMessage = (
    message: string,
    duration: number = 3000,
    title?: string,
  ) => {
    return displayToast(ToastType.Info, message, duration, title);
  };

  const createErrorMessage = (
    message: string,
    duration: number = 0,
    title?: string,
  ) => {
    return displayToast(ToastType.Error, message, duration, title);
  };

  const createSuccessMessage = (
    message: string,
    duration: number = 3000,
    title?: string,
  ) => {
    return displayToast(ToastType.Success, message, duration, title);
  };

  const createWarningMessage = (
    message: string,
    duration: number = 3000,
    title?: string,
  ) => {
    return displayToast(ToastType.Warning, message, duration, title);
  };

  const deleteInfoMessage = (id: string) => {
    deleteToast(id);
  };

  const clearAllMessages = () => {
    deleteAllToasts();
  };

  return {
    createInfoMessage,
    createErrorMessage,
    createSuccessMessage,
    createWarningMessage,
    deleteInfoMessage,
    clearAllMessages,
    displayToast,
    deleteToast,
    deleteAllToasts,
    displayExistingToast,
  };
};

export default useMessageActions;
