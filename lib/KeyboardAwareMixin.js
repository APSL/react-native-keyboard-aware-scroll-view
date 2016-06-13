/* @flow */

import { PropTypes } from 'react'
import ReactNative, { TextInput, DeviceEventEmitter } from 'react-native'
import TimerMixin from 'react-timer-mixin'

const _KAM_DEFAULT_TAB_BAR_HEIGHT = 49
const _KAM_KEYBOARD_OPENING_TIME = 250

const KeyboardAwareMixin = {
  mixins: [TimerMixin],
  propTypes: {
    enableAutoAutomaticScroll: PropTypes.bool
  },
  getDefaultProps: function() {
    return {
        enableAutoAutomaticScroll: true,
    };
  },

  setViewIsInsideTabBar: function (viewIsInsideTabBar: bool) {
    this.viewIsInsideTabBar = viewIsInsideTabBar
    this.setState({keyboardSpace: _KAM_DEFAULT_TAB_BAR_HEIGHT})
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
    const keyboardSpace = (this.props.viewIsInsideTabBar) ? frames.endCoordinates.height - _KAM_DEFAULT_TAB_BAR_HEIGHT : frames.endCoordinates.height
    this.setState({
      keyboardSpace: keyboardSpace,
    })
    // Automatically scroll to focused TextInput
    if (this.props.enableAutoAutomaticScroll) {
      const currentlyFocusedField = TextInput.State.currentlyFocusedField()
      this.scrollToFocusedInputWithNodeHandle(currentlyFocusedField)
    }
  },

  resetKeyboardSpace: function () {
    const keyboardSpace = (this.props.viewIsInsideTabBar) ? _KAM_DEFAULT_TAB_BAR_HEIGHT : 0
    this.setState({
      keyboardSpace: keyboardSpace,
    })
    // Reset scroll position after keyboard dismissal
    if (this.resetCoords) {
      this.scrollToPosition(this.resetCoords.x, this.resetCoords.y, true)
    }
  },

  componentDidMount: function () {
    // Keyboard events
    this.keyboardWillShowEvent = DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace)
    this.keyboardWillHideEvent = DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace)
  },

  componentWillUnmount: function () {
    this.keyboardWillShowEvent.remove()
    this.keyboardWillHideEvent.remove()
  },

  scrollToPosition: function (x: number, y: number, animated: bool = false) {
    const scrollView = this.refs._rnkasv_keyboardView.getScrollResponder()
    scrollView.scrollResponderScrollTo({x: x, y: y, animated: animated})
  },

  /**
   * @param extraHeight: takes an extra height in consideration.
   */
  scrollToFocusedInput: function (reactNode: Object, extraHeight: number = _KAM_DEFAULT_TAB_BAR_HEIGHT) {
    const scrollView = this.refs._rnkasv_keyboardView.getScrollResponder()
    this.setTimeout(() => {
      scrollView.scrollResponderScrollNativeHandleToKeyboard(
        reactNode, extraHeight, true
      )
    }, _KAM_KEYBOARD_OPENING_TIME)
  },

  scrollToFocusedInputWithNodeHandle: function (nodeID: number, extraHeight: number = _KAM_DEFAULT_TAB_BAR_HEIGHT) {
    const reactNode = ReactNative.findNodeHandle(nodeID)
    this.scrollToFocusedInput(reactNode, extraHeight)
  },
}

export default KeyboardAwareMixin
