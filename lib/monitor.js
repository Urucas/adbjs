import EventEmitter from 'events'
const interval = 500
export default class Monitor extends EventEmitter{
  
  constructor(adb){
    super()
    this.adb = adb
    this.power = this.adb.power()
    this.interval = this.start()
  }
  
  start() {
    return setInterval( _ => {
      this.monitor()    
    }, interval)
  }
  
  info() {
    return this.power
  }
  
  monitor() {
    let power = this.adb.power()
    if(power["battery_level"] != this.power["battery_level"]) {
      this.emit("battery", power)
    }
    if(power["display_power"] != this.power["display_power"]) {
      this.emit("display", power)  
    }
    this.power = power
  }
  
  cancel() {
    clearInterval(this.interval)
  }
}