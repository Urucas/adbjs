var ADB = require('../bin/adb.js').default
    ADB = new ADB()

var version = ADB.version();
console.log(version);

// Getting devices
var devices = ADB.devices();
console.log(devices)

var info = ADB.packageInfo("com.urucas.cineros");
console.log(info);


var isAvailable = ADB.isDeviceAvailable(devices[0].id);
console.log(isAvailable);

var packages = ADB.listPackages();
console.log(packages);

var flag = ADB.isPackageInstalled("com.urucas.zoster_testapp");
console.log(flag);

var flag = ADB.isAppRunning("com.urucas.zoster_testapp");
console.log(flag);

/*
var flag = ADB.install("./zoster_testapp.apk", "com.urucas.zoster_testapp");
console.log(flag);
*/

/*
var flag = ADB.uninstall("com.urucas.zoster_testapp");
console.log(flag);

ADB.promptUninstall("com.urucas.cineros");
*/ 
var deviceInfo = ADB.deviceInfo(devices[0].id);
console.log(deviceInfo);

/*
var processList = ADB.userProcessList(devices[0]);
console.log(processList);
*/
ADB.lock()
setTimeout(function(){
  var power = ADB.power()
  console.log(power)
  ADB.unlock()
}, 1000)



