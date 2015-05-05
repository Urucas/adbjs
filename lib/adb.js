import child_process from 'child_process';
import fs from 'fs';

export default class ADB {
 
  constructor() {
    this.device = [];
    this.selected_device;
  }

  devices() {
      
    let child = child_process.spawnSync("adb", ["devices"]);
    if(child.stderr && child.stderr.toString() !="") { 
      throw new Error(" "+child.stderr);
      return;
    }

    let output = child.stdout.toString();
    let match_devices = output.match(/[\w\d]+\s+device\n/ig);
     
    if(!match_devices.length) return this.device;
      
    match_devices = match_devices[0].split(/\n/);
    for(let i in match_devices) {
      if(match_devices[i] == "") continue;
      if(!/device/ig.test(match_devices[i])) continue;
      let did = match_devices[i].replace(/\tdevice/ig, "");
      if(this.device.indexOf(did) != -1) continue;
      this.device.push(did);
    }
    
    this.selected_device = this.device[0];
    return this.device;
  }

  selectDevice(device) {
    this.selected_device = device;
  }
  
  isPackageInstalled(_package_) {
    
    let params = ["shell" ,"pm", "list", "packages", "|", "grep", _package_];
    if(this.selected_device) {
      params.unshift(this.selected_device);
      params.unshift("-s");
    }

    let child = child_process.spawnSync("adb", params);
    if(child.stderr && child.stderr.toString() !="") { 
      throw new Error(" "+child.stderr);
    }

    let output = child.stdout.toString();
        output = output.replace(/[\n\t\s\r]*/ig, "");
    
    return output == "package:"+_package_ ? true : false;
  }

  install(apk_path, _package_) {
    
    if(!fs.existsSync(apk_path)) throw new Error("Apk file not found!");

    let params = ["install", apk_path];
    if(this.selected_device) {
      params.unshift(this.selected_device);
      params.unshift("-s");
    }
    let child = child_process.spawnSync("adb", params);
    return this.isPackageInstalled(_package_);
  }

  isAppRunning(_package_) {

    let params = ["shell" ,"ps", "|", "grep", _package_];
    if(this.selected_device) {
      params.unshift(this.selected_device);
      params.unshift("-s");
    }
    
    let child = child_process.spawnSync("adb", params);
    if(child.stderr && child.stderr.toString() !="") { 
      throw new Error(" "+child.stderr);
    }

    let output = child.stdout.toString();
    return output.indexOf(_package_) != -1 ? true : false;

  }

  closeApp(_package_) {

    let params = ["shell" ,"am", "force-stop", _package_];
    if(this.selected_device) {
      params.unshift(this.selected_device);
      params.unshift("-s");
    }
    
    let child = child_process.spawnSync("adb", params);
    if(child.stderr && child.stderr.toString() !="") { 
      throw new Error(" "+child.stderr);
    }
  }

  listPackages() {
    
    let params = ["shell" ,"pm", "list", "packages"];
    if(this.selected_device) {
      params.unshift(this.selected_device);
      params.unshift("-s");
    }

    let child = child_process.spawnSync("adb", params);
    if(child.stderr && child.stderr.toString() !="") { 
      throw new Error(" "+child.stderr);
    }
    
    let output = child.stdout.toString();
    let list = output.split(/\n/);
    
    let packages = [];
    if(!list.length) return packages;
    for(let i in list) {
      
      if(list[i] == "") continue;

      let pkg = list[i];
          pkg = pkg.replace("package:","");
          pkg = pkg.replace(/\r/,"");

      packages.push(pkg);
    }

    return packages;
  }

};
