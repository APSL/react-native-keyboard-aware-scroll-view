import React, { ListView } from 'react-native'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareListView = React.createClass({
  propTypes: {
    ...ListView.propTypes,
    viewIsInsideTabBar: React.PropTypes.bool,
  },
  mixins: [KeyboardAwareMixin],

  componentWillMount: function() {
    if (this.props.viewIsInsideTabBar) {
      this.setViewIsInsideTabBar(this.props.viewIsInsideTabBar)
    }
  },

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
