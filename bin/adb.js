'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ADB = function () {
  function ADB() {
    _classCallCheck(this, ADB);

    this.device = [];
    this.selected_device;
  }

  _createClass(ADB, [{
    key: 'version',
    value: function version() {

      var child = _child_process2.default.spawnSync("adb", ["version"]);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      return child.stdout.toString().trim().replace("/\r?\n|\r/ig", "");
    }
  }, {
    key: 'devices',
    value: function devices() {

      var child = _child_process2.default.spawnSync("adb", ["devices"]);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }

      var output = child.stdout.toString();
      var match_devices = output.match(/(emulator-)?[\w\d\:\.]+\s+device\n/ig);

      if (match_devices == null) return this.device;
      if (!match_devices.length) return this.device;

      for (var k in match_devices) {

        var match_device = match_devices[k].split(/\n/);
        for (var i in match_devices) {
          if (match_devices[i] == "") continue;
          if (!/device/ig.test(match_devices[i])) continue;
          var did = match_devices[i].replace(/\tdevice/ig, "");
          did = did.replace(/\n/ig, "");
          if (this.isDeviceOnList(did)) continue;

          var device_info = this.deviceInfo(did);
          this.device.push(device_info);
        }
      }

      this.selected_device = this.selected_device || this.device[0];
      return this.device;
    }
  }, {
    key: 'isDeviceOnList',
    value: function isDeviceOnList(did) {
      for (var i = 0; i < this.device.length; i++) {
        var device = this.device[i];
        if (device.id == did) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'userProcessList',
    value: function userProcessList(device) {

      if (!this.isDeviceAvailable(device)) {
        throw new Error("No device selected");
        return;
      }
      var child = _child_process2.default.spawnSync("adb", ["-s", device, "shell", "ps"]);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      var output = child.stdout.toString().split("\r\n");
      var list = [];
      for (var i = 0; i < output.length; i++) {
        try {
          var process = output[i];
          if (!/u\d_\w\d+/.test(process)) continue;
          process = process.split(/\s+/);
          process = {
            user: process[0],
            pid: process[1],
            pkg: process[8]
          };
          list.push(process);
        } catch (e) {}
      }
      return list;
    }
  }, {
    key: 'deviceInfo',
    value: function deviceInfo(device) {

      var info = {
        id: device
      };

      var child = _child_process2.default.spawnSync("adb", ["-s", device, "shell", "getprop", "ro.product.model"]);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      info.model = child.stdout.toString().replace(/\r?\n|\r/ig, "");

      child = _child_process2.default.spawnSync("adb", ["-s", device, "shell", "getprop", "ro.build.version.release"]);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      info.version = child.stdout.toString().replace(/\r?\n|\r/ig, "");
      return info;
    }
  }, {
    key: 'selectDevice',
    value: function selectDevice(device) {
      this.selected_device = device;
    }
  }, {
    key: 'isPackageInstalled',
    value: function isPackageInstalled(_package_) {

      var packages = this.listPackages();
      for (var i in packages) {
        if (packages[i] == _package_) return true;
      }return false;
    }
  }, {
    key: 'unlock',
    value: function unlock() {
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }
      var power = this.power();
      if (power["display_power"] == "OFF") this.keyEvent(did, 82);
    }
  }, {
    key: 'lock',
    value: function lock() {
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }
      var power = this.power();
      if (power["display_power"] == "ON") this.keyEvent(did, 26);
    }
  }, {
    key: 'keyEvent',
    value: function keyEvent(did, code) {
      var params = ["shell", "input", "keyevent", code];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }
      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
    }
  }, {
    key: 'power',
    value: function power() {
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }
      var params = ["shell", "dumpsys", "power"];
      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      var output = child.stdout.toString();
      var power = {};
      var state = output.match(/Display\sPower\:\sstate\=[\w]+/);
      power["display_power"] = /ON$/.test(state) ? "ON" : "OFF";
      return power;
    }
  }, {
    key: 'promptUninstall',
    value: function promptUninstall(_package_) {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      var params = ["shell", "am", "start", "-a", "android.intent.action.DELETE", "-d", "package:" + _package_];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }

      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      var output = child.stdout.toString().trim().replace(/\r?\n|\r/, "");
      return output;
    }
  }, {
    key: 'getDeviceWlan0',
    value: function getDeviceWlan0() {
      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }
      // shell ip -f inet addr show wlan0
      var params = ["shell", "ip", "-f", "inet", "addr", "show", "wlan0"];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }
      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      var output = child.stdout.toString().trim().replace(/\r?\n|\r/, "");
      if (output.trim() == "") {
        return null;
      }
      output = output.replace(/\r?\n|\r|\t/, "").trim();
      var re = /inet\s*\d+\.\d+\.\d+\.\d+/ig;
      var ip = output.match(re);
      if (ip == null) {
        throw new Error("Error getting device wlan0 ip");
        return;
      }
      return ip[0].replace("inet", "").trim();
    }
  }, {
    key: 'tcpDisconnect',
    value: function tcpDisconnect(ip) {

      var params = ["disconnect", ip];
      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      var output = child.stdout.toString().trim().replace(/\r?\n|\r/, "");
      return output;
    }
  }, {
    key: 'tcpConnect',
    value: function tcpConnect() {
      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }
      if (did.indexOf("5555") != -1) {
        throw new Error("Device already connected!");
        return;
      }
      var ip = this.getDeviceWlan0();
      if (ip == null) {
        throw new Error("Device not connected to Wifi");
        return;
      }

      var params = ["tcpip", "5555"];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }
      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      var output = child.stdout.toString().trim().replace(/\r?\n|\r/, "");
      if (output != "restarting in TCP mode port: 5555") {
        throw new Error("Error restarting in TCP Mode");
        return;
      }

      var conn = [ip, "5555"].join(":");
      params = ["connect", conn];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }

      child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }
      output = child.stdout.toString().trim().replace(/\r?\n|\r/, "");
      if (output != "connected to " + conn) {
        throw new Error("Error connecting device; " + output);
        return;
      }
      return conn;
    }
  }, {
    key: 'uninstall',
    value: function uninstall(_package_) {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      var params = ["shell", "pm", "uninstall", "-k", _package_];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }
      var child = _child_process2.default.spawnSync("adb", params);
      return !this.isPackageInstalled(_package_);
    }
  }, {
    key: 'install',
    value: function install(apk_path, _package_) {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      if (!_fs2.default.existsSync(apk_path)) throw new Error("Apk file not found!");

      var params = ["install", apk_path];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }
      var child = _child_process2.default.spawnSync("adb", params);
      return this.isPackageInstalled(_package_);
    }
  }, {
    key: 'packageInfo',
    value: function packageInfo(_package_) {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      var params = ["shell", "dumpsys", "package", _package_];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }
      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
      }

      var output = child.stdout.toString().trim().replace(/\r?\n|\r/ig, "");
      if (output == "") throw new Error("Package not found");

      var info = {
        id: _package_
      };
      info.versionCode = output.match(/versionCode=\d+/)[0].replace(/versionCode=/, "");
      info.versionName = output.match(/versionName=[\d\.\w]+/)[0].replace(/versionName=/, "");
      info.targetSdk = output.match(/targetSdk=\d+/)[0].replace(/targetSdk=/, "");
      return info;
    }
  }, {
    key: 'isAppRunning',
    value: function isAppRunning(_package_) {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      var params = ["shell", "ps"];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }

      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
      }

      var output = child.stdout.toString();
      return output.indexOf(_package_) != -1 ? true : false;
    }
  }, {
    key: 'closeApp',
    value: function closeApp(_package_) {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      var params = ["shell", "am", "force-stop", _package_];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }

      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
      }
    }
  }, {
    key: 'listPackages',
    value: function listPackages() {

      if (!this.selected_device) {
        throw new Error("No device selected");
        return;
      }
      var did = this.selected_device.id;
      if (!this.isDeviceAvailable(did)) {
        throw new Error("Device no longer available");
        return;
      }

      var params = ["shell", "pm", "list", "packages"];
      if (did) {
        params.unshift(did);
        params.unshift("-s");
      }

      var child = _child_process2.default.spawnSync("adb", params);
      if (child.stderr && child.stderr.toString() != "") {
        throw new Error(" " + child.stderr);
        return;
      }

      var output = child.stdout.toString();
      var list = output.split(/\n/);

      var packages = [];
      if (!list.length) return packages;
      for (var i in list) {

        if (list[i] == "") continue;

        var pkg = list[i];
        pkg = pkg.replace("package:", "");
        pkg = pkg.replace(/\r/, "");

        packages.push(pkg);
      }

      return packages;
    }
  }, {
    key: 'isDeviceAvailable',
    value: function isDeviceAvailable(device_id) {
      try {
        var devices = this.devices();
        for (var i in devices) {
          if (devices[i].id == device_id) return true;
        }
      } catch (e) {}
      return false;
    }
  }]);

  return ADB;
}();

exports.default = ADB;
;