import { DeviceEventEmitter, NativeAppEventEmitter, Platform } from 'react-native'
import TimerMixin from 'react-timer-mixin'

const _KAM_DEFAULT_TAB_BAR_HEIGHT = 49

const KeyboardAwareMixin = {
  mixins: [TimerMixin],

  setViewIsInsideTabBar: function (viewIsInsideTabBar) {
    this.viewIsInsideTabBar = viewIsInsideTabBar
    this.setState({keyboardSpace: _KAM_DEFAULT_TAB_BAR_HEIGHT})
  },

  getInitialState: function (props) {
    this.viewIsInsideTabBar = false
    return {
      keyboardSpace: 0,
    }
  },

  // Keyboard actions
  updateKeyboardSpace: function (height) {
    const keyboardSpace = (this.props.viewIsInsideTabBar) ? height - _KAM_DEFAULT_TAB_BAR_HEIGHT : height
    this.setState({
      keyboardSpace: keyboardSpace,
    })
  },

  resetKeyboardSpace: function () {
    this.setState({
      keyboardSpace: 0,
    })
  },

  componentDidMount: function () {
    // Keyboard events
    if (Platform.OS === 'ios') {
      DeviceEventEmitter.addListener('keyboardWillShow', (frames) => this.updateKeyboardSpace(frames.endCoordinates.height))
      DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace)
    } else {
      this.androidKeyboardVisibleListener = NativeAppEventEmitter.addListener('androidKeyboardVisible', this.updateKeyboardSpace)
      this.androidKeyboardHiddenListener = NativeAppEventEmitter.addListener('androidKeyboardHidden', this.resetKeyboardSpace)
    }
  },

  componentWillUnmount: function () {
    if (Platform.OS === 'ios') {
      // TODO: figure out if removeAllListeners is the right thing to do
      DeviceEventEmitter.removeAllListeners('keyboardWillShow')
      DeviceEventEmitter.removeAllListeners('keyboardWillHide')
    } else {
      this.androidKeyboardVisibleListener.remove();
      this.androidKeyboardHiddenListener.remove();
    }
  },

  /**
   * @param extraHeight: takes an extra height in consideration.
   */
  scrollToFocusedInput: function (event, reactNode, extraHeight = _KAM_DEFAULT_TAB_BAR_HEIGHT) {
    const scrollView = this.refs.keyboardView.getScrollResponder()
    this.setTimeout(() => {
      scrollView.scrollResponderScrollNativeHandleToKeyboard(
        reactNode, extraHeight, true
      )
    }, 220)
  },
}

export default KeyboardAwareMixin
