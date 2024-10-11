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

            WritableMap map = Arguments.createMap();
            map.putDouble("totalMemory", totalMemory);
            map.putDouble("availableMemory", availableMemory);

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
  "totalMemory": 2074894336
}
```
