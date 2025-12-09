#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .plugin(tauri_plugin_bridge_core::init())
    .setup(|app| {
      // 为移动端创建 webview 窗口
      #[cfg(mobile)]
      {
        use tauri::{WebviewUrl, webview::WebviewWindowBuilder};
        let _ = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
          .build()?;
      }

      // 注册 tauri-plugin-log 插件
      app.handle().plugin(
        tauri_plugin_log::Builder::new()
          .target(tauri_plugin_log::Target::new(
            tauri_plugin_log::TargetKind::Webview,
          ))
          .build(),
      )?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
