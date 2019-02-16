// pages/sport/bodyHeath/bodyHeath.js
import blueScale from '../../../utils/blueScale.js'
const damand = require('../../../utils/request.js')
let scale = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight: 0,
    resistance: 0,
    status: '未连接',
    progressText: '',
    timer: null,
    count: 0,
    stateCode: 0,
    blueOpen: true,
    myInfo: {},
    userId: '',
    deviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!scale) {
      this.initScales()
    } else {
      scale.init()
    }
  },
  damand:damand,
  // 搜索
  searchBluetooth() {
    scale.getAdapterState()
  },
  // 启动
  openBluetooth() {
    if (this.data.stateCode === 3 || this.data.stateCode === 2) {
      scale.init()
    }
  },
  initProgress() {
    const timer = this.data.timer
    if (timer) {
      console.log('状态改变，清除定时器')
      clearInterval(timer)
      this.setData({
        timer: null,
        count: 0,
        progressText: ''
      })
    }
  },
  initProgress() {
    var that = this
    const timer = this.data.timer
    if (timer) {
      console.log('状态改变，清除定时器')
      clearInterval(timer)
      this.setData({
        timer: null,
        count: 0,
        progressText: ''
      })
    }
  },
  startProgress() {
    const that = this
    let { timer, count, progressText } = this.data
    if (timer) return
    timer = setInterval(() => {
      that.setData({
        timer,
        count,
        progressText
      })
      count++
      progressText += '.'
      if (count > 3) {
        count = 0
        progressText = ''
      }
    }, 500)
  },
  initScales() {
    const that = this
    scale = new blueScale({
      getStateName: (index, state) => {
        let status = '未连接'
        let blueOpen = true
        let stateCode = index
        this.initProgress()
        switch (index) {
          case 1:
            this.startProgress()
          case 2:
            status = state
            blueOpen = false
            break
          case 4:
            status = state
            this.startProgress()
            break
          default:
            status = state
            break
        }
        this.setData({
          status,
          stateCode,
          blueOpen
        })
      },
      charactValueChange(val, deviceId) {
        if (val.length >= 20) {
          const valArr = {}
          for (let i = 0, len = 10; i < len; i++) {
            valArr[i] = val.substr(i * 2, 2)
          }
          const weight = parseFloat(
            ((parseInt('0x' + valArr[4], 16) * 256 + parseInt('0x' + valArr[3], 16)) *
              0.01
            ).toFixed(2)
          )
          const resistance =
            parseInt('0x' + valArr[7], 16) * 256 * 256 +
            parseInt('0x' + valArr[6], 16) * 256 +
            parseInt('0x' + valArr[5], 16)
          console.log('取值成功', weight, resistance)

          //未取到电阻值
          if (resistance === 0) {
            scale.close()
            wx.hideLoading()
            wx.showToast({
              title: '测量失败',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1500)
            return
          }

          that.setData({
            deviceId,
            weight,
            resistance
          })
          that.gets()
          return
        }
      }
    })
    scale.init()
  },
  gets:function () {   //改变了啊啊啊
    scale.close()
    var weight = this.data.weight
    var resistance = this.data.resistance
    console.log(this.data.weight, this.data.resistance)
    this.damand('/fitness/weigh', 'POST', {
      'weight': weight,
      'impedance': resistance
    },(info)=>{
      console.log(info)
      var info = info.data
      if(info.code !== 0){
        wx.hideLoading()
        wx.showToast({
          title: '测量失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        return
      }else{
        wx.hideLoading()
        var infos = JSON.stringify(info.data)
        wx.navigateTo({
          url: '../Result/Result?info='+infos
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (scale === null) {
      return
    }
    scale.closeConnection()
    scale.close()
    scale = null
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '蝉动健身',
      path: '/pages/common/enterImg/enterImg',
      imageUrl: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/advertisements/share.jpg'
    }
  }
})