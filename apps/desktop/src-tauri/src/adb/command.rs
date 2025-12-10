use crate::adb::error::{AdbError, Result};
use once_cell::sync::OnceCell;
use std::{
  process::{Command, Stdio},
  sync::Mutex,
};

#[derive(Debug, Clone)]
pub struct AdbBinary {
  pub path: Option<String>,
}

static ADB_BIN: OnceCell<Mutex<AdbBinary>> = OnceCell::new();

fn adb_bin() -> &'static Mutex<AdbBinary> {
  ADB_BIN.get_or_init(|| Mutex::new(AdbBinary { path: None }))
}

pub fn set_adb_path(path: Option<String>) {
  if let Ok(mut guard) = adb_bin().lock() {
    guard.path = path.map(|p| p.trim().to_string()).filter(|p| !p.is_empty());
  }
}

fn current_adb_path() -> String {
  adb_bin()
    .lock()
    .ok()
    .and_then(|cfg| cfg.path.clone())
    .unwrap_or_else(|| "adb".to_string())
}

pub fn run_host(args: &[&str]) -> Result<String> {
  run_raw(&current_adb_path(), args)
}

pub fn run_device(device_id: &str, args: &[&str]) -> Result<String> {
  let mut full = Vec::with_capacity(args.len() + 2);
  full.push("-s");
  full.push(device_id);
  full.extend_from_slice(args);
  run_raw(&current_adb_path(), &full)
}

fn run_raw(bin: &str, args: &[&str]) -> Result<String> {
  let output = Command::new(bin)
    .args(args)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .output()
    .map_err(|_| AdbError::NotFound)?;

  if !output.status.success() {
    let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
    return Err(AdbError::CommandFailed(err));
  }

  Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

pub fn try_ping_server() -> Result<()> {
  let _ = run_host(&["start-server"]).map_err(|e| AdbError::Client(format!("{e}")))?;
  Ok(())
}

