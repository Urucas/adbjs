import ADB from '../lib/adb';
import chai from 'chai';

let expect = chai.expect;
let should = chai.should();

describe("adbjs tests", _ => {
  
  let adb = new ADB();

  it("should create an event Emitter for montor method", (done) => {
    let devices = adb.devices()
    let monitor = adb.monitor()
    monitor.should.not.equal(null)
    monitor.should.not.equal(undefined)
    expect(monitor).to.be.a("object")
    expect(monitor.info).to.be.a("function")
    expect(monitor.info()).to.be.a("object")
    expect(monitor.on).to.be.a("function")
    done()
  })
  
})