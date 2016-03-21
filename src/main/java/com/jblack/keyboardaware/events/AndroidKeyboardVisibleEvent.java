package com.jblack.keyboardaware.events;


import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;


public class AndroidKeyboardVisibleEvent extends Event<AndroidKeyboardVisibleEvent> {

    private static final String EVENT_NAME = "androidKeyboardVisible";
    private final int height;

    public AndroidKeyboardVisibleEvent(int viewTag, long timestampMs, int height) {
        super(viewTag, timestampMs);
        this.height = height;
        Log.v("AKAScrollView", String.format("AndroidKeyboardVisibleEvent created with viewTag [%d], timestamp [%d], height [%d]",
                viewTag, timestampMs, height));
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap map = Arguments.createMap();
        map.putInt("height", height);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), map);
    }
}
