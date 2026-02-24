import { ToastType } from "../components/toaster/Toast";

export type DisplayToast = (
  toastType: ToastType,
  message: string,
  duration: number,
  title?: string,
  bootstrapClasses?: string
) => string;

export async function doFailureReportingOperation<T>(
  displayToast: DisplayToast,
  errorMessagePrefix: string,
  operation: () => Promise<T>
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    displayToast(
      ToastType.Error,
      `${errorMessagePrefix} because of exception: ${error}`,
      0
    );
    return null;
  }
}
