use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::BridgeCoreExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.bridge_core().ping(payload)
}

#[command]
pub(crate) async fn get_device_info<R: Runtime>(
    app: AppHandle<R>,
) -> Result<DeviceInfoResponse> {
    app.bridge_core().get_device_info()
}
