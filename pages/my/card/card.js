// pages/my/card/card.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cardArray:[],
      upgrade:false
  },
  damand: damand,
  cardDetails:function(res){
    var id = res.currentTarget.dataset.id
        wx.navigateTo({
          url: '../cardDetails/cardDetails?id='+id,
        })
  },
  toindex(){
    wx.switchTab({
      url: '../../index/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getallcard()
  },
  upgrade() {
    this.damand('/cards/upgrade', "GET", "", (info) => {
      var info = info.data.data
      if(info.available){
        var len = this.data.cardArray.length
        console.log(this.data.cardArray)
        var index = 0
        for (var i = 0; i < len; i++) {
          if (this.data.cardArray[i].id == 3) {
                index = i
                break
          }
        }
        this.data.cardArray[index].price = info.price
        this.setData({
          cardArray: this.data.cardArray,
          upgrade:true
        })
      }
    })
  },
  getallcard(){
    this.damand("/cards", 'GET', '', (info) => {
      var info = info.data.data
      this.setData({
        cardArray: info
      })
      this.upgrade()
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