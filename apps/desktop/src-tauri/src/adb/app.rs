use crate::adb::{command::run_device, error::Result, AppInfo};

pub fn list_apps(device_id: &str, keyword: Option<&str>) -> Result<Vec<AppInfo>> {
  let raw = run_device(device_id, &["shell", "pm", "list", "packages"])?;
  let keyword = keyword.map(|k| k.to_ascii_lowercase());

  let apps = raw
    .lines()
    .filter_map(|line| line.strip_prefix("package:"))
    .filter(|pkg| {
      if let Some(k) = &keyword {
        pkg.to_ascii_lowercase().contains(k)
      } else {
        true
      }
    })
    .map(|pkg| AppInfo {
      package: pkg.to_string(),
      label: None,
    })
    .collect();

  Ok(apps)
}


