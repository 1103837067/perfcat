package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/danielpaulus/go-ios/ios"
)

// DeviceInfo 设备信息结构
type DeviceInfo struct {
	UDID        string `json:"udid"`
	Name        string `json:"name,omitempty"`
	ProductType string `json:"productType,omitempty"`
	Version     string `json:"version,omitempty"`
}

// Command 命令结构
type Command struct {
	Action string                 `json:"action"`
	Params map[string]interface{} `json:"params"`
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "Usage: %s <command>\n", os.Args[0])
		os.Exit(1)
	}

	var cmd Command
	if err := json.Unmarshal([]byte(os.Args[1]), &cmd); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing command: %v\n", err)
		os.Exit(1)
	}

	switch cmd.Action {
	case "list":
		listDevices()
	case "info":
		udid, ok := cmd.Params["udid"].(string)
		if !ok {
			fmt.Fprintf(os.Stderr, "Missing udid parameter\n")
			os.Exit(1)
		}
		getDeviceInfo(udid)
	default:
		fmt.Fprintf(os.Stderr, "Unknown action: %s\n", cmd.Action)
		os.Exit(1)
	}
}

func listDevices() {
	deviceList, err := ios.ListDevices()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error listing devices: %v\n", err)
		os.Exit(1)
	}

	var devices []DeviceInfo
	for _, device := range deviceList.DeviceList {
		// 尝试获取更多设备信息
		deviceInfo := DeviceInfo{
			UDID: device.Properties.SerialNumber,
		}

		// 尝试通过 GetValuesPlist 获取设备详细信息
		if values, err := ios.GetValuesPlist(device); err == nil {
			if name, ok := values["DeviceName"].(string); ok {
				deviceInfo.Name = name
			}
			if productType, ok := values["ProductType"].(string); ok {
				deviceInfo.ProductType = productType
			}
			if version, ok := values["ProductVersion"].(string); ok {
				deviceInfo.Version = version
			}
		}

		devices = append(devices, deviceInfo)
	}

	result, err := json.Marshal(devices)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling result: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(string(result))
}

func getDeviceInfo(udid string) {
	deviceList, err := ios.ListDevices()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error listing devices: %v\n", err)
		os.Exit(1)
	}

	for _, device := range deviceList.DeviceList {
		if device.Properties.SerialNumber == udid {
			info := DeviceInfo{
				UDID: device.Properties.SerialNumber,
			}

			// 尝试获取更多设备信息
			if values, err := ios.GetValuesPlist(device); err == nil {
				if name, ok := values["DeviceName"].(string); ok {
					info.Name = name
				}
				if productType, ok := values["ProductType"].(string); ok {
					info.ProductType = productType
				}
				if version, ok := values["ProductVersion"].(string); ok {
					info.Version = version
				}
			}

			result, err := json.Marshal(info)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error marshaling result: %v\n", err)
				os.Exit(1)
			}
			fmt.Println(string(result))
			return
		}
	}

	fmt.Fprintf(os.Stderr, "Device not found: %s\n", udid)
	os.Exit(1)
}
