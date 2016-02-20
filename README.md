# react-native-keyboard-aware-scroll-view
A ScrollView component that handles keyboard appearance.

## Installation
You can install this component through ``npm``:

```shell
npm i react-native-keyboard-aware-scroll-view --save
```

### To add it to your Android project:
- Add to android/settings.gradle

```groovy
include ':ReactNativeKeyboardAwareScrollView'
project(':ReactNativeKeyboardAwareScrollView').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-keyboard-aware-scroll-view')
```
- Add to android/app/build.gradle

```groovy
compile project(':ReactNativeKeyboardAwareScrollView')
```

- Add to android/app/src/main/AndroidManifest.xml

```xml
<application ... >
    <activity
        android:windowSoftInputMode="adjustResize" ... >
        ...
    </activity>
    ...
</application>
```

- Register module in MainActivity.java

```java
import com.jblack.keyboardaware.views.scrollview.AndroidKeyboardAwareScrollViewPackage;    // <--- import

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {
  ......

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    ...

    mReactInstanceManager = ReactInstanceManager.builder()
      ...      
      .addPackage(new AndroidKeyboardAwareScrollViewPackage())  // <--- add here
      ...
      .build();

    ...
  }

  ......
}
```

## Usage
You can use the ``KeyboardAwareScrollView`` or the ``KeyboardAwareListView``
components. Both accept ``ScrollView`` and ``ListView`` default props and
implements a custom ``KeyboardAwareMixin`` to handle keyboard appearance.
The mixin is also available if you want to use it in any other component.

Note: The KeyboardAwareListView is not currently supported in Android.

Import ``react-native-keyboard-aware-scroll-view`` and wrap your content inside it:

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
