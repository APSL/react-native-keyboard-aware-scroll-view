# react-native-keyboard-aware-scroll-view
A ScrollView component that handles keyboard appearance.

## Installation
You can install this component through ``npm``:

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

## License

MIT.
