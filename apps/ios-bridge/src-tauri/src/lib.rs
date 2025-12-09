use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct DeviceInfo {
    udid: String,
    name: String,
    product_type: String,
    version: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CommandPayload {
    action: String,
    params: Option<serde_json::Value>,
}

/// 调用 ios-go 可执行文件
fn call_ios_go(action: &str, params: Option<serde_json::Value>) -> Result<String, String> {
    let exe_path = if cfg!(debug_assertions) {
        // 开发模式：使用相对路径
        "./ios-go/ios-go"
    } else {
        // 生产模式：使用资源目录中的可执行文件
        "./ios-go"
    };

    let cmd_payload = CommandPayload {
        action: action.to_string(),
        params,
    };

    let cmd_json = serde_json::to_string(&cmd_payload)
        .map_err(|e| format!("Failed to serialize command: {}", e))?;

    let output = Command::new(exe_path)
        .arg(cmd_json)
        .output()
        .map_err(|e| format!("Failed to execute ios-go: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("ios-go error: {}", stderr));
    }

    let stdout = String::from_utf8(output.stdout)
        .map_err(|e| format!("Failed to parse output: {}", e))?;

    Ok(stdout)
}

/// 列出所有 iOS 设备
#[tauri::command]
fn list_ios_devices() -> Result<Vec<DeviceInfo>, String> {
    let output = call_ios_go("list", None)?;
    let devices: Vec<DeviceInfo> = serde_json::from_str(&output)
        .map_err(|e| format!("Failed to parse device list: {}", e))?;
    Ok(devices)
}

/// 获取指定设备信息
#[tauri::command]
fn get_ios_device_info(udid: String) -> Result<DeviceInfo, String> {
    let params = Some(serde_json::json!({ "udid": udid }));
    let output = call_ios_go("info", params)?;
    let device: DeviceInfo = serde_json::from_str(&output)
        .map_err(|e| format!("Failed to parse device info: {}", e))?;
    Ok(device)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .invoke_handler(tauri::generate_handler![list_ios_devices, get_ios_device_info])
    .setup(|app| {
      if let Some(window) = app.get_webview_window("main") {
        #[cfg(target_os = "macos")]
        {
          // macOS: 使用 Overlay 样式，保留原生按钮
          let _ = window.set_title_bar_style(tauri::TitleBarStyle::Overlay);
        }
        
        #[cfg(target_os = "windows")]
        {
          // Windows: 禁用原生装饰，使用自定义标题栏
          let _ = window.set_decorations(false);
        }
      }

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
