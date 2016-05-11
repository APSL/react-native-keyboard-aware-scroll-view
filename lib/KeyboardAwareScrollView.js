/* @flow */

import React, { PropTypes } from 'react'
import { ScrollView } from 'react-native'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareScrollView = React.createClass({
  propTypes: {
    ...ScrollView.propTypes,
    viewIsInsideTabBar: PropTypes.bool,
  },
  mixins: [KeyboardAwareMixin],

  componentWillMount: function() {
    if (this.props.viewIsInsideTabBar) {
      this.setViewIsInsideTabBar(this.props.viewIsInsideTabBar)
    }
  },

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
