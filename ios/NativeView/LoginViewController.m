//
//  LoginViewController.m
//  NativeModuleProject
//
//  Created by Raşit Çolakel on 11.10.2024.
//

#import "LoginViewController.h"

@interface LoginViewController ()

@property (nonatomic, strong) UITextField *username;
@property (nonatomic, strong) UITextField *password;

@end

@implementation LoginViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    CGFloat padding = 20.0;
    CGFloat width = self.view.frame.size.width - 2 * padding;
    
    self.username = [[UITextField alloc] initWithFrame:CGRectMake(padding, 100, width, 40)];
    self.username.placeholder = @"Username";
    self.username.borderStyle = UITextBorderStyleRoundedRect;
    [self.view addSubview:self.username];
    
    self.password = [[UITextField alloc] initWithFrame:CGRectMake(padding, 150, width, 40)];
    self.password.placeholder = @"Password";
    self.password.borderStyle = UITextBorderStyleRoundedRect;
    [self.view addSubview:self.password];
    
    UIButton *login = [UIButton buttonWithType:UIButtonTypeSystem];
    login.frame = CGRectMake(padding, 200, width, 40);
    [login setTitle:@"Login" forState:UIControlStateNormal];
    [login addTarget:self action:@selector(login) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:login];
}

- (void)login {
    NSDictionary *data = @{
        @"username": self.username.text,
        @"password": self.password.text
    };

    [self.delegate sendEventToJS:@"onLogin" withBody:data];
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
