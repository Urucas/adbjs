import ADB from '../lib/adb';

describe("ADB instance test", () => {
  
  let adb = new ADB();

  it("Test adb.version", (done) => {
    let version = adb.version();
    if(!/Android Debug Bridge version [\d\.]+/.test(version)) 
      throw new Error("returns wrong version format:"+version);
    done();
  });
 
  it("Test adb.devices", (done) => {
    let devices = adb.devices();
    if(devices instanceof Array) 
      return done();
    throw new Error("devices doesnt returns array, "+devices);
  });

  it("Test adb.userProcessList", (done) => {
    // mock device id 07042e0e13cca2d0
    let list = adb.userProcessList("07042e0e13cca2d0");
    if(list instanceof Array) 
      return done();
    throw new Error("devices doesnt returns array, "+list);
  });

});

