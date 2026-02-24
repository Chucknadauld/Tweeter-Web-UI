import { BaseView } from "./BaseView";

export abstract class Presenter<V extends BaseView> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    errorMessagePrefix: string
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `${errorMessagePrefix} because of exception: ${error}`
      );
    }
  }

  protected async doAuthenticatedOperation<T>(
    operation: () => Promise<T>,
    errorMessagePrefix: string,
    onSuccess: (result: T) => void
  ): Promise<void> {
    try {
      const result = await operation();
      onSuccess(result);
    } catch (error) {
      this.view.displayErrorMessage(
        `${errorMessagePrefix} because of exception: ${error}`
      );
    }
  }
}
