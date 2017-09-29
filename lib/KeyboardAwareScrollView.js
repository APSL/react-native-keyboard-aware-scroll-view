/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Platform } from 'react-native'
import listenToKeyboardEvents from './KeyboardAwareHOC'

import type {
  KeyboardAwareHOCProps,
  KeyboardAwareHOCState
} from './KeyboardAwareHOC'

type Props = {
  contentContainerStyle?: any,
  viewIsInsideTabBar?: boolean,
  resetScrollToCoords?: {
    x: number,
    y: number
  },
  enableOnAndroid?: boolean,
  children?: any
}
type State = {
  keyboardSpace: number
}

class KeyboardAwareScrollView extends React.Component<
  KeyboardAwareHOCProps & Props,
  KeyboardAwareHOCState
> {
  static propTypes = {
    ...ScrollView.propTypes,
    viewIsInsideTabBar: PropTypes.bool,
    resetScrollToCoords: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    enableOnAndroid: PropTypes.bool
  }

  componentWillMount() {
    this.setViewIsInsideTabBar(this.props.viewIsInsideTabBar)
    this.setResetScrollToCoords(this.props.resetScrollToCoords)
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
      <ScrollView
        ref={this.handleRef}
        keyboardDismissMode="interactive"
        contentInset={{ bottom: keyboardSpace }}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={1}
        {...this.props}
        contentContainerStyle={newContentContainerStyle || contentContainerStyle}
        onScroll={e => {
          this.handleOnScroll(e)
          this.props.onScroll && this.props.onScroll(e)
        }}
      >
        {this.props.children}
      </ScrollView>
    )
  }
}

export default listenToKeyboardEvents(KeyboardAwareScrollView)
