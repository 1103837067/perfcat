package com.plugin.bridgecore

import android.app.Activity
import android.content.Context
import android.content.res.Configuration
import android.os.Build
import android.provider.Settings
import android.util.DisplayMetrics
import android.util.Log
import android.view.WindowManager
import app.tauri.plugin.JSObject

class Example(private val activity: Activity) {
    fun pong(value: String): String {
        Log.i("Pong", value)
        return value
    }

    fun getDeviceInfo(): JSObject {
        val deviceInfo = JSObject()
        
        try {
            // 基本信息
            deviceInfo.put("manufacturer", Build.MANUFACTURER)
            deviceInfo.put("model", Build.MODEL)
            deviceInfo.put("brand", Build.BRAND)
            deviceInfo.put("device", Build.DEVICE)
            deviceInfo.put("product", Build.PRODUCT)
            deviceInfo.put("hardware", Build.HARDWARE)
            deviceInfo.put("fingerprint", Build.FINGERPRINT)
            deviceInfo.put("serial", try { Build.getSerial() } catch (e: Exception) { "unknown" })
            
            // Android 版本信息
            deviceInfo.put("androidVersion", Build.VERSION.RELEASE)
            deviceInfo.put("sdkInt", Build.VERSION.SDK_INT)
            deviceInfo.put("codename", Build.VERSION.CODENAME)
            deviceInfo.put("incremental", Build.VERSION.INCREMENTAL)
            deviceInfo.put("securityPatch", Build.VERSION.SECURITY_PATCH)
            
            // CPU 信息
            deviceInfo.put("cpuAbi", Build.SUPPORTED_ABIS[0])
            deviceInfo.put("cpuAbis", Build.SUPPORTED_ABIS.joinToString(","))
            deviceInfo.put("cpuAbi64", Build.SUPPORTED_64_BIT_ABIS.joinToString(","))
            deviceInfo.put("cpuAbi32", Build.SUPPORTED_32_BIT_ABIS.joinToString(","))
            
            // 屏幕信息
            val windowManager = activity.getSystemService(Context.WINDOW_SERVICE) as WindowManager
            val displayMetrics = DisplayMetrics()
            windowManager.defaultDisplay.getMetrics(displayMetrics)
            
            val screenInfo = JSObject()
            screenInfo.put("width", displayMetrics.widthPixels)
            screenInfo.put("height", displayMetrics.heightPixels)
            screenInfo.put("density", displayMetrics.density.toDouble())
            screenInfo.put("densityDpi", displayMetrics.densityDpi)
            screenInfo.put("scaledDensity", displayMetrics.scaledDensity.toDouble())
            screenInfo.put("xdpi", displayMetrics.xdpi.toDouble())
            screenInfo.put("ydpi", displayMetrics.ydpi.toDouble())
            
            val realMetrics = DisplayMetrics()
            windowManager.defaultDisplay.getRealMetrics(realMetrics)
            screenInfo.put("realWidth", realMetrics.widthPixels)
            screenInfo.put("realHeight", realMetrics.heightPixels)
            
            deviceInfo.put("screen", screenInfo)
            
            // 系统信息
            deviceInfo.put("androidId", Settings.Secure.getString(activity.contentResolver, Settings.Secure.ANDROID_ID))
            deviceInfo.put("board", Build.BOARD)
            deviceInfo.put("bootloader", Build.BOOTLOADER)
            deviceInfo.put("display", Build.DISPLAY)
            deviceInfo.put("host", Build.HOST)
            deviceInfo.put("id", Build.ID)
            deviceInfo.put("tags", Build.TAGS)
            deviceInfo.put("type", Build.TYPE)
            deviceInfo.put("user", Build.USER)
            deviceInfo.put("time", Build.TIME)
            
            // 配置信息
            val config = activity.resources.configuration
            val configInfo = JSObject()
            configInfo.put("orientation", config.orientation)
            configInfo.put("screenLayout", config.screenLayout)
            configInfo.put("uiMode", config.uiMode)
            configInfo.put("smallestScreenWidthDp", config.smallestScreenWidthDp)
            configInfo.put("screenWidthDp", config.screenWidthDp)
            configInfo.put("screenHeightDp", config.screenHeightDp)
            configInfo.put("densityDpi", config.densityDpi)
            configInfo.put("locale", config.locale.toString())
            deviceInfo.put("configuration", configInfo)
            
            // 内存信息
            val runtime = Runtime.getRuntime()
            val memoryInfo = JSObject()
            memoryInfo.put("maxMemory", runtime.maxMemory())
            memoryInfo.put("totalMemory", runtime.totalMemory())
            memoryInfo.put("freeMemory", runtime.freeMemory())
            memoryInfo.put("usedMemory", runtime.totalMemory() - runtime.freeMemory())
            deviceInfo.put("memory", memoryInfo)
            
        } catch (e: Exception) {
            Log.e("DeviceInfo", "Error getting device info", e)
            deviceInfo.put("error", e.message)
        }
        
        return deviceInfo
    }
}
