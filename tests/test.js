import ADB from '../lib/adb';
import chai from 'chai';

let expect = chai.expect;

describe("adbjs tests", () => {
  
  let adb = new ADB();

  it("should return version", (done) => {
    let version = adb.version();
    if(!/Android Debug Bridge version [\d\.]+/.test(version)) 
      throw new Error("returns wrong version format:"+version);
    done();
  });
 
  it("should return devices list", (done) => {
    let devices = adb.devices();
    if(devices instanceof Array) 
      return done();
    throw new Error("devices doesnt returns array, "+devices);
  });
  
  /*
  it("should return user process list", (done) => {
    // mock device id 07042e0e13cca2d0
    let list = adb.userProcessList("07042e0e13cca2d0");
    if(list instanceof Array) 
      return done();
    throw new Error("devices doesnt returns array, "+list);
  });
  */

  /*
  it("should set the device", (done) => {
    let device = { id: '07042e0e13cca2d0', model: 'Nexus 5', version: '5.1.1' };
    adb.selectDevice({ id: '07042e0e13cca2d0', model: 'Nexus 5', version: '5.1.1' });
    let selected_device = adb.selected_device;
    expect(selected_device).to.deep.equal(device);
    done();
  });

  it("should get the device info", (done) => {
    let device_id = '07042e0e13cca2d0';
    let device_info = adb.deviceInfo(device_id);
    expect(device_info.id).to.deep.equal(device_id);
    expect(device_info.model).to.deep.equal('Nexus 5');
    expect(device_info.version).to.deep.equal('5.1.1');
    done();
  });
  */
  
  it("should return a device wlan0 ip", (done) => {
    let devices = adb.devices();
    let ip = adb.getDeviceWlan0();
    if(ip == null) {
      done();
      return;
    }
    let re = /\d+\.\d+\.\d+\.\d+/ig
    if(re.test(ip)) {
      done();
      return;
    }
    throw new Error("Error getting device ip, result: "+ip);
  })
  /*
  it("shuld connect a device via tcpip", (done) => {
    let devices = adb.devices();
    console.log(devices);
    let output = adb.tcpConnect();
    console.log(output);
  });
  */
});

