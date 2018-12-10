/* @flow */

import * as React from 'react'
import PropTypes from 'prop-types'
import ReactNative, {
  Keyboard,
  Platform,
  UIManager,
  TextInput,
  findNodeHandle,
  Animated,
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import type { KeyboardAwareInterface } from './KeyboardAwareInterface'

const _KAM_DEFAULT_TAB_BAR_HEIGHT: number = isIphoneX() ? 83 : 49
const _KAM_KEYBOARD_OPENING_TIME: number = 250
const _KAM_EXTRA_HEIGHT: number = 75

const supportedKeyboardEvents = [
  'keyboardWillShow',
  'keyboardDidShow',
  'keyboardWillHide',
  'keyboardDidHide',
  'keyboardWillChangeFrame',
  'keyboardDidChangeFrame',
]
const keyboardEventToCallbackName = (eventName: string) =>
  `on${eventName[0].toUpperCase() + eventName.substring(1)}`
const keyboardEventPropTypes = supportedKeyboardEvents.reduce(
  (acc: Object, eventName: string) => ({
    ...acc,
    [keyboardEventToCallbackName(eventName)]: PropTypes.func,
  }),
  {},
)

export type KeyboardAwareHOCProps = {
  viewIsInsideTabBar?: boolean,
  resetScrollToCoords?: {
    x: number,
    y: number,
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
  keyboardSpace: number,
}

export type ElementLayout = {
  x: number,
  y: number,
  width: number,
  height: number,
}

export type ContentOffset = {
  x: number,
  y: number,
}

export type ScrollPosition = {
  x: number,
  y: number,
  animated: boolean,
}

export type ScrollIntoViewOptions = {
  getScrollPosition?: (
    parentLayout: ElementLayout,
    childLayout: ElementLayout,
    contentOffset: ContentOffset,
  ) => ScrollPosition,
}

export type KeyboardAwareHOCOptions = {
  enableOnAndroid?: boolean,
  contentContainerStyle?: ?Object,
  enableAutomaticScroll?: boolean,
  extraHeight?: number,
  extraScrollHeight?: number,
  enableResetScrollToCoords?: boolean,
  keyboardOpeningTime?: number,
  viewIsInsideTabBar?: boolean,
  refPropName?: string,
  extractNativeRef?: Function,
}

function getDisplayName(WrappedComponent: Class<React.Component<*, *>>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const ScrollIntoViewDefaultOptions: KeyboardAwareHOCOptions = {
  enableOnAndroid: false,
  contentContainerStyle: undefined,
  enableAutomaticScroll: true,
  extraHeight: _KAM_EXTRA_HEIGHT,
  extraScrollHeight: 0,
  enableResetScrollToCoords: true,
  keyboardOpeningTime: _KAM_KEYBOARD_OPENING_TIME,
  viewIsInsideTabBar: false,

  // The ref prop name that will be passed to the wrapped component to obtain a ref
  // If your ScrollView is already wrapped, maybe the wrapper permit to get a ref
  // For example, with glamorous-native ScrollView, you should use "innerRef"
  refPropName: 'ref',
  // Sometimes the ref you get is a ref to a wrapped view (ex: Animated.ScrollView)
  // We need access to the imperative API of a real native ScrollView so we need extraction logic
  extractNativeRef: (ref: Object) => {
    // getNode() permit to support Animated.ScrollView automatically
    // see https://github.com/facebook/react-native/issues/19650
    // see https://stackoverflow.com/questions/42051368/scrollto-is-undefined-on-animated-scrollview/48786374
    if (ref.getNode) {
      return ref.getNode()
    }
    return ref
  },
}

function KeyboardAwareHOC(
  ScrollableComponent: Class<React.Component<*, *>>,
  userOptions: KeyboardAwareHOCOptions,
) {
  const hocOptions: KeyboardAwareHOCOptions = {
    ...ScrollIntoViewDefaultOptions,
    ...userOptions,
  }

  return class
    extends React.Component<KeyboardAwareHOCProps, KeyboardAwareHOCState>
    implements KeyboardAwareInterface {
    _rnkasvKeyboardView: any

    keyboardWillShowEvent: ?{ remove(): void }

    keyboardWillHideEvent: ?{ remove(): void }

    callbacks: Object

    position: ContentOffset

    defaultResetScrollToCoords: ?{ x: number, y: number }

    resetCoords: ?{ x: number, y: number }

    mountedComponent: boolean

    handleOnScroll: Function

    state: KeyboardAwareHOCState

    static displayName = `KeyboardAware${getDisplayName(ScrollableComponent)}`

    static propTypes = {
      viewIsInsideTabBar: PropTypes.bool,
      resetScrollToCoords: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
      enableResetScrollToCoords: PropTypes.bool,
      enableAutomaticScroll: PropTypes.bool,
      extraHeight: PropTypes.number,
      extraScrollHeight: PropTypes.number,
      keyboardOpeningTime: PropTypes.number,
      onScroll: PropTypes.oneOfType([
        PropTypes.func, // Normal listener
        PropTypes.object, // Animated.event listener
      ]),
      update: PropTypes.func,
      contentContainerStyle: PropTypes.any,
      enableOnAndroid: PropTypes.bool,
      innerRef: PropTypes.func,
      ...keyboardEventPropTypes,
    }

    // HOC options are used to init default props, so that these options
    // can be overriden with component props
    static defaultProps = {
      enableAutomaticScroll: hocOptions.enableAutomaticScroll,
      extraHeight: hocOptions.extraHeight,
      extraScrollHeight: hocOptions.extraScrollHeight,
      enableResetScrollToCoords: hocOptions.enableResetScrollToCoords,
      keyboardOpeningTime: hocOptions.keyboardOpeningTime,
      viewIsInsideTabBar: hocOptions.viewIsInsideTabBar,
      enableOnAndroid: hocOptions.enableOnAndroid,
    }

    constructor(props: KeyboardAwareHOCProps) {
      super(props)
      this.keyboardWillShowEvent = undefined
      this.keyboardWillHideEvent = undefined
      this.callbacks = {}
      this.position = { x: 0, y: 0 }
      this.defaultResetScrollToCoords = null
      const keyboardSpace: number = props.viewIsInsideTabBar
        ? _KAM_DEFAULT_TAB_BAR_HEIGHT
        : 0
      this.state = { keyboardSpace }
    }

    componentDidMount() {
      this.mountedComponent = true
      // Keyboard events
      if (Platform.OS === 'ios') {
        this.keyboardWillShowEvent = Keyboard.addListener(
          'keyboardWillShow',
          this._updateKeyboardSpace,
        )
        this.keyboardWillHideEvent = Keyboard.addListener(
          'keyboardWillHide',
          this._resetKeyboardSpace,
        )
      } else if (Platform.OS === 'android' && this.props.enableOnAndroid) {
        this.keyboardWillShowEvent = Keyboard.addListener(
          'keyboardDidShow',
          this._updateKeyboardSpace,
        )
        this.keyboardWillHideEvent = Keyboard.addListener(
          'keyboardDidHide',
          this._resetKeyboardSpace,
        )
      }

      supportedKeyboardEvents.forEach((eventName: string) => {
        const callbackName = keyboardEventToCallbackName(eventName)
        if (this.props[callbackName]) {
          this.callbacks[eventName] = Keyboard.addListener(
            eventName,
            this.props[callbackName],
          )
        }
      })
    }

    componentWillReceiveProps(nextProps: KeyboardAwareHOCProps) {
      if (nextProps.viewIsInsideTabBar !== this.props.viewIsInsideTabBar) {
        const keyboardSpace: number = nextProps.viewIsInsideTabBar
          ? _KAM_DEFAULT_TAB_BAR_HEIGHT
          : 0
        if (this.state.keyboardSpace !== keyboardSpace) {
          this.setState({ keyboardSpace })
        }
      }
    }

    componentWillUnmount() {
      this.mountedComponent = false
      if (this.keyboardWillShowEvent) {
        this.keyboardWillShowEvent.remove()
      }
      if (this.keyboardWillHideEvent) {
        this.keyboardWillHideEvent.remove()
      }
      Object.values(this.callbacks).forEach((callback: any) => {
        if (callback.remove) {
          callback.remove()
        }
      })
    }

    getScrollResponder = () =>
      this._rnkasvKeyboardView && this._rnkasvKeyboardView.getScrollResponder()

    scrollToPosition = (x: number, y: number, animated: boolean = true) => {
      const responder = this.getScrollResponder()
      if (responder) {
        responder.scrollResponderScrollTo({ x, y, animated })
      }
    }

    scrollToEnd = (animated?: boolean = true) => {
      const responder = this.getScrollResponder()
      if (responder) {
        responder.scrollResponderScrollToEnd({ animated })
      }
    }

    scrollForExtraHeightOnAndroid = (extraHeight: number) => {
      this.scrollToPosition(0, this.position.y + extraHeight, true)
    }

    /**
     * @param keyboardOpeningTime: takes a different keyboardOpeningTime in consideration.
     * @param extraHeight: takes an extra height in consideration.
     */
    scrollToFocusedInput = (
      reactNode: any,
      extraHeight?: number,
      keyboardOpeningTime?: number,
    ) => {
      let height = 0
      if (extraHeight === undefined) {
        height = this.props.extraHeight || 0
      }
      let openingTime = 0
      if (keyboardOpeningTime === undefined) {
        openingTime = this.props.keyboardOpeningTime || 0
      }
      setTimeout(() => {
        if (!this.mountedComponent) {
          return
        }
        const responder = this.getScrollResponder()
        if (responder) {
          responder.scrollResponderScrollNativeHandleToKeyboard(
            reactNode,
            height,
            true,
          )
        }
      }, openingTime)
    }

    scrollIntoView = async (
      element: React.Element<*>,
      options: ScrollIntoViewOptions = {},
    ) => {
      if (!this._rnkasvKeyboardView || !element) {
        return
      }

      const [parentLayout, childLayout] = await Promise.all([
        this._measureElement(this._rnkasvKeyboardView),
        this._measureElement(element),
      ])

      const getScrollPosition =
        options.getScrollPosition || this._defaultGetScrollPosition
      const { x, y, animated } = getScrollPosition(
        parentLayout,
        childLayout,
        this.position,
      )
      this.scrollToPosition(x, y, animated)
    }

    _defaultGetScrollPosition = (
      parentLayout: ElementLayout,
      childLayout: ElementLayout,
      contentOffset: ContentOffset,
    ): ScrollPosition => ({
      x: 0,
      y: Math.max(0, childLayout.y - parentLayout.y + contentOffset.y),
      animated: true,
    })

    _measureElement = (element: React.Element<*>): Promise<ElementLayout> => {
      const node = findNodeHandle(element)
      return new Promise((resolve: ElementLayout => void) => {
        UIManager.measureInWindow(
          node,
          (x: number, y: number, width: number, height: number) => {
            resolve({ x, y, width, height })
          },
        )
      })
    }

    // Keyboard actions
    _updateKeyboardSpace = (frames: Object) => {
      // Automatically scroll to focused TextInput
      if (this.props.enableAutomaticScroll) {
        let keyboardSpace: number =
          frames.endCoordinates.height + this.props.extraScrollHeight
        if (this.props.viewIsInsideTabBar) {
          keyboardSpace -= _KAM_DEFAULT_TAB_BAR_HEIGHT
        }
        this.setState({ keyboardSpace })
        const currentlyFocusedField = TextInput.State.currentlyFocusedField()
        const responder = this.getScrollResponder()
        if (!currentlyFocusedField || !responder) {
          return
        }
        UIManager.viewIsDescendantOf(
          currentlyFocusedField,
          responder.getInnerViewNode(),
          (isAncestor: boolean) => {
            if (isAncestor) {
              // Check if the TextInput will be hidden by the keyboard
              UIManager.measureInWindow(
                currentlyFocusedField,
                (x: number, y: number, width: number, height: number) => {
                  const textInputBottomPosition = y + height
                  const keyboardPosition = frames.endCoordinates.screenY
                  const totalExtraHeight =
                    this.props.extraScrollHeight + this.props.extraHeight
                  if (Platform.OS === 'ios') {
                    if (
                      textInputBottomPosition >
                      keyboardPosition - totalExtraHeight
                    ) {
                      this._scrollToFocusedInputWithNodeHandle(
                        currentlyFocusedField,
                      )
                    }
                  } else if (textInputBottomPosition > keyboardPosition) {
                    // On android, the system would scroll the text input just
                    // above the keyboard so we just neet to scroll the extra
                    // height part
                    // Since the system already scrolled the whole view up
                    // we should reduce that amount
                    keyboardSpace -= textInputBottomPosition - keyboardPosition
                    this.setState({ keyboardSpace })
                    this.scrollForExtraHeightOnAndroid(totalExtraHeight)
                  } else if (
                    textInputBottomPosition >
                    keyboardPosition - totalExtraHeight
                  ) {
                    this.scrollForExtraHeightOnAndroid(
                      totalExtraHeight -
                        (keyboardPosition - textInputBottomPosition),
                    )
                  }
                },
              )
            }
          },
        )
      }
      if (!this.resetCoords) {
        if (!this.defaultResetScrollToCoords) {
          this.defaultResetScrollToCoords = this.position
        }
      }
    }

    _resetKeyboardSpace = () => {
      const keyboardSpace: number = this.props.viewIsInsideTabBar
        ? _KAM_DEFAULT_TAB_BAR_HEIGHT
        : 0
      this.setState({ keyboardSpace })
      // Reset scroll position after keyboard dismissal
      if (this.props.enableResetScrollToCoords === false) {
        this.defaultResetScrollToCoords = null
      } else if (this.resetCoords) {
        this.scrollToPosition(this.resetCoords.x, this.resetCoords.y, true)
      } else if (this.defaultResetScrollToCoords) {
        this.scrollToPosition(
          this.defaultResetScrollToCoords.x,
          this.defaultResetScrollToCoords.y,
          true,
        )
        this.defaultResetScrollToCoords = null
      } else {
        this.scrollToPosition(0, 0, true)
      }
    }

    _scrollToFocusedInputWithNodeHandle = (
      nodeID: number,
      extraHeight?: number,
      keyboardOpeningTime?: number,
    ) => {
      let extra = 0
      if (extraHeight === undefined) {
        extra = this.props.extraHeight
      }
      const reactNode = ReactNative.findNodeHandle(nodeID)
      if (reactNode) {
        this.scrollToFocusedInput(
          reactNode,
          extra + this.props.extraScrollHeight,
          keyboardOpeningTime !== undefined
            ? keyboardOpeningTime
            : this.props.keyboardOpeningTime || 0,
        )
      }
    }

    _handleOnScroll = (e: { nativeEvent: { contentOffset: ContentOffset } }) => {
      this.position = e.nativeEvent.contentOffset
    }

    _handleRef = (ref: any) => {
      this._rnkasvKeyboardView = ref
        ? hocOptions.extractNativeRef && hocOptions.extractNativeRef(ref)
        : ref
      if (this.props.innerRef) {
        this.props.innerRef(this._rnkasvKeyboardView)
      }
    }

    update = () => {
      const currentlyFocusedField = TextInput.State.currentlyFocusedField()
      const responder = this.getScrollResponder()
      if (!currentlyFocusedField || !responder) {
        return
      }
      this._scrollToFocusedInputWithNodeHandle(currentlyFocusedField)
    }

    render() {
      const { enableOnAndroid, contentContainerStyle, onScroll } = this.props
      let newContentContainerStyle
      if (Platform.OS === 'android' && enableOnAndroid) {
        newContentContainerStyle = [].concat(contentContainerStyle).concat({
          paddingBottom:
            ((contentContainerStyle || {}).paddingBottom || 0) +
            this.state.keyboardSpace,
        })
      }
      const refProps = {
        [hocOptions.refPropName ? hocOptions.refPropName : 'ref']: this
          ._handleRef,
      }
      return (
        <ScrollableComponent
          {...refProps}
          keyboardDismissMode="interactive"
          contentInset={{ bottom: this.state.keyboardSpace }}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator
          scrollEventThrottle={1}
          {...this.props}
          contentContainerStyle={
            newContentContainerStyle || contentContainerStyle
          }
          keyboardSpace={this.state.keyboardSpace}
          getScrollResponder={this.getScrollResponder}
          scrollToPosition={this.scrollToPosition}
          scrollToEnd={this.scrollToEnd}
          scrollForExtraHeightOnAndroid={this.scrollForExtraHeightOnAndroid}
          scrollToFocusedInput={this.scrollToFocusedInput}
          scrollIntoView={this.scrollIntoView}
          resetKeyboardSpace={this._resetKeyboardSpace}
          handleOnScroll={this._handleOnScroll}
          update={this.update}
          onScroll={Animated.forkEvent(onScroll, this._handleOnScroll)}
        />
      )
    }
  }
}

const listenToKeyboardEvents = (config: Object = {}) => (
  Comp: Class<React.Component<*, *>>,
) => KeyboardAwareHOC(Comp, config)

export default listenToKeyboardEvents
