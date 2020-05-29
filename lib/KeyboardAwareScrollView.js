/* @flow */

import { ScrollView } from 'react-navigation'
import listenToKeyboardEvents from './KeyboardAwareHOC'

export default listenToKeyboardEvents(ScrollView)
