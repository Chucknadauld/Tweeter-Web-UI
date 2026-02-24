import { BaseView } from "./BaseView";

/**
 * Base Presenter class that demonstrates:
 * - Template Method Pattern (doFailureReportingOperation)
 * - Inheritance (all presenters extend this)
 * - Composition (has-a View)
 */
export abstract class Presenter<V extends BaseView> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  /**
   * Template method pattern: defines the skeleton of the algorithm
   * Subclasses can override specific steps but the structure remains the same
   */
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

  /**
   * Template method for authenticated operations
   * This demonstrates the template method pattern where the algorithm structure
   * is defined here but specific operations are passed in as parameters
   */
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
