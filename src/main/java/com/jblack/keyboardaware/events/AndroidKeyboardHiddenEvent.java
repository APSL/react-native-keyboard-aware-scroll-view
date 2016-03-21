package com.jblack.keyboardaware.events;


import android.util.Log;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;


public class AndroidKeyboardHiddenEvent extends Event<AndroidKeyboardHiddenEvent> {

    private static final String EVENT_NAME = "androidKeyboardHidden";

    public AndroidKeyboardHiddenEvent(int viewTag, long timestampMs) {
        super(viewTag, timestampMs);
        Log.v("AKAScrollView", String.format("AndroidKeyboardHiddenEvent created with viewTag [%d], timestamp [%d]", viewTag, timestampMs));
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
    }
}
