// pages/my/orderDetails/orderDetails.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1,
    signatureUrl:'',
    order:{
      
    },
    time:{
      m:"",
      s:""
    }
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order = JSON.parse(options.order)
    console.log(this.data.order)
    var date = new Date(this.data.order.createTime)
    var otime = date.getTime()
    this.data.order.times = date.getFullYear() + '/' + this.addzero((date.getMonth() + 1)) + '/' + this.addzero(date.getDate()) + " " + this.addzero(date.getHours()) + ":" + this.addzero(date.getMinutes()) + ":" + this.addzero(date.getSeconds())
    this.setData({
      order: this.data.order
    })
    if (this.data.order.status == 2) {
      Icons.Toast('支付成功', 'success')
    }
    
  },
  topay(){
    var infos = JSON.stringify(this.data.order)
    wx.navigateTo({
      url: '../pay/pay?order='+infos
    })
  },
  addzero(str) {
    if (str < 10) {
      return "0" + str
    } else {
      return str
    }
  },  
  toindex(){
    wx.switchTab({
      url: '../../index/index/index',
    })
  },
  settime(){
    if (this.data.order.status==1){
      console.log(this.data.order)
      this.damand('/time', "GET", "", (info) => {
        var time = info.data.data
        var otime = new Date(time).getTime()
        var ntime = new Date(this.data.order.expires).getTime()
        var Surplus = ntime - otime 
        var date = new Date(Surplus)
        this.data.time.m = this.addzero(date.getMinutes())
        this.data.time.s = this.addzero(date.getSeconds())
        this.timer = setInterval(() => {
          if (Surplus <= 0){
            this.data.time.m = "00"
            this.data.time.s = "00"
          }else{
            Surplus = Surplus - 1000
            date = new Date(Surplus)
            this.data.time.m = this.addzero(date.getMinutes())
            this.data.time.s = this.addzero(date.getSeconds())
          }
          this.setData({
            time: this.data.time
          })
        }, 1000)
      })
    }
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
    this.settime()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer)
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