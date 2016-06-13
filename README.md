# react-native-keyboard-aware-scroll-view

<img src="https://travis-ci.org/APSL/react-native-keyboard-aware-scroll-view.svg?branch=master" />

A ScrollView component that handles keyboard appearance and automatically scrolls to focused `TextInput`.

<p align="center">
<img src="https://raw.githubusercontent.com/wiki/APSL/react-native-keyboard-aware-scroll-view/kasv.gif" alt="Scroll demo" width="400">
</p>

## Supported versions
Use `react-native>=0.25.0` for `v0.0.7` & up and `v0.0.6` for older RN versions.

## Installation
Installation can be done through ``npm``:

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

## Auto-scroll in `TextInput` fields
As of `v0.1.0`, the component auto scrolls to the focused `TextInput` 😎. For versions `v0.0.7` and older you can do the following.

### Programatically scroll to any `TextInput`
In order to scroll to any `TextInput` field, you can use the built-in method `scrollToFocusedInput`. Example:

```js
_scrollToInput (reactNode: any) {
  // Add a 'scroll' ref to your ScrollView
  this.refs.scroll.scrollToFocusedInput(reactNode)
}
```

```jsx
<KeyboardAwareScrollView ref='scroll'>
  <View>
    <TextInput onFocus={(event: Event) => {
      // `bind` the function if you're using ES6 classes
      this._scrollToInput(ReactNative.findNodeHandle(event.target))
    }/>
  </View>
</KeyboardAwareScrollView>
```

### Programatically scroll to any position
There's another built-in function that lets you programatically scroll to any position of the scroll view:

```js
this.refs.scroll.scrollToPosition(0, 0, true)
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

## API
### Props
All the `ScrollView`/`ListView` props will be passed.

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `viewIsInsideTabBar` | `boolean` | Adds an extra offset that represents the `TabBarIOS` height. |
| `resetScrollToCoords` | `Object: {x: number, y: number}` | Coordinates that will be used to reset the scroll when the keyboard hides. |
| `enableAutoAutomaticScroll` | `boolean` | When focus in TextInput will scroll the position, default is enabled. |


## License

MIT.
