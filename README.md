# react-native-keyboard-aware-scroll-view
A ScrollView component that handles keyboard appearance.

## Usage
Import ``react-native-keyboard-aware-scroll-view`` and wrap your content inside it:

```jsx
<KeyboardAwareScrollView>
  <View>
    <Text>Hello world!</Text>
  </View>
</KeyboardAwareScrollView>
```

The component accepts three props, ``style``, ``children`` (the children node to render inside) and the experimental prop ``viewIsInsideTabBar``, which tries to solve resizing issues when rendering inside a ``TabBar`` component.

## License

MIT.
