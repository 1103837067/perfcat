import { invoke } from '@tauri-apps/api/core'

export async function ping(value: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:bridge-core|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function getDeviceInfo(): Promise<Record<string, any>> {
  return await invoke<Record<string, any>>('plugin:bridge-core|get_device_info');
}
