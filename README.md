# adbjs [![Build Status](https://travis-ci.org/Urucas/adbjs.svg)](https://travis-ci.org/Urucas/adbjs)
Use adb from node

#Requirements
* ADB

#Install
```bash
npm install --save adbjs
```

#Build
```bash
git clone https://github.com/Urucas/adbjs.git
npm run build
```

#Usage
```javascript
import ADB from 'adbjs'
let adb = new ADB()

// Getting adb version
let version = adb.version()
console.log(version)
// Android Debug Bridge version 1.0.32

// Getting devices
let devices = adb.devices()
console.log(devices)
// [ '07042e0e13cca2d0' ]

let deviceInfo = adb.deviceInfo(devices[0])
console.log(deviceInfo)
// { id: '07042e0e13cca2d0', model: 'Nexus 5', version: '5.1.1' }

// select device
adb.selectDevice(devices[0])

// check if device is available
let isAvailable = adb.isDeviceAvailable('07042e0e13cca2d0')
console.log(isAvailable)
// true

// list installed packages
let packages = adb.listPackages()
/* 
 * [ 'com.skype.raider',
 *   'com.google.android.youtube',
 *   'com.android.providers.telephony',
 *   'com.google.android.gallery3d',
 *   ...
 *   'com.google.android.inputmethod.latin' ]
*/ 

// check if a package is installed
let isInstalled = adb.isPackageInstalled("com.urucas.zoster_testpp")
console.log(isInstalled)
// false

// check if package is currently running
let isRunning = adb.isAppRunning("com.google.android.youtube")
console.log(isRunning)
// true 

// close a application running
adb.closeApp("com.google.android.youtube")

// install a package
adb.install("/path/to/my/zoster_testapp.apk", "com.urucas.zoster_testapp")

// get wlan0 ip
let ip = adb.getDeviceWlan0()
console.log(ip)
// 192.168.0.105

// connect a device via tcpip
let conn = adb.tcpConnect()
console.log(conn)
// 192.168.0.105:5555

// disconnect device
adb.tcpDisconnect(conn)

// lock device
adb.lock()

// unlock device
adb.unlock()

// get information about the power display
let power = adb.power()
console.log(power)
// { display_power: 'ON', "battery_level": 93 }

```
# Monitor
Using adbjs to monitor a device changes

``` node
let monitor = adb.monitor()
// emits an event on battery change
monitor.on("battery", (power) => {
  // { display_power: 'ON', "battery_level": 93 }
  // { display_power: 'ON', "battery_level": 92 }
  
  // you may integrate this monitor to slack, 
  // so if battery is to low send a notification
  // { display_power: 'ON', "battery_level": 5 }
})

// emits an event on display changes [ON|OFF]
monitor.on("display", (power) => {
  // { display_power: 'ON', "battery_level": 93 }
  // { display_power: 'OFF', "battery_level": 93 }
})
```

