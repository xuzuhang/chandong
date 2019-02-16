// pages/index/index.js
const damand = require('../../../utils/request.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    district:"金华",
    storelist:[],
    banner: []
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var promise = new Promise(function (resolve) {
      resolve(42);
    });
    promise.then(this.getlocation()).then(this.getAdvertisement())
   
  },
  toJoin(){
      wx.navigateTo({
        url: '../joinUs/joinUs',
      })
  },
  toshopinfo(res){  //去店的详细信息页面
    var id = res.currentTarget.dataset.index+1
    var dis = this.data.storelist[id-1].distance
    wx.navigateTo({
      url: '../../store/storeInfo/storeInfo?id=' + id + '&dis=' + dis,
    })
  },
  getstore(latitude, longitude){
    this.damand('/shops/nearest?latitude=' + latitude + '&longitude=' + longitude + '&count=6', 'GET', '', (info) => {
      var info = info.data.data
      info.forEach(function (val){
        val.distance = val.distance.toFixed(0)
      })
      this.setData({
        storelist:info
      })
    })
  },
  getlocation(){
      wx.getLocation({
        success: (res)=> {
          this.getstore(res.latitude, res.longitude)   //获得门店
          wx.request({   //反查询
            url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=TD5BZ-66ICJ-APSFG-KRNSO-2MCES-SOFVN',
            success: (info) => {
              var info = info.data.result.address_component.district
              this.setData({
                district: info
              })
            }
          })
        }
      })
  },
  getAdvertisement(){
    this.damand('/advertisements', 'GET', '', (info) => {
      var info = info.data.data
      info.forEach((val)=>{
        console.log(JSON.parse(val.parameters))
        val.parameters = JSON.parse(val.parameters)
      }) 
      this.setData({
        banner:info
      })
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
    var promise = new Promise(function (resolve) {
      resolve(42);
    });
    promise.then(this.getlocation()).then(this.getAdvertisement())
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '蝉动健身',
      path: '/pages/common/enterImg/enterImg',
      imageUrl:'https://static-1257000451.cos.ap-shanghai.myqcloud.com/advertisements/share.jpg'
    }
  }
})