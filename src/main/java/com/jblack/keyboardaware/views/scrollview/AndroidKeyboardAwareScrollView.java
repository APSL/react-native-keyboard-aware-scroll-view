package com.jblack.keyboardaware.views.scrollview;

import android.content.Context;
import android.os.SystemClock;
import android.util.Log;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.scroll.ReactScrollView;
import com.jblack.keyboardaware.events.AndroidKeyboardHiddenEvent;
import com.jblack.keyboardaware.events.AndroidKeyboardVisibleEvent;


public class AndroidKeyboardAwareScrollView extends ReactScrollView {

    public AndroidKeyboardAwareScrollView(Context context) {
        super(context);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        final int proposedWidth = MeasureSpec.getSize(widthMeasureSpec);
        final int proposedHeight = MeasureSpec.getSize(heightMeasureSpec);
        final int currentWidth = getWidth();
        final int currentHeight = getHeight();

        Log.v("AKAScrollView", String.format("onMeasure - currentHeight [%d] proposedHeight [%d] currentWidth [%d] proposedWidth [%d]",
                currentHeight, proposedHeight, currentWidth, proposedWidth));

        // Check if the view height is changing, it isn't the initial onMeasure call, and we aren't changing device orientation
        if ((currentHeight != proposedHeight) && (currentHeight != 0) && (currentWidth == proposedWidth)) {
            // Check if it is a change greater than 25% of the current height, to allow for things like extra
            //  keyboard rows being shown/hidden
            final double percentDifferenceThreshold = 0.25;
            final double difference = Math.abs(currentHeight - proposedHeight);

            if (difference / currentHeight > percentDifferenceThreshold) {
                final EventDispatcher eventDispatcher = ((ThemedReactContext) getContext())
                        .getNativeModule(UIManagerModule.class)
                        .getEventDispatcher();

                if (currentHeight > proposedHeight) {
                    eventDispatcher.dispatchEvent(new AndroidKeyboardVisibleEvent(getId(), SystemClock.uptimeMillis(), proposedHeight));
                } else if (currentHeight < proposedHeight) {
                    eventDispatcher.dispatchEvent(new AndroidKeyboardHiddenEvent(getId(), SystemClock.uptimeMillis()));
                }
            }
        }

        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

}
