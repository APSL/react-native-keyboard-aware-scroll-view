/* @flow */

import React from 'react'
import createReactClass from 'create-react-class'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareScrollView = createReactClass({
  propTypes: {
    ...ScrollView.propTypes,
    viewIsInsideTabBar: PropTypes.bool,
    resetScrollToCoords: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  },
  mixins: [KeyboardAwareMixin],

  componentWillMount: function () {
    this.setViewIsInsideTabBar(this.props.viewIsInsideTabBar)
    this.setResetScrollToCoords(this.props.resetScrollToCoords)
  },

  render: function () {
    return (
      <ScrollView
        ref='_rnkasv_keyboardView'
        keyboardDismissMode='interactive'
        contentInset={{bottom: this.state.keyboardSpace}}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={0}
        {...this.props}
        onScroll={e => {
          this.handleOnScroll(e)
          this.props.onScroll && this.props.onScroll(e)
        }}
        >
        {this.props.children}
      </ScrollView>
    )
  },
})

export default KeyboardAwareScrollView
