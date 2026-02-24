// Base View interface that all view interfaces extend
// This demonstrates inheritance in the view layer
export interface BaseView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration?: number) => void;
}
