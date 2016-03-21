import React, { 
  Platform,
  requireNativeComponent,
  ScrollView,
  View
} from 'react-native'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareScrollView = React.createClass({
  propTypes: {
    ...ScrollView.propTypes,
    viewIsInsideTabBar: React.PropTypes.bool,
  },

  mixins: [KeyboardAwareMixin],

  componentWillMount: function() {
    if (this.props.viewIsInsideTabBar) {
      this.setViewIsInsideTabBar(this.props.viewIsInsideTabBar)
    }
  },

  render: function() {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          ref='keyboardView'
          keyboardDismissMode='interactive'
          contentInset={{bottom: this.state.keyboardSpace}}
          showsVerticalScrollIndicator={true}
          {...this.props}>
          {this.props.children}
        </ScrollView>
      )
    } else {
      return (
        <AndroidKeyboardAwareScrollView
          ref='keyboardView'
          keyboardDismissMode='interactive'
          contentInset={{bottom: this.state.keyboardSpace}}
          showsVerticalScrollIndicator={true}
          {...this.props}>
          <View collapsable={false}>
            {this.props.children}
          </View>
        </AndroidKeyboardAwareScrollView>
      )
    }
  },
})

var AndroidKeyboardAwareScrollView = requireNativeComponent('AndroidKeyboardAwareScrollView', KeyboardAwareScrollView)

export default KeyboardAwareScrollView
