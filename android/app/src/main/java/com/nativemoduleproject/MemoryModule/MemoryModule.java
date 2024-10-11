package com.nativemoduleproject.MemoryModule;

import android.app.ActivityManager;
import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

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
}