// pages/sport/Allinstruments/Allinstruments.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apsArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.damand('/facilities/types', "GET", "", (info) => {
      var info = info.data.data
      this.setData({
        apsArray: info
      })
    })
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  tovideo(res){
    var id = res.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../store/apparatus/apparatus?id=' + id
    })
  },
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