/* @flow */

export interface KeyboardAwareInterface {
  getScrollResponder: () => void;
  scrollToPosition: (x: number, y: number, animated?: boolean) => void;
  scrollToEnd: (animated?: boolean) => void;
  scrollForExtraHeightOnAndroid: (extraHeight: number) => void;
  scrollToFocusedInput: (
    reactNode: Object,
    extraHeight: number,
    keyboardOpeningTime: number
  ) => void
}
