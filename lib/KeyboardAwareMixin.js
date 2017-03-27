/* @flow */

import { PropTypes } from 'react'
import ReactNative, { TextInput, Keyboard, UIManager } from 'react-native'
import TimerMixin from 'react-timer-mixin'

import type { Event } from 'react-native'

const _KAM_DEFAULT_TAB_BAR_HEIGHT: number = 49
const _KAM_KEYBOARD_OPENING_TIME: number = 250
const _KAM_EXTRA_HEIGHT: number = 75

const KeyboardAwareMixin = {
  mixins: [TimerMixin],
  propTypes: {
    enableAutoAutomaticScroll: PropTypes.bool,
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
    }
  },

  setViewIsInsideTabBar: function (viewIsInsideTabBar: bool) {
    this.viewIsInsideTabBar = viewIsInsideTabBar
    const keyboardSpace = viewIsInsideTabBar ? _KAM_DEFAULT_TAB_BAR_HEIGHT : 0
    if (this.state.keyboardSpace !== keyboardSpace) {
      this.setState({keyboardSpace})
    }
  },

  setResetScrollToCoords: function (coords: {x: number, y: number}) {
    this.resetCoords = coords
  },

  getInitialState: function (props: Object) {
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
      if (!currentlyFocusedField) {
        return
      }
      UIManager.viewIsDescendantOf(
        currentlyFocusedField,
        this.getScrollResponder().getInnerViewNode(),
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
    return this.refs._rnkasv_keyboardView.getScrollResponder()
  },

  scrollToPosition: function (x: number, y: number, animated: bool = true) {
    this.getScrollResponder().scrollResponderScrollTo({x: x, y: y, animated: animated})
  },

  scrollToEnd: function (animated?: bool = true) {
    this.getScrollResponder().scrollResponderScrollToEnd({animated: animated})
  },

  /**
   * @param extraHeight: takes an extra height in consideration.
   */
  scrollToFocusedInput: function (reactNode: Object, extraHeight: number) {
    if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight;
    }
    this.setTimeout(() => {
      this.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
        reactNode, extraHeight, true
      )
    }, _KAM_KEYBOARD_OPENING_TIME)
  },

  scrollToFocusedInputWithNodeHandle: function (nodeID: number, extraHeight: number) {
    if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight;
    }
    const reactNode = ReactNative.findNodeHandle(nodeID)
    this.scrollToFocusedInput(reactNode, extraHeight + this.props.extraScrollHeight)
  },

  position: {x: 0, y: 0},

  defaultResetScrollToCoords: null, // format: {x: 0, y: 0}

  handleOnScroll: function (e: Event) {
    this.position = e.nativeEvent.contentOffset
  },
}

export default KeyboardAwareMixin
