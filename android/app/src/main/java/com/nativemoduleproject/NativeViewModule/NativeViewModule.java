package com.nativemoduleproject.NativeViewModule;

import android.content.Intent;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.nativemoduleproject.MainApplication;

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
