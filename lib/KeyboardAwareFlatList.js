/* @flow */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { FlatList, Platform } from 'react-native';
import KeyboardAwareMixin from './KeyboardAwareMixin';

const KeyboardAwareFlatList = createReactClass({
  propTypes: {
    viewIsInsideTabBar: PropTypes.bool,
    resetScrollToCoords: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    onScroll: PropTypes.func,
    enableOnAndroid: PropTypes.bool,
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
      <FlatList
        ref='_rnkasv_keyboardView'
        keyboardDismissMode='interactive'
        contentInset={{bottom: keyboardSpace}}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={0}
        {...this.props}
        contentContainerStyle={newContentContainerStyle || contentContainerStyle}
        onScroll={this.onScroll}
      />
    )
  },
})

export default KeyboardAwareFlatList
