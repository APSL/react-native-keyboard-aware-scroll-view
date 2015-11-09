import React, { ScrollView } from 'react-native'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareScrollView = React.createClass({
  propTypes: {
    ...ScrollView.propTypes,
  },
  mixins: [KeyboardAwareMixin],

  render: function () {
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
  },
})

export default KeyboardAwareScrollView
