// pages/store/storeInfo/storeInfo.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:1,
    id:1,
    storeImg:'',
    storeName:'',
    storeAddress:'',
    storelongitude:0,
    storelatitude:0,
    storedistance:0,
    storeClassrooms:0,
    storetotalArea:0,
    storepersonalArea:0,
    apparatusArray:[],
    apsArray:[]
  },
  tab: function (res) {      //tab切换逻辑
    var index = res.currentTarget.dataset.index
    if (this.data.apsArray.length==0 && index==2){
      this.damand("/shops/types/"+this.data.id,"GET",'',(info)=>{
        var info = info.data.data
        console.log(info)
        this.setData({
          apsArray:info
        })
      })
    }
    this.setData({
      index: index
    })
  },
  damand: damand,
  location:function(){
        wx.openLocation({
          latitude: this.data.storelatitude,
          longitude: this.data.storelongitude,
          scale: 28,
          name: this.data.storeAddress
        })
  },
  tocard:function(){
    wx.navigateTo({
      url: '../../my/card/card',
    })
  },
  tovideo:function(res){
    var id = res.currentTarget.dataset.index
    wx.navigateTo({
      url: '../apparatus/apparatus?id='+id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.data.storedistance = options.dis
    this.getstore(id)
    this.damand("/facilities/types","GET","",(info)=>{
              console.log(info.data.data)
    })
  },
  getstore(id){  //得到门店信息
    this.damand('/shops/' + id, 'GET', '', (info) => {
      var info = info.data.data
      this.setData({
        storeImg: info.coverUrl,
        storeName: info.name,
        storeAddress: info.address,
        storelongitude: info.longitude,
        storelatitude: info.latitude,
        storedistance: this.data.storedistance,
        storeClassrooms: info.classrooms,
        storetotalArea: info.totalArea,
        storepersonalArea: info.personalArea,
        id: id
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