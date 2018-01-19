// Type definitions for react-native-keyboard-aware-scroll-view
// Project: https://github.com/APSL/react-native-keyboard-aware-scroll-view
// Definitions by: Kyle Roach <https://github.com/iRoachie>
// TypeScript Version: 2.3.2

import * as React from 'react'
import { ScrollViewProperties, ListViewProperties, FlatListProperties } from 'react-native'

interface KeyboardAwareProps {
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
}

interface KeyboardAwareListViewProps
  extends KeyboardAwareProps,
    ListViewProperties {}
interface KeyboardAwareScrollViewProps
  extends KeyboardAwareProps,
    ScrollViewProperties {}
interface KeyboardAwareFlatListProps<ItemT>
  extends KeyboardAwareProps,
    FlatListProperties<ItemT> {}

interface KeyboardAwareState {
  keyboardSpace: number
}

export class KeyboardAwareMixin {}
export class KeyboardAwareListView extends React.Component<
  KeyboardAwareListViewProps,
  KeyboardAwareState
> {}
export class KeyboardAwareScrollView extends React.Component<
  KeyboardAwareScrollViewProps,
  KeyboardAwareState
> {}
export class KeyboardAwareFlatList extends React.Component<
KeyboardAwareFlatListProps<any>,
KeyboardAwareState
> {}
