import ADB from '../lib/adb';

describe("ADB instance test", () => {
  
  let adb = new ADB();

  it("Test adb version", (done) => {
    let version = adb.version();
    if(!/Android Debug Bridge version [\d\.]+/.test(version)) throw new Error("returns wrong version:"+version);
    done();
  });
  
});

