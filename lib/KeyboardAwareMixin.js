/* @flow */

import PropTypes from 'prop-types'
import ReactNative, { TextInput, Keyboard, UIManager, Platform } from 'react-native'
import TimerMixin from 'react-timer-mixin'
import { isIphoneX } from 'react-native-iphone-x-helper'

const _KAM_DEFAULT_TAB_BAR_HEIGHT: number = isIphoneX() ? 83 : 49
const _KAM_KEYBOARD_OPENING_TIME: number = 250
const _KAM_EXTRA_HEIGHT: number = 75

const KeyboardAwareMixin = {
  mixins: [TimerMixin],
  propTypes: {
    enableAutoAutomaticScroll: PropTypes.bool,
    keyboardOpeningTime: PropTypes.number,
    extraHeight: PropTypes.number,
    extraScrollHeight: PropTypes.number,
    enableResetScrollToCoords: PropTypes.bool,
  },

  getDefaultProps: function () {
    return {
      enableAutoAutomaticScroll: true,
      extraHeight: _KAM_EXTRA_HEIGHT,
      extraScrollHeight: 0,
      enableResetScrollToCoords: true,
      keyboardOpeningTime: _KAM_KEYBOARD_OPENING_TIME,
    }
  },

  setViewIsInsideTabBar: function (viewIsInsideTabBar: boolean) {
    this.viewIsInsideTabBar = viewIsInsideTabBar
    const keyboardSpace = viewIsInsideTabBar ? _KAM_DEFAULT_TAB_BAR_HEIGHT : 0
    if (this.state.keyboardSpace !== keyboardSpace) {
      this.setState({keyboardSpace})
    }
  },

  setResetScrollToCoords: function (coords: {x: number, y: number}) {
    this.resetCoords = coords
  },

  getInitialState: function () {
    this.viewIsInsideTabBar = false
    this.keyboardWillShowEvent = undefined
    this.keyboardWillHideEvent = undefined
    return {
      keyboardSpace: 0,
    }
  },

  // Keyboard actions
  updateKeyboardSpace: function (frames: Object) {
    let keyboardSpace: number = frames.endCoordinates.height + this.props.extraScrollHeight
    if (this.props.viewIsInsideTabBar) {
      keyboardSpace -= _KAM_DEFAULT_TAB_BAR_HEIGHT
    }
    this.setState({keyboardSpace})
    // Automatically scroll to focused TextInput
    if (this.props.enableAutoAutomaticScroll) {
      const currentlyFocusedField = TextInput.State.currentlyFocusedField()
      const responder = this.getScrollResponder();
      if (!currentlyFocusedField || !responder) {
        return
      }
      UIManager.viewIsDescendantOf(
        currentlyFocusedField,
        responder.getInnerViewNode(),
        (isAncestor) => {
          if (isAncestor) {
            // Check if the TextInput will be hidden by the keyboard
            UIManager.measureInWindow(currentlyFocusedField, (x, y, width, height) => {
              const textInputBottomPosition = y + height
              const keyboardPosition = frames.endCoordinates.screenY
              const totalExtraHeight = this.props.extraScrollHeight + this.props.extraHeight

              if (Platform.OS === 'ios') {
                if (textInputBottomPosition > keyboardPosition - totalExtraHeight) {
                  this.scrollToFocusedInputWithNodeHandle(currentlyFocusedField)
                }
              } else {

                // on android, the system would scroll the text input just above the keyboard
                // so we just neet to scroll the extra height part
                if (textInputBottomPosition > keyboardPosition) {
                  // since the system already scrolled the whole view up
                  // we should reduce that amount
                  keyboardSpace = keyboardSpace - (textInputBottomPosition - keyboardPosition)
                  this.setState({keyboardSpace})

                  this.scrollForExtraHeightOnAndroid(totalExtraHeight)
                } else if (textInputBottomPosition > keyboardPosition - totalExtraHeight) {
                  this.scrollForExtraHeightOnAndroid(totalExtraHeight - (keyboardPosition - textInputBottomPosition))
                }
              }
            })
          }
        }
      )
    }
    if (!this.resetCoords) {
      if (!this.defaultResetScrollToCoords) {
        this.defaultResetScrollToCoords = this.position
      }
    }
  },

  resetKeyboardSpace: function () {
    const keyboardSpace: number = (this.props.viewIsInsideTabBar) ? _KAM_DEFAULT_TAB_BAR_HEIGHT + this.props.extraScrollHeight : this.props.extraScrollHeight
    this.setState({keyboardSpace})
    // Reset scroll position after keyboard dismissal
    if (this.props.enableResetScrollToCoords === false) {
      this.defaultResetScrollToCoords = null
      return
    } else if (this.resetCoords) {
      this.scrollToPosition(this.resetCoords.x, this.resetCoords.y, true)
    } else {
      if (this.defaultResetScrollToCoords) {
        this.scrollToPosition(this.defaultResetScrollToCoords.x, this.defaultResetScrollToCoords.y, true)
        this.defaultResetScrollToCoords = null
      } else {
        this.scrollToPosition(0, 0, true)
      }
    }
  },

  componentDidMount: function () {
    // Keyboard events
    if (Platform.OS === 'ios') {
      this.keyboardWillShowEvent = Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace)
      this.keyboardWillHideEvent = Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)
    } else if (Platform.OS === 'android' && this.props.enableOnAndroid) {
      this.keyboardWillShowEvent = Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace)
      this.keyboardWillHideEvent = Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace)
    }
  },

  componentWillUnmount: function () {
    this.keyboardWillShowEvent && this.keyboardWillShowEvent.remove()
    this.keyboardWillHideEvent && this.keyboardWillHideEvent.remove()
  },

  getScrollResponder() {
    return this._rnkasv_keyboardView && this._rnkasv_keyboardView.getScrollResponder()
  },

  scrollToPosition: function (x: number, y: number, animated: boolean = true) {
    const responder = this.getScrollResponder();
    responder && responder.scrollResponderScrollTo({x: x, y: y, animated: animated})
  },

  scrollToEnd: function (animated?: boolean = true) {
    const responder = this.getScrollResponder();
    responder && responder.scrollResponderScrollToEnd({animated: animated})
  },

  scrollForExtraHeightOnAndroid(extraHeight: number) {
    this.scrollToPosition(0, this.position.y + extraHeight, true)
  },

  /**
   * @param keyboardOpeningTime: takes a different keyboardOpeningTime in consideration.
   * @param extraHeight: takes an extra height in consideration.
   */
  scrollToFocusedInput: function (reactNode: Object, extraHeight: number, keyboardOpeningTime: number) {
    if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight;
    }

    if (keyboardOpeningTime === undefined) {
        keyboardOpeningTime = this.props.keyboardOpeningTime;
    }

    this.setTimeout(() => {
      const responder = this.getScrollResponder();
      responder && responder.scrollResponderScrollNativeHandleToKeyboard(
        reactNode, extraHeight, true
      )
    }, keyboardOpeningTime)
  },

  scrollToFocusedInputWithNodeHandle: function (nodeID: number, extraHeight: number, keyboardOpeningTime: number) {
    if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight;
    }

    if (keyboardOpeningTime === undefined) {
        keyboardOpeningTime = this.props.keyboardOpeningTime;
    }

    const reactNode = ReactNative.findNodeHandle(nodeID)
    this.scrollToFocusedInput(reactNode, extraHeight + this.props.extraScrollHeight, keyboardOpeningTime)
  },

  position: {x: 0, y: 0},

  defaultResetScrollToCoords: null, // format: {x: 0, y: 0}

  handleOnScroll: function (e: SyntheticEvent & {nativeEvent: {contentOffset: number}}) {
    this.position = e.nativeEvent.contentOffset
  },

  handleRef: function(ref) {
    this._rnkasv_keyboardView = ref
    if (this.props.innerRef) {
        this.props.innerRef(this._rnkasv_keyboardView)
    }
},
}

export default KeyboardAwareMixin
