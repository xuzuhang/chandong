// pages/common/enterImg/enterImg.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:5,
    s:"s",
    lac:false,
    one:false,
    index:"",
    lock:false
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlac()
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
      var reg = /^([0-9A-Za-z_]+):(.*)$/
      var arrs = scene.match(reg)
      wx.setStorage({
        key: "Whatfor",
        data: {
          event:arrs[1],
          Referee: arrs[2]
        }
      })
    }else{
      wx.setStorage({
        key: "Whatfor",
        data: {
          event: '',
          Referee: ''
        }
      })
    }
  },
  nextLoc(){
    this.setData({
      one:true
    })
    this.timeover()
  },
  timeover() {
  this.timer =  setInterval(() => {
        this.data.time--
        if (this.data.time===0){
          clearInterval(this.timer)
          this.tologin()
        }
        this.setData({
          time:this.data.time
        })
    }, 1000)
  },
  next(res){
      if (res.detail.rawData) {   //获取用户信息要用户授
        if(this.data.lock){
          this.tologin()
        }else{
          this.damand('/users/registerstatus', 'GET', '', (info) => {
            var index = info.data.data + 1
            this.setData({
              index: index
            })
            this.tologin()
          })
        }
      } else {
        Icons.Toast('请授权微信', 'none')
      }
  },
  tologin(){
    if (this.data.index === 8) {
      wx.getStorage({
        key: 'Whatfor',
        success: (res) => {
          var res = res.data
          if (res.event) {
            wx.redirectTo({
              url: '../../my/card/card',
            })

          } else {
            wx.switchTab({
              url: '../../index/index/index'
            })
          }
        }
      })

    } else {
      wx.redirectTo({
        url: '../../login/login' + this.data.index + '/login' + this.data.index
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
      if(this.data.one){
        wx.showToast({
          title: '授权位置后可能要退出微信重新打开小程序哦',
          icon: 'none',
          duration: 3000
        })
      }
   
  },
  getlac() {
    wx.getLocation({
      success: (res) => {
        this.setData({
            lac:true
        })
        this.getInfo()
      },
      fail: (res) => {
        this.getloca()
        this.setData({
          lac: false,
          time:"",
          s:""
        })
      }
    })
  },
  getloca() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        this.setData({
          lac: true
        })
        this.getInfo()
      },
      fail: () => {
        this.setData({
          lac: false,
          time: "",
          s: ""
        })
      },
      complete: () => {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation']) {
              this.getloca()
            }
          }
        })
      }
    })
  },
  getTourl() {
    this.damand('/users/registerstatus', 'GET', '', (info) => {
      var index = info.data.data + 1
      this.setData({
        index:index,
        lock: true
      })
      this.timeover()
    })
  },
  getInfo() {
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => {
        this.setData({
          time: "5",
          s: "s"
        })
        this.getTourl()
      },
      fail: (res) => {
        this.setData({
          time: "",
          s: ""
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      clearInterval(this.timer)
      clearInterval(this.setTime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer)
    clearInterval(this.setTime)
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