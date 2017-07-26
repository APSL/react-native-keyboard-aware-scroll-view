/* @flow */

import React from 'react'
import createReactClass from 'create-react-class'
import { ListView } from 'react-native'
import PropTypes from 'prop-types'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareListView = createReactClass({
  propTypes: {
    viewIsInsideTabBar: PropTypes.bool,
    resetScrollToCoords: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    onScroll: PropTypes.func,
  },
  mixins: [KeyboardAwareMixin],

  componentWillMount: function () {
    this.setViewIsInsideTabBar(!!this.props.viewIsInsideTabBar)
    if (this.props.resetScrollToCoords) {
      this.setResetScrollToCoords(this.props.resetScrollToCoords)
    }
  },

  onScroll: function (e: SyntheticEvent & {nativeEvent: {contentOffset: number}}) {
    this.handleOnScroll(e)
    this.props.onScroll && this.props.onScroll(e)
  },

  render: function () {
    return (
      <ListView
        ref='_rnkasv_keyboardView'
        keyboardDismissMode='interactive'
        contentInset={{bottom: this.state.keyboardSpace}}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={0}
        {...this.props}
        onScroll={this.onScroll}
      />
    )
  },
})

export default KeyboardAwareListView
