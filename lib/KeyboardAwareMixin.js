/* @flow */

import PropTypes from 'prop-types'
import ReactNative, { TextInput, Keyboard, UIManager } from 'react-native'
import TimerMixin from 'react-timer-mixin'

const _KAM_DEFAULT_TAB_BAR_HEIGHT: number = 49
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
              if (y + height > frames.endCoordinates.screenY - this.props.extraScrollHeight - this.props.extraHeight) {
                this.scrollToFocusedInputWithNodeHandle(currentlyFocusedField)
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
    this.keyboardWillShowEvent = Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace)
    this.keyboardWillHideEvent = Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)
  },

  componentWillUnmount: function () {
    this.keyboardWillShowEvent && this.keyboardWillShowEvent.remove()
    this.keyboardWillHideEvent && this.keyboardWillHideEvent.remove()
  },

  getScrollResponder() {
    return this.refs._rnkasv_keyboardView && this.refs._rnkasv_keyboardView.getScrollResponder()
  },

  scrollToPosition: function (x: number, y: number, animated: boolean = true) {
    const responder = this.getScrollResponder();
    responder && responder.scrollResponderScrollTo({x: x, y: y, animated: animated})
  },

  scrollToEnd: function (animated?: boolean = true) {
    const responder = this.getScrollResponder();
    responder && responder.scrollResponderScrollToEnd({animated: animated})
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
}

export default KeyboardAwareMixin
