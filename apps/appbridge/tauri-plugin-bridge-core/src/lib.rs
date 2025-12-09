use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::BridgeCore;
#[cfg(mobile)]
use mobile::BridgeCore;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the bridge-core APIs.
pub trait BridgeCoreExt<R: Runtime> {
  fn bridge_core(&self) -> &BridgeCore<R>;
}

impl<R: Runtime, T: Manager<R>> crate::BridgeCoreExt<R> for T {
  fn bridge_core(&self) -> &BridgeCore<R> {
    self.state::<BridgeCore<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("bridge-core")
    .invoke_handler(tauri::generate_handler![commands::ping, commands::get_device_info])
    .setup(|app, api| {
      #[cfg(mobile)]
      let bridge_core = mobile::init(app, api)?;
      #[cfg(desktop)]
      let bridge_core = desktop::init(app, api)?;
      app.manage(bridge_core);
      Ok(())
    })
    .build()
}
