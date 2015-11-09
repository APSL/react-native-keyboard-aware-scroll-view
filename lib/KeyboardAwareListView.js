import React, { ListView } from 'react-native'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareListView = React.createClass({
  propTypes: {
    ...ListView.propTypes,
  },
  mixins: [KeyboardAwareMixin],

  render: function () {
    return (
      <ListView
        ref='keyboardView'
        keyboardDismissMode='interactive'
        contentInset={{bottom: this.state.keyboardSpace}}
        showsVerticalScrollIndicator={true}
        {...this.props}
      />
    )
  },
})

export default KeyboardAwareListView
