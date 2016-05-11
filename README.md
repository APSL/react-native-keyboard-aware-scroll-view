# react-native-keyboard-aware-scroll-view
A ScrollView component that handles keyboard appearance.

## Installation
You need `react-native>=0.12.0` to use this library. Installation can be done through ``npm``:

```shell
npm i react-native-keyboard-aware-scroll-view --save
```

## Usage
You can use the ``KeyboardAwareScrollView`` or the ``KeyboardAwareListView``
components. Both accept ``ScrollView`` and ``ListView`` default props and
implements a custom ``KeyboardAwareMixin`` to handle keyboard appearance.
The mixin is also available if you want to use it in any other component.

Import ``react-native-keyboard-aware-scroll-view`` and wrap your content inside
it:

```js
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
```

```jsx
<KeyboardAwareScrollView>
  <View>
    <TextInput />
  </View>
</KeyboardAwareScrollView>
```

The component accepts the experimental prop ``viewIsInsideTabBar``, which tries
to solve resizing issues when rendering inside a ``TabBar`` component.

## Auto-scroll in `TextInput` fields
In order to perform an auto-scroll whenever a `TextInput` field gets focused, you can use the built-in method `scrollToFocusedInput`. Define the following function for each of your `onFocus` event on your inputs:

```js
_scrollToInput (event, reactNode) {
  // Add a 'scroll' ref to your ScrollView
  this.refs.scroll.scrollToFocusedInput(event, reactNode)
}
```

```jsx
<KeyboardAwareScrollView ref='scroll'>
  <View>
    <TextInput ref='myInput' onFocus={this._scrollToInput}/>
  </View>
</KeyboardAwareScrollView>
```

## Register to keyboard events
You can register to `ScrollViewResponder` events `onKeyboardWillShow` and `onKeyboardWillHide`:

```js
<KeyboardAwareScrollView
  onKeyboardWillShow={(frames: Object) => {
    console.log('Keyboard event', frames)
  }}>
  <View>
    <TextInput />
  </View>
</KeyboardAwareScrollView>
```

## License

MIT.
