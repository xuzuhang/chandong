// pages/store/store.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      index:1,
      longitude:0,
      latitude:0,
      listArr:[],
      district:'金华市',
      markers: [],
      Clongitude:0,
      Clatitude:0
  },
  damand: damand,
  bindmarker:function(res){
    var index = res.markerId
    var mlatitude =0
    var mlongitude=0
    var name = ''
    var address=''
    for (var i = 0; i < this.data.markers.length;i++){
      if (index == this.data.markers[i].id){
        mlatitude = this.data.markers[i].latitude 
        mlongitude = this.data.markers[i].longitude
        name = this.data.markers[i].label.content
        address = this.data.markers[i].title
        break
      }
    }
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude:mlatitude,
          longitude:mlongitude,
          scale: 28,
          name:name,
          address: address
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getalllocinfo(){
    wx.getLocation({
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        this.damand('/shops/nearest?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&count=1', "GET", '', (info) => {
          var info = info.data.data[0]
          this.setData({
            Clongitude: info.longitude,
            Clatitude: info.latitude
          })
        })

        wx.request({   //反查询
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + this.data.latitude + ',' + this.data.longitude + '&key=TD5BZ-66ICJ-APSFG-KRNSO-2MCES-SOFVN',
          success: (info) => {
            var info = info.data.result.address_component.district
            this.setData({
              district: info
            })
          }
        })


        this.damand('/shops', 'GET', '', (info) => {      //获取门店信息并渲染
          var info = info.data.data
          var marker = []                                             //地图渲染
          for (var i = 0; i < info.length; i++) {
            var objs = {
              id: i + 1, latitude: info[i].latitude, longitude: info[i].longitude, title: info[i].name,
              iconPath: '../storeimg/maplogo1.png', width: 27, height: 30, label: {
                content: info[i].name, color: '#d3007f', textAlign: 'left', x: -30
              }
            }
            marker.push(objs)
          }
          this.setData({
            markers: marker
          })
          var La1 = this.data.latitude * Math.PI / 180.0;
          var Lo1 = this.data.longitude;
          var La2
          var Lo2
          var earthRadius = 6371;
          for (var i = 0; i < info.length; i++) {
            Lo2 = info[i].longitude
            La2 = info[i].latitude * Math.PI / 180.0;
            var La3 = La1 - La2;
            var Lb3 = Lo1 * Math.PI / 180.0 - Lo2 * Math.PI / 180.0;
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
            s = s * 6378.137;//地球半径
            s = parseInt(Math.round(s * 10000) / 10);      //距离计算添加对象
            info[i].distance = s
          }
          console.log(info)
          this.setData({
            listArr: info
          })
        })
      }
    })
  },
  tab:function(res){      //tab切换逻辑
    var index = res.currentTarget.dataset.index      
    this.setData({
      index:index
    })
  },
  infoNext:function(res){  //点击跳转到下一页
    Icons.slod("加载中")
    var id = res.currentTarget.dataset.index+1
    var dis = this.data.listArr[id-1].distance
      wx.navigateTo({
        url: '../storeInfo/storeInfo?id='+id+'&dis='+dis,
        success(){
          Icons.hide()
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getalllocinfo()
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
    setTimeout(() => {
      this.getalllocinfo()
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
  onShareAppMessage: function () {
    return {
      title: '蝉动健身',
      path: '/pages/common/enterImg/enterImg',
      imageUrl: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/advertisements/share.jpg'
    }
  }
})