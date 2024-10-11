//
//  NativeViewModule.m
//  NativeModuleProject
//
//  Created by Raşit Çolakel on 11.10.2024.
//


#import "NativeViewModule.h"
#import "LoginViewController.h"

@implementation NativeViewModule

RCT_EXPORT_MODULE(NativeView);

RCT_EXPORT_METHOD(open) {
  dispatch_async(dispatch_get_main_queue(), ^{
    LoginViewController *loginViewController = [[LoginViewController alloc] init];
    loginViewController.delegate = self;
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootViewController presentViewController:loginViewController animated:YES completion:nil];
  });
}

- (void)sendEventToJS:(NSString *)eventName withBody:(NSDictionary *)body {
  [self sendEventWithName:eventName body:body];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onLogin"];
}

@end
