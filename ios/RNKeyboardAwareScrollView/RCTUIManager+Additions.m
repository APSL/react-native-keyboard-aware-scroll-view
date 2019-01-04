#import "RCTUIManager+Additions.h"
#import <UIKit/UIKit.h>

@implementation RCTUIManager (Additions)

RCT_EXPORT_METHOD(measureSelectionInWindow:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback)
{
    [self addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        UIView *newResponder = [uiManager viewForReactTag:reactTag];
        if ( !newResponder ) {
            RCTLogWarn(@"measureSelectionInWindow cannot find view with tag #%@", reactTag);
            callback(@[@"View doesn't exist"]);
            return;
        }
        CGRect windowFrame = [newResponder.window convertRect:newResponder.frame fromView:newResponder.superview];
        if ( [newResponder conformsToProtocol:@protocol(UITextInput)] ) {
            id<UITextInput> textInput = (id<UITextInput>)newResponder;
            UITextPosition *endPosition = textInput.selectedTextRange.end;
            if ( endPosition ) {
                CGRect selectionEndRect = [textInput caretRectForPosition:endPosition];
                CGFloat textInputBottomTextInset = 0;
                if ( [textInput isKindOfClass:[UITextView class]] ) {
                    textInputBottomTextInset = ((UITextView *)textInput).textContainerInset.bottom;
                }
                callback(@[[NSNull null],
                           @(windowFrame.origin.x),  //text input x
                           @(windowFrame.origin.y),  //text input y
                           @(windowFrame.size.width),  //text input width
                           @(windowFrame.size.height),  //text input height
                           @(windowFrame.origin.x + selectionEndRect.origin.x),  //caret x
                           @(windowFrame.origin.y + selectionEndRect.origin.y),  //caret y
                           @(selectionEndRect.origin.x),  //caret relative x
                           @(selectionEndRect.origin.y),  //caret relative y
                           @(selectionEndRect.size.width),  //caret width
                           @(selectionEndRect.size.height),  //caret height
                           @(textInputBottomTextInset)  // text input bottom text inset
                           ]);
                return;
            }
        }
        callback(@[@"Text selection not available"]);
    }];
}

@end
