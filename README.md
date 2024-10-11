# Nasıl Bir Native Module oluşturulur?

React Native, native kodlarla yazılmış modülleri kullanarak, uygulamalarımıza native özellikler eklememize olanak sağlar. Bu sayede React Native tarafından desteklenmeyen özellikleri kullanabiliriz.

### Android İçin Native Module Oluşturma

Bir Android Native Module oluşturmak için aşağıdaki adımları takip edebilirsiniz.

**Module ve Package Oluşturma**

Android tarafta bir modül ve bir paket oluşturmamız gerekiyor. Oluşturacağımız bu modül ve paket android/app/src/main/java/com/ dizini altında oluşturulmalıdır.

```bash
android/app/src/main/java/com/{your_project_name}/{module_name}/MyModule.java
android/app/src/main/java/com/{your_project_name}/{module_name}/MyPackage.java
```

**MemoryModule oluşturma**

```java
package com.nativemoduleproject.MemoryModule;

// Gerekli importlar

public class MemoryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public MemoryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MemoryInfo";
    }
}
```

Yukarıda oluşturduğumuz MemoryModule sınıfı, React Native tarafından kullanılacak olan modülü temsil eder. Bu sınıfın içerisinde, modülün adını belirleyen `getName` fonksiyonu bulunmaktadır. Bu fonksiyon, modülün adını belirler. Modül adı, React Native tarafından kullanılacak olan modülün adıdır.

MemoryPackage oluşturma

```java
package com.nativemoduleproject.MemoryModule;

// Gerekli importlar

public class MemoryPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new MemoryModule(reactContext));

        return modules;
    }
}
```

Oluşturulan modülü MainActivity.java dosyasına eklemek

```java
...
import com.nativemoduleproject.MemoryModule.MemoryPackage;
...

@Override
protected List<ReactPackage> getPackages() {
  @SuppressWarnings("UnnecessaryLocalVariable")
  List<ReactPackage> packages = new PackageList(this).getPackages();
  // Yeni eklenen paketimizi burada ekliyoruz
  packages.add(new MemoryPackage());
  return packages;
}
```

Modülü kullanmak

```typescript
import { NativeModules } from 'react-native';

const { MemoryInfo } = NativeModules;

console.log(MemoryInfo);
```

Yukarıdaki kodun çıktısı:

```json
{
    "getConstants": [Function anonymous]
}
```

Oluşturulan MemoryModule'e React Native taraftan erişebileceğimiz `getMemoryInfo` fonksiyonunu ekleyelim. Bu fonksiyon, cihazın bellek bilgilerini döndüren bir fonksiyon olacak.

```java
    @ReactMethod
    public void getMemoryInfo(Promise promise) {
        try {
            ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
            ActivityManager.MemoryInfo memoryInfo = new ActivityManager.MemoryInfo();
            activityManager.getMemoryInfo(memoryInfo);

            long totalMemory = memoryInfo.totalMem;
            long availableMemory = memoryInfo.availMem;
            long usedMemory = totalMemory - availableMemory;

            WritableMap map = Arguments.createMap();
            map.putDouble("totalMemory", totalMemory);
            map.putDouble("availableMemory", availableMemory);
            map.putDouble("usedMemory", usedMemory);

            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
```

Bu fonksiyonu kullanarak cihazın bellek bilgilerini alabiliriz.

```typescript
import { NativeModules } from 'react-native';

MemoryInfo.getMemoryInfo().then((memoryInfo) => {
  console.log(memoryInfo);
}).catch((error) => {
  console.log(error);
});
```

Çıktısı:

```json
{
  "availableMemory": 1124524032,
  "totalMemory": 2074894336,
  "usedMemory": 950370304
}
```

### iOS İçin Native Module Oluşturma

iOS tarafta native modül için interface ve implementation dosyaları oluşturmalıyız. Bu dosyalar, ios/{project_name}/ dizini altında oluşturulmalıdır. Oluşturulacak dosyalar AppDelegate ile aynı dizinde olmalıdır. İmplementasyon dosyası .m uzantılı olmalı, interface dosyası ise .h uzantılı olmalıdır.

```bash
ios/{project_name}/MemoryInfo.h
ios/{project_name}/MemoryInfo.m
```

MemoryInfo.h dosyası

```objc
#import <React/RCTBridgeModule.h>

@interface MemoryInfo : NSObject <RCTBridgeModule>

@end
```

MemoryInfo.m dosyası

```objc
#import "MemoryInfo.h"

@implementation MemoryInfo

RCT_EXPORT_MODULE(MemoryInfo);

@end
```

MemoryInfo sınıfı, React Native tarafından kullanılacak olan modülü temsil eder. `RCT_EXPORT_MODULE` ile dışa aktarılabilir bir modül oluşturulur. Bu fonksiyon, modülün adını belirler. Modül adı, React Native tarafından kullanılacak olan modülün adıdır. Bu durumda modül adı MemoryInfo olacaktır.

MemoryInfo sınıfına bellek bilgilerini döndüren bir fonksiyon ekleyelim.

