// pages/index/scan/scan.js
var QRCode = require('../../../utils/weapp-qrcode.js')
const damand = require('../../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      width:'600rpx',
      time:5,
      text:""
  },
  damand: damand,
  news(){
    this.damand('/entrances','GET','',(info)=>{
      var text = info.data.data
      console.log(text)
      this.qrcode = new QRCode('canvas', {
        text:text,
        width: 260,
        height: 260,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      })
      this.setData({
        text:text
      })
    })
    this.setData({
      time: 5
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'comwidth',
      success:(res)=> {
        var width = res.data.width;
        width = 260/width*750
        this.setData({
          width:width+'rpx'
        })
      }
    })        
          this.news()
      this.times = setInterval(()=>{
            this.data.time--
            this.setData({
              time: this.data.time
            })
            if (this.data.time==-1){
                this.news()
            }
          },
          1000)
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

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.times)
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