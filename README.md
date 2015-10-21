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
var ADB = new (require('adbjs'))();

// Getting adb version
var version = ADB.version();
console.log(version);
// Android Debug Bridge version 1.0.32

// Getting devices
var devices = ADB.devices()
console.log(devices)
// [ '07042e0e13cca2d0' ]

var deviceInfo = ADB.deviceInfo(devices[0]);
console.log(deviceInfo);
// { id: '07042e0e13cca2d0', model: 'Nexus 5', version: '5.1.1' }

// select device
ADB.selectDevice(devices[0]);

// check if device is available
var isAvailable = ADB.isDeviceAvailable('07042e0e13cca2d0');
console.log(isAvailable);
// true

// list installed packages
var packages = ADB.listPackages();
/* 
 * [ 'com.skype.raider',
 *   'com.google.android.youtube',
 *   'com.android.providers.telephony',
 *   'com.google.android.gallery3d',
 *   ...
 *   'com.google.android.inputmethod.latin' ]
*/ 

// check if a package is installed
var isInstalled = ADB.isPackageInstalled("com.urucas.zoster_testpp");
console.log(isInstalled);
// false

// check if package is currently running
var isRunning = ADB.isAppRunning("com.google.android.youtube");
console.log(isRunning);
// true 

// close a application running
ADB.closeApp("com.google.android.youtube");

// install a package
ADB.install("/path/to/my/zoster_testapp.apk", "com.urucas.zoster_testapp");

// get wlan0 ip
var ip = ABD.getDeviceWlan0()
console.log(ip)
// 192.168.0.105

// connect a device via tcpip
var conn = ADB.tcpConnect()
console.log(conn)
// 192.168.0.105:5555

// disconnect device
ADB.tcpDisconnect(conn)
```

