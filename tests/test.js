import ADB from '../lib/adb';
import chai from 'chai';

let expect = chai.expect;
let should = chai.should();

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
  
  it("should get information about the device power", (done) => {
    let power = adb.power();
    power.should.not.equal(undefined);
    expect(power).to.be.a("object");
    power["display_power"].should.not.equal(undefined);
    if(power["display_power"] != "ON" && power["display_power"] != "OFF")
      throw new Error("display_power error value; ");
    power["battery_level"].should.not.equal(undefined);
    expect(power["battery_level"]).to.match(/\d+/);
    done()
  })
  
  /*
  it("should lock screen", (done) => {
    adb.selectDevice({ id: '07042e0e13cca2d0', model: 'Nexus 5', version: '6.0.1' })
    adb.lock()
    setTimeout( _ => {
      let power = adb.power()
      power["display_power"].should.equal("OFF")
      done()
    }, 1000)
  })
  
  it("should unlock screen", (done) => {
    adb.selectDevice({ id: '07042e0e13cca2d0', model: 'Nexus 5', version: '6.0.1' })
    adb.unlock()
    setTimeout( _ => {
      let power = adb.power()
      power["display_power"].should.equal("ON")
      done()
    }, 1000)
  })
  */
  
  /*
  it("should not duplicate devices on connection/disconnection", (done) => {
    let devices = adb.devices();
    setTimeout( () => {
      devices = adb.devices();
    }, 3000)
  })
  */
  
  
  it("should return user process list", (done) => {
    // mock device id 07042e0e13cca2d0
    let list = adb.userProcessList("07042e0e13cca2d0");
    if(list instanceof Array) 
      return done();
    throw new Error("devices doesnt returns array, "+list);
  });
  
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
    expect(device_info.version).to.deep.equal('6.0.1');
    done();
  });
  
  
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
  it("should connect & disconnect a device via tcpip", (done) => {
    let devices = adb.devices();
    for(let i=0; i<devices.length;i++) {
      let device = devices[i];
      if(device.id.indexOf(":5555") != -1)
        adb.tcpDisconnect(device.id)
    }
    // update devices list
    devices = adb.devices();
    
    let conn = adb.tcpConnect();
    let re = /\d+\.\d+\.\d+\.\d+\:5555/ig
    if(re.test(conn)) {
      // device connected
      // lets disconnect the device
      adb.tcpDisconnect(conn);
      done();
      return;
    }
    throw new Error("Error connecting device; "+conn);
  });
  */
});

