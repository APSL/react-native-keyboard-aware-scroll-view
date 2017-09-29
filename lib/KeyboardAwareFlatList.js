/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Platform } from 'react-native'
import listenToKeyboardEvents from './KeyboardAwareHOC'

class KeyboardAwareFlatList extends React.Component {
  static propTypes = {
    viewIsInsideTabBar: PropTypes.bool,
    resetScrollToCoords: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    onScroll: PropTypes.func,
    enableOnAndroid: PropTypes.bool
  }

  componentWillMount() {
    this.setViewIsInsideTabBar(!!this.props.viewIsInsideTabBar)
    if (this.props.resetScrollToCoords) {
      this.setResetScrollToCoords(this.props.resetScrollToCoords)
    }
  }

  onScroll = (
    e: SyntheticEvent<*> & { nativeEvent: { contentOffset: number } }
  ) => {
    this.handleOnScroll(e)
    this.props.onScroll && this.props.onScroll(e)
  }

  render() {
    const { enableOnAndroid, contentContainerStyle } = this.props
    const { keyboardSpace } = this.state
    let newContentContainerStyle
    if (Platform.OS === 'android' && enableOnAndroid) {
      newContentContainerStyle = [].concat(contentContainerStyle).concat({
        paddingBottom:
          ((contentContainerStyle || {}).paddingBottom || 0) + keyboardSpace
      })
    }
    return (
      <FlatList
        ref={this.handleRef}
        keyboardDismissMode="interactive"
        contentInset={{ bottom: keyboardSpace }}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={1}
        {...this.props}
        contentContainerStyle={newContentContainerStyle || contentContainerStyle}
        onScroll={this.onScroll}
      />
    )
  }
}

export default listenToKeyboardEvents(KeyboardAwareFlatList)
