# adbjs
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

// Getting devices
var devices = ADB.devices()
console.log(devices)
// [ '07042e0e13cca2d0' ]

// select device
ADB.selectDevice(devices[0]);

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
```

