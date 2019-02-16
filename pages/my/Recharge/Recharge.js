const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      money:"0.00",
      len:0,
      Recharge:[{
        rec:"300",
        info:"3"
      }, {
        rec: "500",
        info: "10"},{
          rec: "1000",
          info: "30"
        },{
          rec: "2000",
          info: "80"
        },{
          rec: "5000",
          info: "250"
        },{
          rec: "10000",
          info: "600"
        }],
        indexs:0
  },  
  listchangge(res){
    var index = res.currentTarget.dataset.index
    this.setData({
      indexs:index
    })
  },
  checkboxChange(res){
    this.setData({
      len: res.detail.value.length
    })
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        money:options.money
      })
  },  
  toPay(){
    if(this.data.len){
      this.damand("/recharges", "POST", {
        'amount': parseFloat(this.data.Recharge[this.data.indexs].rec)
      }, res => {
        var info = JSON.stringify(res.data.data)
        wx.navigateTo({
          url: '../payRecharge/payRecharge?order='+info,
        })
      })
    }else{
      wx.showToast({
        title: '请阅读并同意支付协议',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  toMsg(){
      wx.navigateTo({
        url: '../msg/msg',
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