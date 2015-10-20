import React, { ScrollView, PropTypes, DeviceEventEmitter } from 'react-native'
import StyleSheetPropType from 'react-native/Libraries/StyleSheet/StyleSheetPropType'
import ViewStylePropTypes from 'react-native/Libraries/Components/View/ViewStylePropTypes'
import TimerMixin from 'react-timer-mixin'

const KeyboardAwareScrollView = React.createClass({
  propTypes: {
    style: StyleSheetPropType(ViewStylePropTypes),
    children: PropTypes.node,
    viewIsInsideTabBar: PropTypes.bool,
  },
  mixins: [TimerMixin],

  getInitialState: function (props) {
    return {
      keyboardSpace: 0,
    }
  },

  // Keyboard actions
  // TODO: automatically handle TabBar height instead of using props
  updateKeyboardSpace: function (frames) {
    const keyboardSpace = (this.props.viewIsInsideTabBar) ? frames.endCoordinates.height - 49 : frames.endCoordinates.height
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

  /**
   * @param extraHeight: takes an extra height in consideration.
   */
  scrollToFocusedInput: function (event, reactNode, extraHeight = 49) {
    const scrollView = this.refs.keyboardScrollView.getScrollResponder()
    this.setTimeout(() => {
      scrollView.scrollResponderScrollNativeHandleToKeyboard(
        reactNode, extraHeight, true
      )
    }, 220)
  },

  render: function () {
    return (
      <ScrollView
        ref='keyboardScrollView'
        keyboardDismissMode='interactive'
        contentInset={{bottom: this.state.keyboardSpace}}
        showsVerticalScrollIndicator={true}
        style={this.props.style}>
        {this.props.children}
      </ScrollView>
    )
  },
})

export default KeyboardAwareScrollView
