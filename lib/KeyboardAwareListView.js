/* @flow */

import React from 'react'
import createReactClass from 'create-react-class'
import { ListView, Platform } from 'react-native'
import PropTypes from 'prop-types'
import KeyboardAwareMixin from './KeyboardAwareMixin'

const KeyboardAwareListView = createReactClass({
  propTypes: {
    viewIsInsideTabBar: PropTypes.bool,
    resetScrollToCoords: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    enableOnAndroid: React.PropTypes.bool,
  },
  mixins: [KeyboardAwareMixin],

  componentWillMount: function () {
    this.setViewIsInsideTabBar(this.props.viewIsInsideTabBar)
    this.setResetScrollToCoords(this.props.resetScrollToCoords)
  },

  render: function () {
    const {
      enableOnAndroid,
      contentContainerStyle,
    } = this.props

    const {
      keyboardSpace,
    } = this.state

    let newContentContainerStyle

    if (Platform.OS === 'android' && enableOnAndroid) {
      newContentContainerStyle = Object.assign({}, contentContainerStyle)
      newContentContainerStyle.paddingBottom = (newContentContainerStyle.paddingBottom || 0) + keyboardSpace
    }

    return (
      <ListView
        ref='_rnkasv_keyboardView'
        keyboardDismissMode='interactive'
        contentInset={{bottom: keyboardSpace}}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={0}
        {...this.props}
        contentContainerStyle={newContentContainerStyle || contentContainerStyle}
        onScroll={e => {
          this.handleOnScroll(e)
          this.props.onScroll && this.props.onScroll(e)
        }}
      />
    )
  },
})

export default KeyboardAwareListView
