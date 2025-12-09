use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_bridge_core);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<BridgeCore<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("com.plugin.bridgecore", "ExamplePlugin")?;
  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_bridge_core)?;
  Ok(BridgeCore(handle))
}

/// Access to the bridge-core APIs.
pub struct BridgeCore<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> BridgeCore<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    self
      .0
      .run_mobile_plugin("ping", payload)
      .map_err(Into::into)
  }

  pub fn get_device_info(&self) -> crate::Result<DeviceInfoResponse> {
    self
      .0
      .run_mobile_plugin("getDeviceInfo", ())
      .map_err(Into::into)
  }
}
