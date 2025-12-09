use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<BridgeCore<R>> {
  Ok(BridgeCore(app.clone()))
}

/// Access to the bridge-core APIs.
pub struct BridgeCore<R: Runtime>(AppHandle<R>);

impl<R: Runtime> BridgeCore<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    Ok(PingResponse {
      value: payload.value,
    })
  }

  pub fn get_device_info(&self) -> crate::Result<DeviceInfoResponse> {
    use serde_json::json;
    Ok(json!({
      "error": "Device info is only available on mobile platforms"
    }))
  }
}
