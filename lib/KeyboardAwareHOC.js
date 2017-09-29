/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import ReactNative, {
  TextInput,
  Keyboard,
  UIManager,
  Platform,
  ScrollView
} from 'react-native'

const _KAM_DEFAULT_TAB_BAR_HEIGHT: number = 49
const _KAM_KEYBOARD_OPENING_TIME: number = 250
const _KAM_EXTRA_HEIGHT: number = 75

export type KeyboardAwareHOCProps = {
  enableAutoAutomaticScroll: boolean,
  keyboardOpeningTime: number,
  extraHeight: number,
  extraScrollHeight: number,
  enableResetScrollToCoords: boolean,
  innerRef: Function,
  handleOnScroll: Function,
  viewIsInsideTabBar?: boolean
}
export type KeyboardAwareHOCState = {
  keyboardSpace: number
}

function listenToKeyboardEvents(Component: any) {
  return class extends React.Component<
    KeyboardAwareHOCProps,
    KeyboardAwareHOCState
  > {
    _rnkasv_keyboardView: ScrollView
    keyboardWillShowEvent: ?Function
    keyboardWillHideEvent: ?Function
    position: { x: number, y: number }
    defaultResetScrollToCoords: ?{ x: number, y: number }
    resetCoords: ?{ x: number, y: number }
    mountedComponent: boolean
    handleOnScroll: Function
    state: KeyboardAwareHOCState

    static propTypes = {
      enableAutoAutomaticScroll: PropTypes.bool,
      keyboardOpeningTime: PropTypes.number,
      extraHeight: PropTypes.number,
      extraScrollHeight: PropTypes.number,
      enableResetScrollToCoords: PropTypes.bool,
      innerRef: PropTypes.func,
      viewIsInsideTabBar: PropTypes.bool
    }

    static defaultProps = {
      enableAutoAutomaticScroll: true,
      extraHeight: _KAM_EXTRA_HEIGHT,
      extraScrollHeight: 0,
      enableResetScrollToCoords: true,
      keyboardOpeningTime: _KAM_KEYBOARD_OPENING_TIME
    }

    constructor(props: KeyboardAwareHOCProps) {
      super(props)
      this.keyboardWillShowEvent = undefined
      this.keyboardWillHideEvent = undefined
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
          this._updateKeyboardSpace
        )
        this.keyboardWillHideEvent = Keyboard.addListener(
          'keyboardWillHide',
          this._resetKeyboardSpace
        )
      } else if (Platform.OS === 'android' && this.props.enableOnAndroid) {
        this.keyboardWillShowEvent = Keyboard.addListener(
          'keyboardDidShow',
          this._updateKeyboardSpace
        )
        this.keyboardWillHideEvent = Keyboard.addListener(
          'keyboardDidHide',
          this._resetKeyboardSpace
        )
      }
    }

    componentWillReceiveProps(nextProps: KeyboardAwareHOCProps) {
      const keyboardSpace: number = nextProps.viewIsInsideTabBar
        ? _KAM_DEFAULT_TAB_BAR_HEIGHT
        : 0
      if (this.state.keyboardSpace !== keyboardSpace) {
        this.setState({ keyboardSpace })
      }
    }

    componentWillUnmount() {
      this.mountedComponent = false
      this.keyboardWillShowEvent && this.keyboardWillShowEvent.remove()
      this.keyboardWillHideEvent && this.keyboardWillHideEvent.remove()
    }

    _getScrollResponder = () => {
      return (
        this._rnkasv_keyboardView &&
        this._rnkasv_keyboardView.getScrollResponder()
      )
    }

    _scrollToPosition = (x: number, y: number, animated: boolean = true) => {
      const responder = this._getScrollResponder()
      responder && responder.scrollResponderScrollTo({ x, y, animated })
    }

    scrollToEnd = (animated?: boolean = true) => {
      const responder = this._getScrollResponder()
      responder && responder.scrollResponderScrollToEnd({ animated })
    }

    scrollForExtraHeightOnAndroid = (extraHeight: number) => {
      this._scrollToPosition(0, this.position.y + extraHeight, true)
    }

    /**
     * @param keyboardOpeningTime: takes a different keyboardOpeningTime in consideration.
     * @param extraHeight: takes an extra height in consideration.
     */
    scrollToFocusedInput = (
      reactNode: Object,
      extraHeight: number,
      keyboardOpeningTime: number
    ) => {
      if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight
      }
      if (keyboardOpeningTime === undefined) {
        keyboardOpeningTime = this.props.keyboardOpeningTime
      }
      setTimeout(() => {
        if (!this.mountedComponent) {
          return
        }
        const responder = this._getScrollResponder()
        responder &&
          responder.scrollResponderScrollNativeHandleToKeyboard(
            reactNode,
            extraHeight,
            true
          )
      }, keyboardOpeningTime)
    }

    // Keyboard actions
    _updateKeyboardSpace = (frames: Object) => {
      let keyboardSpace: number =
        frames.endCoordinates.height + this.props.extraScrollHeight
      if (this.props.viewIsInsideTabBar) {
        keyboardSpace -= _KAM_DEFAULT_TAB_BAR_HEIGHT
      }
      this.setState({ keyboardSpace })
      // Automatically scroll to focused TextInput
      if (this.props.enableAutoAutomaticScroll) {
        const currentlyFocusedField = TextInput.State.currentlyFocusedField()
        const responder = this._getScrollResponder()
        if (!currentlyFocusedField || !responder) {
          return
        }
        UIManager.viewIsDescendantOf(
          currentlyFocusedField,
          responder.getInnerViewNode(),
          isAncestor => {
            if (isAncestor) {
              // Check if the TextInput will be hidden by the keyboard
              UIManager.measureInWindow(
                currentlyFocusedField,
                (x, y, width, height) => {
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
                        currentlyFocusedField
                      )
                    }
                  } else {
                    // On android, the system would scroll the text input just
                    // above the keyboard so we just neet to scroll the extra
                    // height part
                    if (textInputBottomPosition > keyboardPosition) {
                      // Since the system already scrolled the whole view up
                      // we should reduce that amount
                      keyboardSpace =
                        keyboardSpace -
                        (textInputBottomPosition - keyboardPosition)
                      this.setState({ keyboardSpace })
                      this.scrollForExtraHeightOnAndroid(totalExtraHeight)
                    } else if (
                      textInputBottomPosition >
                      keyboardPosition - totalExtraHeight
                    ) {
                      this.scrollForExtraHeightOnAndroid(
                        totalExtraHeight -
                          (keyboardPosition - textInputBottomPosition)
                      )
                    }
                  }
                }
              )
            }
          }
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
        ? _KAM_DEFAULT_TAB_BAR_HEIGHT + this.props.extraScrollHeight
        : this.props.extraScrollHeight
      this.setState({ keyboardSpace })
      // Reset scroll position after keyboard dismissal
      if (this.props.enableResetScrollToCoords === false) {
        this.defaultResetScrollToCoords = null
        return
      } else if (this.resetCoords) {
        this._scrollToPosition(this.resetCoords.x, this.resetCoords.y, true)
      } else {
        if (this.defaultResetScrollToCoords) {
          this._scrollToPosition(
            this.defaultResetScrollToCoords.x,
            this.defaultResetScrollToCoords.y,
            true
          )
          this.defaultResetScrollToCoords = null
        } else {
          this._scrollToPosition(0, 0, true)
        }
      }
    }

    _scrollToFocusedInputWithNodeHandle = (
      nodeID: number,
      extraHeight?: number,
      keyboardOpeningTime?: number
    ) => {
      if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight
      }
      if (keyboardOpeningTime === undefined) {
        keyboardOpeningTime = this.props.keyboardOpeningTime
      }
      const reactNode = ReactNative.findNodeHandle(nodeID)
      this.scrollToFocusedInput(
        reactNode,
        extraHeight + this.props.extraScrollHeight,
        keyboardOpeningTime
      )
    }

    _handleOnScroll = (
      e: SyntheticEvent<*> & { nativeEvent: { contentOffset: number } }
    ) => {
      this.position = e.nativeEvent.contentOffset
    }

    _handleRef = (ref: React.Component<*>) => {
      this._rnkasv_keyboardView = ref
      if (this.props.innerRef) {
        this.props.innerRef(this._rnkasv_keyboardView)
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          keyboardSpace={this.state.keyboardSpace}
          getScrollResponder={this._getScrollResponder}
          scrollToPosition={this._scrollToPosition}
          resetKeyboardSpace={this._resetKeyboardSpace}
          scrollToFocusedInputWithNodeHandle={
            this._scrollToFocusedInputWithNodeHandle
          }
          handleOnScroll={this._handleOnScroll}
          handleRef={this._handleRef}
        />
      )
    }
  }
}

export default listenToKeyboardEvents
