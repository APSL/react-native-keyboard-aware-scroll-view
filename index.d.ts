// Type definitions for react-native-keyboard-aware-scroll-view
// Project: https://github.com/APSL/react-native-keyboard-aware-scroll-view
// Definitions by: Kyle Roach <https://github.com/iRoachie>
// TypeScript Version: 2.3.2

import * as React from 'react'
import {
  ScrollViewProps,
  FlatListProps,
  SectionListProps,
  ViewProps
} from 'react-native'

interface KeyboardAwareProps {
  /**
   * Catches the reference of the component.
   *
   *
   * @type {function}
   * @memberof KeyboardAwareProps
   */
  innerRef?: (ref: JSX.Element) => void
  /**
   * Adds an extra offset that represents the TabBarIOS height.
   *
   * Default is false
   * @type {boolean}
   * @memberof KeyboardAwareProps
   */
  viewIsInsideTabBar?: boolean

  /**
   * Coordinates that will be used to reset the scroll when the keyboard hides.
   *
   * @type {{
   *         x: number,
   *         y: number
   *     }}
   * @memberof KeyboardAwareProps
   */
  resetScrollToCoords?: {
    x: number
    y: number
  }

  /**
   * Lets the user enable or disable automatic resetScrollToCoords
   *
   * @type {boolean}
   * @memberof KeyboardAwareProps
   */
  enableResetScrollToCoords?: boolean

  /**
   * When focus in TextInput will scroll the position
   *
   * Default is true
   *
   * @type {boolean}
   * @memberof KeyboardAwareProps
   */

  enableAutomaticScroll?: boolean
  /**
   * Enables keyboard aware settings for Android
   *
   * Default is false
   *
   * @type {boolean}
   * @memberof KeyboardAwareProps
   */
  enableOnAndroid?: boolean

  /**
   * Adds an extra offset when focusing the TextInputs.
   *
   * Default is 75
   * @type {number}
   * @memberof KeyboardAwareProps
   */
  extraHeight?: number

  /**
   * Adds an extra offset to the keyboard.
   * Useful if you want to stick elements above the keyboard.
   *
   * Default is 0
   *
   * @type {number}
   * @memberof KeyboardAwareProps
   */
  extraScrollHeight?: number

  /**
   * Sets the delay time before scrolling to new position
   *
   * Default is 250
   *
   * @type {number}
   * @memberof KeyboardAwareProps
   */
  keyboardOpeningTime?: number

  /**
   * Callback when the keyboard will show.
   *
   * @param frames Information about the keyboard frame and animation.
   */
  onKeyboardWillShow?: (frames: Object) => void

  /**
   * Callback when the keyboard did show.
   *
   * @param frames Information about the keyboard frame and animation.
   */
  onKeyboardDidShow?: (frames: Object) => void

  /**
   * Callback when the keyboard will hide.
   *
   * @param frames Information about the keyboard frame and animation.
   */
  onKeyboardWillHide?: (frames: Object) => void

  /**
   * Callback when the keyboard did hide.
   *
   * @param frames Information about the keyboard frame and animation.
   */
  onKeyboardDidHide?: (frames: Object) => void

  /**
   * Callback when the keyboard frame will change.
   *
   * @param frames Information about the keyboard frame and animation.
   */
  onKeyboardWillChangeFrame?: (frames: Object) => void

  /**
   * Callback when the keyboard frame did change.
   *
   * @param frames Information about the keyboard frame and animation.
   */
  onKeyboardDidChangeFrame?: (frames: Object) => void
}

interface KeyboardAwareScrollViewProps
  extends KeyboardAwareProps,
    ScrollViewProps {}
interface KeyboardAwareFlatListProps<ItemT>
  extends KeyboardAwareProps,
    FlatListProps<ItemT> {}
interface KeyboardAwareSectionListProps<ItemT>
  extends KeyboardAwareProps,
    SectionListProps<ItemT> {}

interface KeyboardAwareState {
  keyboardSpace: number
}

declare class ScrollableComponent<P, S> extends React.Component<P, S> {
  getScrollResponder: () => void
  scrollToPosition: (x: number, y: number, animated?: boolean) => void
  scrollToEnd: (animated?: boolean) => void
  scrollForExtraHeightOnAndroid: (extraHeight: number) => void
  scrollToFocusedInput: (
    reactNode: Object,
    extraHeight?: number,
    keyboardOpeningTime?: number
  ) => void
}

export function listenToKeyboardEvents (options: any): (
  (ScrollableComponent: React$Component, userOptions?: KeyboardAwareHOCOptions = {}) =>
    typeof React.Component<KeyboardAwareHOCProps, KeyboardAwareHOCState>
  );

export class KeyboardAwareMixin {}
export class KeyboardAwareScrollView extends ScrollableComponent<
  KeyboardAwareScrollViewProps,
  KeyboardAwareState
> {}
export class KeyboardAwareFlatList extends ScrollableComponent<
  KeyboardAwareFlatListProps<any>,
  KeyboardAwareState
> {}
export class KeyboardAwareSectionList extends ScrollableComponent<
  KeyboardAwareSectionListProps<any>,
  KeyboardAwareState
> {}

export type KeyboardAwareHOCOptions = ?{
  enableOnAndroid: boolean,
  contentContainerStyle: ?Object,
  enableAutomaticScroll: boolean,
  extraHeight: number,
  extraScrollHeight: number,
  enableResetScrollToCoords: boolean,
  keyboardOpeningTime: number,
  viewIsInsideTabBar: boolean,
  refPropName: string,
  extractNativeRef: Function
}

export type KeyboardAwareHOCProps = ScrollViewProps & {
  viewIsInsideTabBar?: boolean,
  resetScrollToCoords?: {
    x: number,
    y: number
  },
  enableResetScrollToCoords?: boolean,
  enableAutomaticScroll?: boolean,
  extraHeight?: number,
  extraScrollHeight?: number,
  keyboardOpeningTime?: number,
  onScroll?: Function,
  update?: Function,
  contentContainerStyle?: any,
  enableOnAndroid?: boolean,
  innerRef?: Function,
  onKeyboardWillShow?: Function,
  onKeyboardDidShow?: Function,
  onKeyboardWillHide?: Function,
  onKeyboardDidHide?: Function,
  onKeyboardWillChangeFrame?: Function,
  onKeyboardDidChangeFrame?: Function,
}

export type KeyboardAwareHOCState = {
  keyboardSpace: number
}
