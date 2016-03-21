package com.jblack.keyboardaware.views.scrollview;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollViewManager;


public class AndroidKeyboardAwareScrollViewManager extends ReactScrollViewManager {

    private static final String REACT_CLASS = "AndroidKeyboardAwareScrollView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public AndroidKeyboardAwareScrollView createViewInstance(ThemedReactContext reactContext) {
        return new AndroidKeyboardAwareScrollView(reactContext);
    }
}