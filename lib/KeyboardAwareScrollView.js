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
  children?: any,
  onScroll?: Function,
  handleRef?: Function
}
type State = {
  keyboardSpace: number
}

class KeyboardAwareScrollView extends React.Component<
  KeyboardAwareHOCProps & Props & KeyboardAwareHOCState,
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

  render() {
    const { enableOnAndroid, contentContainerStyle, keyboardSpace } = this.props
    let newContentContainerStyle
    if (Platform.OS === 'android' && enableOnAndroid) {
      newContentContainerStyle = [].concat(contentContainerStyle).concat({
        paddingBottom:
          ((contentContainerStyle || {}).paddingBottom || 0) + keyboardSpace
      })
    }
    return (
      <ScrollView
        ref={this.props.handleRef}
        keyboardDismissMode="interactive"
        contentInset={{ bottom: keyboardSpace }}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={1}
        {...this.props}
        contentContainerStyle={newContentContainerStyle || contentContainerStyle}
        onScroll={e => {
          this.props.handleOnScroll(e)
          this.props.onScroll && this.props.onScroll(e)
        }}
      >
        {this.props.children}
      </ScrollView>
    )
  }
}

export default listenToKeyboardEvents(KeyboardAwareScrollView)
