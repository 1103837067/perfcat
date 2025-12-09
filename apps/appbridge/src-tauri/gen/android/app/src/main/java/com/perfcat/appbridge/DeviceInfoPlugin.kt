package com.perfcat.appbridge

import android.app.Activity
import android.os.Build
import android.provider.Settings
import android.util.Log
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@TauriPlugin
class DeviceInfoPlugin(private val activity: Activity) : Plugin(activity) {
    
    @Command
    fun getDeviceInfo(invoke: Invoke) {
        try {
            val deviceInfo = JSObject()
            
            // 设备基本信息
            deviceInfo.put("manufacturer", Build.MANUFACTURER)
            deviceInfo.put("model", Build.MODEL)
            deviceInfo.put("brand", Build.BRAND)
            deviceInfo.put("device", Build.DEVICE)
            deviceInfo.put("product", Build.PRODUCT)
            deviceInfo.put("hardware", Build.HARDWARE)
            
            // Android 版本信息
            deviceInfo.put("androidVersion", Build.VERSION.RELEASE)
            deviceInfo.put("sdkInt", Build.VERSION.SDK_INT)
            deviceInfo.put("codename", Build.VERSION.CODENAME)
            
            // 屏幕信息
            val displayMetrics = activity.resources.displayMetrics
            val screenInfo = JSObject()
            screenInfo.put("width", displayMetrics.widthPixels)
            screenInfo.put("height", displayMetrics.heightPixels)
            screenInfo.put("density", displayMetrics.density.toDouble())
            screenInfo.put("densityDpi", displayMetrics.densityDpi)
            screenInfo.put("scaledDensity", displayMetrics.scaledDensity.toDouble())
            deviceInfo.put("screen", screenInfo)
            
            // 设备 ID
            val deviceId = Settings.Secure.getString(
                activity.contentResolver,
                Settings.Secure.ANDROID_ID
            )
            deviceInfo.put("androidId", deviceId)
            
            // CPU 架构
            deviceInfo.put("cpuAbi", Build.SUPPORTED_ABIS.joinToString(","))
            
            // 其他信息
            deviceInfo.put("fingerprint", Build.FINGERPRINT)
            
            // 序列号（需要权限，可能获取失败）
            val serial = try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Build.getSerial()
                } else {
                    @Suppress("DEPRECATION")
                    Build.SERIAL
                }
            } catch (e: SecurityException) {
                Log.w("DeviceInfoPlugin", "Failed to get serial number: ${e.message}")
                "UNKNOWN"
            }
            deviceInfo.put("serial", serial)
            
            invoke.resolve(deviceInfo)
        } catch (e: Exception) {
            Log.e("DeviceInfoPlugin", "Failed to get device info", e)
            invoke.reject("Failed to get device info: ${e.message}")
        }
    }
}
