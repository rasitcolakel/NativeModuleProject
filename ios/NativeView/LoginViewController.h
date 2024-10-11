//
//  LoginViewController.h
//  NativeModuleProject
//
//  Created by Raşit Çolakel on 11.10.2024.
//


#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

@protocol LoginViewControllerDelegate <NSObject>
    - (void)sendEventToJS:(NSString *)eventName withBody:(NSDictionary *)body;
@end

@interface LoginViewController : UIViewController

@property (nonatomic, weak) id<LoginViewControllerDelegate> delegate;

@end
