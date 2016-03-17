import { DeviceEventEmitter } from 'react-native'
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
  updateKeyboardSpace: function (frames) {
    const keyboardSpace = (this.props.viewIsInsideTabBar) ? frames.endCoordinates.height - _KAM_DEFAULT_TAB_BAR_HEIGHT : frames.endCoordinates.height
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
    DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace)
    DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace)
  },

  componentWillUnmount: function () {
    // TODO: figure out if removeAllListeners is the right thing to do
    DeviceEventEmitter.removeAllListeners('keyboardWillShow')
    DeviceEventEmitter.removeAllListeners('keyboardWillHide')
  },

  scrollToPosition: function(x, y) {
    const scrollView = this.refs.keyboardView.getScrollResponder()
    this.setTimeout(() => {
      scrollView.scrollResponderScrollTo({x: x, y: y, animated: true});
    }, 220)
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
