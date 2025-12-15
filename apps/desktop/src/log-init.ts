import { attachConsole } from "@tauri-apps/plugin-log"

// Pipe webview console output into the Tauri log plugin so it is written to files.
void (async () => {
  try {
    await attachConsole()
  } catch (error) {
    console.error("attachConsole failed", error)
  }
})()
