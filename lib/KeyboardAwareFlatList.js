/* @flow */

import { FlatList } from 'react-native'
import listenToKeyboardEvents from './KeyboardAwareHOC'

export default listenToKeyboardEvents(FlatList)