```objc

RCT_EXPORT_METHOD(getMemoryInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  @try {
    mach_port_t host_port;
    mach_msg_type_number_t host_size;
    vm_size_t pagesize;

    host_port = mach_host_self();
    host_size = sizeof(vm_statistics_data_t) / sizeof(integer_t);
    host_page_size(host_port, &pagesize);

    vm_statistics_data_t vm_stat;

    if (host_statistics(host_port, HOST_VM_INFO, (host_info_t)&vm_stat, &host_size) != KERN_SUCCESS) {
        NSLog(@"Failed to fetch vm statistics");
    }

    natural_t mem_used = (vm_stat.active_count +
                          vm_stat.inactive_count +
                          vm_stat.wire_count) * pagesize;
    natural_t mem_free = vm_stat.free_count * pagesize;
    natural_t mem_total = mem_used + mem_free;
    
    resolve(@{
      @"totalMemory": @(mem_total),
      @"availableMemory": @(mem_free),
      @"usedMemory": @(mem_used)
    });

  } @catch (NSException *exception) {
    reject(@"exception", exception.reason, nil);
  }
}
```

Bu fonksiyonu kullanarak cihazın bellek bilgilerini aşağıdaki gibi alabiliriz.

```typescript
import { NativeModules } from 'react-native';

const { MemoryInfo } = NativeModules;

MemoryInfo.getMemoryInfo().then((memoryInfo) => {
  console.log(memoryInfo);
}).catch((error) => {
  console.log(error);
});
```

Çıktısı:

```json
{
  "availableMemory": 86081536,
  "totalMemory": 93208576,
  "usedMemory": 7127040
}
```

## TypeScript ile daha iyi bir Native Module oluşturma

Oluşturmuş olduğumuz bu modülü TypeScript ile daha iyi bir şekilde kullanmak için `modules/MemoryInfo.ts` adında bir dosya oluşturup. Native tarafta tanımladığımız fonksiyonları burada tanımlayabiliriz.

```typescript
import {NativeModules} from 'react-native';

const {MemoryInfo} = NativeModules;

interface MemoryInfoInterFace {
  getMemoryInfo: () => Promise<{
    availableMemory: number;
    totalMemory: number;
    usedMemory: number;
  }>;
}

export default MemoryInfo as MemoryInfoInterFace;
```

Yukarıdaki TypeScript tanımlaması ile type-safe bir şekilde modülü kullanabiliriz.

```typescript
import MemoryInfo from './modules/MemoryInfo';

MemoryInfo.getMemoryInfo().then((memoryInfo) => {
  console.log(memoryInfo);
}).catch((error) => {
  console.log(error);
});
```


## Native View Oluşturma

Android ve iOS kodlarını kullanarak, React Native tarafında modül aracılığıyla native view oluşturabiliriz. Oluşturulacak olan bu view için Android tarafta LoginActivity,
iOS tarafta ise LoginViewController oluşturacağız. Bu view'da username, password ve login butonu olacak. Girilen username ve password bilgileri React Native tarafına event olarak gönderilecek.

### Android İçin Native View Oluşturma

Yukarıdaki açıklama için aşağıdaki dosyaları oluşturmamız gerekmekte.

```bash
.../{your_project_name}/NativeViewModule/NativeViewPackage.java
.../{your_project_name}/NativeViewModule/NativeViewModule.java
.../{your_project_name}/NativeViewModule/NativeViewContext.java
.../{your_project_name}/NativeViewModule/LoginActivity.java
```

NativeViewModule.java

```java
public class NativeViewModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public NativeViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "NativeView";
    }

    @ReactMethod
    public void open(){
        Intent intent = new Intent(getCurrentActivity(), LoginActivity.class);
        NativeViewContext.context = MainApplication.getMainApplication().getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        getCurrentActivity().startActivity(intent);
    }

    public static void sendEventToJS(String eventName, @Nullable WritableMap data) {
        NativeViewContext.context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, data);
    }
}
```

NativeViewPackage.java

```java
public class NativeViewPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new NativeViewModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```

LoginActivity.java

```java
public class LoginActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        EditText username = findViewById(R.id.username);
        EditText password = findViewById(R.id.password);
        Button login = findViewById(R.id.login);

        login.setOnClickListener(v -> {
            WritableMap map = Arguments.createMap();
            map.putString("username", username.getText().toString());
            map.putString("password", password.getText().toString());
            NativeViewModule.sendEventToJS("onLogin", map);
            finish();
        });
    }
}
```

NativeViewContext.java

```java
public class NativeViewContext {
    public static ReactContext context;
}
```

### iOS İçin Native View Oluşturma

Yukarıdaki açıklama için aşağıdaki dosyaları oluşturmamız gerekmekte.

```bash
.../{project_name}/NativeViewModule/NativeViewModule.h
.../{project_name}/NativeViewModule/NativeViewModule.m
.../{project_name}/NativeViewModule/LoginViewController.h
.../{project_name}/NativeViewModule/LoginViewController.m
```

NativeViewModule.h

```objc
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface NativeViewModule : RCTEventEmitter <RCTBridgeModule>

@end

```

NativeViewModule.m

```objc
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

```

LoginViewController.h

```objc
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

@protocol LoginViewControllerDelegate <NSObject>
    - (void)sendEventToJS:(NSString *)eventName withBody:(NSDictionary *)body;
@end

@interface LoginViewController : UIViewController

@property (nonatomic, weak) id<LoginViewControllerDelegate> delegate;

@end
```

LoginViewController.m

```objc
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
```