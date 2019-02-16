/*
 * 蓝牙链接功能
 * @Date: 2017-11-24 17:07:47
 */

const noop = () => { }
const blueScale = function (options = {}) {
  // 设备包含名称
  this.name = options.name || 'Health Scale'
  // 设备id 不用填 可访问
  this.deviceId = options.deviceId || ''
  // 设备数据
  this.device = null
  // 发送指令 默认轻加体脂称
  this.cmd = options.cmd || 'FD370001000000000000CB'
  // 发送关闭秤指令 默认轻加体脂称
  this.closeCmd = options.closeCmd || 'FD350000000000000000'
  // 服务正则判断，只判断4~8，4位数
  this.serviceRegExp = new RegExp(options.serviceRegExp || 'fff0', 'ig')
  // 特征值正则判断，只判断4~8，4位数
  this.characteristicsRegExp = new RegExp(options.characteristicsRegExp || 'fff1', 'ig')
  this.notycharacteristicsRegExp = new RegExp(options.notycharacteristicsRegExp || 'fff4', 'ig')
  this.getStateName = options.getStateName || noop
  this.charactValueChange = options.charactValueChange || noop
}
const log = function () {
  let show = true
  if (show) {
    console.log.apply(this, arguments)
  }
}

blueScale.prototype = {
  getState(index) {
    let states = ['初始化', '连接中', '连接失败', '连接中断', '已连接']
    this.getStateName(index, states[index] || '未连接')
  },
  init() {                          //第一步先初始化开启蓝牙
    log('初始化蓝牙适配器')
    wx.openBluetoothAdapter({
      success: res => {
        this.getAdapterState()
      },
      fail: () => {
        this.getState(2)
        log('蓝牙未开启')
      }
    })
  },
  close() {
    log('关闭蓝牙适配器')
    wx.closeBluetoothAdapter({
      success: res => {
        log('关闭')
      }
    })
  },
  getAdapterState() {                     //获取蓝牙适配状态
    log('获取蓝牙适配器状态')
    wx.getBluetoothAdapterState({
      success: res => {
        if (res.available && !res.discovering) {
          this.startDevicesDiscovery()
        }
      }
    })
  },
  onAdapterStateChange() {
    log('监听蓝牙适配器状态变化事件')
    wx.onBluetoothAdapterStateChange({
      success: res => { }
    })
  },
  startDevicesDiscovery() {
    log('开始搜索蓝牙')
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false, //已搜索设备不在获取
      success: res => {
        this.getState(1)
        setTimeout(() => {
          this.getDevices()
        }, 2000)
      }
    })
  },
  stopDevicesDiscovery() {
    log('停止搜索设备')
    wx.stopBluetoothDevicesDiscovery({
      success: res => {
        log('已停止搜索')
      }
    })
  },
  getDevices() {
    log('获取生效期间所有已发现的蓝牙设备')
    wx.getBluetoothDevices({
      success: ({ devices }) => {
        let max = -1000
        let device = null
        log('返回所有')
        log(devices)
        devices.forEach((item, index) => {
          if (item.name.indexOf(this.name) > -1 && item.RSSI > max) {
            max = item.RSSI
            device = item
          }
        })
        if (device && device.deviceId) {
          this.device = device
          this.deviceId = device.deviceId
          this.createConnect()
        } else {
          this.onDeviceFound()
        }
      }
    })
  },
  onDeviceFound() {
    log('监听寻找到新设备的事件')
    wx.onBluetoothDeviceFound(({ devices }) => {
      if (this.deviceId) {
        return ''
      }
      if (devices && devices.length && devices[0].name.indexOf(this.name) > -1) {
        log('监听数据', devices)
        this.deviceId = devices[0].deviceId
        this.device = devices[0]
        this.createConnect()
      }
    })
  },
  getConnectedDevices() {
    log('根据uuid获取已连接状态的设备')
    wx.getConnectedBluetoothDevices({
      success: res => { }
    })
  },
  createConnect() {
    log('连接低功耗蓝牙设备。')
    if (!this.deviceId) {
      return ''
    }
    wx.createBLEConnection({
      deviceId: this.deviceId,
      success: res => {
        log('链接成功')
        this.getState(4)
        this.onConnectionStateChange()
        this.getDeviceServices()
      },
      fail: res => {
        log('链接失败，重连设备')
        this.getState(2)
        const that = this
        setTimeout(() => {
          that.createConnect()
        }, 1000)
      },
      complete: () => {
        log('链接结束')
        this.stopDevicesDiscovery()
      }
    })
  },
  closeConnection() {
    log('断开链接')
    wx.closeBLEConnection({
      deviceId: this.deviceId,
      success: res => {
        log('已断开链接')
      }
    })
  },
  getDeviceServices() {
    log('获取蓝牙设备所有 service（服务）')
    wx.getBLEDeviceServices({
      deviceId: this.deviceId,
      success: ({ services }) => {
        log('所有服务', services)
        for (let i = 0, len = services.length; i < len; i++) {
          let serviceId = services[i].uuid
          let service_slice = serviceId.slice(4, 8)
          if (this.serviceRegExp.test(service_slice)) {
            log('指定的serviceId：' + serviceId)
            this.serviceId = serviceId
            this.getDeviceCharacteristics()
          }
        }
      }
    })
  },
  getDeviceCharacteristics() {
    log('获取蓝牙设备某个服务中的所有 characteristic（特征值）')
    wx.getBLEDeviceCharacteristics({
      deviceId: this.deviceId,
      serviceId: this.serviceId,
      success: ({ characteristics }) => {
        wx.showLoading({
          title: '测量中'
        })
        console.log('特征值', characteristics)
        characteristics.forEach((item, index) => {
          let characteristics_slice = item.uuid.slice(4, 8)
          if (this.characteristicsRegExp.test(characteristics_slice)) {
            //发送cmd 方法
            this.characteristicsId = item.uuid
          } else if (this.notycharacteristicsRegExp.test(characteristics_slice)) {
            //监听notify
            this.notycharacteristicsId = item.uuid
          }
        })
        log('characteristicsId' + this.characteristicsId)
        log('notycharacteristicsId' + this.notycharacteristicsId)
        this.notifyCharacteristicValueChange()
      }
    })
  },
  notifyCharacteristicValueChange() {
    log('获取蓝牙设备某个服务中的所有 characteristic（特征值）')
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: this.deviceId,
      serviceId: this.serviceId,
      characteristicId: this.notycharacteristicsId,
      success: res => {
        setTimeout(() => {
          this.writeCharacteristicValue()
          this.onCharacteristicValueChange()
        }, 200)
      }
    })
  },
  writeCharacteristicValue(cmd) {
    log('写入指令')
    let val = cmd || this.cmd
    let typedArray = new Uint8Array(
      val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      })
    )
    log('typedArray', typedArray)
    var buffer = typedArray.buffer
    wx.writeBLECharacteristicValue({
      deviceId: this.deviceId,
      serviceId: this.serviceId,
      characteristicId: this.characteristicsId,
      value: buffer,
      success: res => {
        log('写入成功')
      },
      fail: res => {
        log('失败', res)
      }
    })
  },
  onConnectionStateChange() {
    log('监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等。')
    wx.onBLEConnectionStateChange(res => {
      if (!res.connected) {
        log('链接中断', res)
        this.getState(3)
        this.close()
      }
    })
  },
  onCharacteristicValueChange() {
    log('监听低功耗蓝牙设备的特征值变化。')
    wx.onBLECharacteristicValueChange(({ value }) => {
      const val = this.buf2hex(value)
      log('最后的值:', val)
      this.charactValueChange && this.charactValueChange.call(this, val, this.deviceId)
      this.writeCharacteristicValue(this.closeCmd)
      // this.closeConnection()
      // this.close()
    })
  },
  buf2hex: function (buffer) {
    // buffer is an ArrayBuffer
    return Array.prototype.map
      .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
      .join('')
  }
}
export default blueScale
