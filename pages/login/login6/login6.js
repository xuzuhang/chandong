// pages/login6/login6.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoArray: [{
      title: '减肥减脂',
      info: '降低体重,减少体脂'
    },
    {
      title: '增肌塑性',
      info: '操练肌群,塑身美型'
    },
    {
      title: '柔韧协调',
      info: '操练肌肉群,塑身美型'
    },
    {
      title: '减压维持',
      info: '释放压力,强化抗性'
    }
    ],
    inx: 0
  },
  damand: damand,
  change: function (res) {
    var index = res.currentTarget.dataset.i  //点击进行tab切换
    this.setData({
      inx: index
    })
  },
  last: function () {   //点击上一步触发的函数
    this.damand('/users/bodytype', 'GET', '', (info) => {
      var info = JSON.stringify(info.data.data)
      wx.reLaunch({
        url: '../login5/login5?info=' + info
      })
    })
  },
  next: function () {  //点击下一步的函数
    this.damand('/users/purpose', 'PUT', {
      'purpose': this.data.inx
    }, (info) => {
      wx.navigateTo({
        url: '../login7/login7'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.info){
      var info = JSON.parse(options.info)
      this.setData({
        inx:info.purpose
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