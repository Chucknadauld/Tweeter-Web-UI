import { AuthToken, User } from "tweeter-shared";
import {
  doFailureReportingOperation,
  DisplayToast,
} from "./doFailureReportingOperation";

export async function doAuthenticatedOperation(
  displayToast: DisplayToast,
  setIsLoading: (value: boolean) => void,
  errorMessage: string,
  authOperation: () => Promise<[User, AuthToken]>,
  onSuccess: (user: User, authToken: AuthToken) => void
): Promise<void> {
  setIsLoading(true);
  try {
    const result = await doFailureReportingOperation(
      displayToast,
      errorMessage,
      authOperation
    );
    if (result) {
      onSuccess(result[0], result[1]);
    }
  } finally {
    setIsLoading(false);
  }
}
