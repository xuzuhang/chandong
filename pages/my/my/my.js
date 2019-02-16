// pages/my/my.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      top:'-128rpx',
      cmargin:'0 auto',
      allDay:"",
      user:{
        img:"",
        name:""
      },
      Remainingtime:"",
      changeValue:"",
      upgrade:false,
      freezecount:0,
      Thaw:false
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var promise = new Promise(function (resolve) {
      resolve(42);
    });
   promise.then(this.getinfo()).then(this.getallday()).then(this.Remainingtime()).then(this.changeValue())
  },
  tobuyYear(){
    wx.navigateTo({
      url: '../cardDetails/cardDetails?id=3',
    })
  },
  ThawChange(){
    wx.showModal({
      content: '您确定要解冻吗',
      success: (res) => {
        if (res.confirm) {
          this.damand('/cards/unfreeze', "POST","", (info) => {
            this.Remainingtime()
            setTimeout(function () {
              Icons.Toast('解冻成功', 'success')
            }, 400)
          })
        }
      }
    })
  },
  freeChange(){
    wx.showModal({
      title: '您确定要冻结吗',
      content: '还有' + this.data.freezecount+"次机会(一次冻结30天)",
      success:(res)=> {
        if (res.confirm) {
          this.damand('/cards/freeze', "POST", {'amount': 1}, (info) => {
            this.Remainingtime()
            setTimeout(function (){
              Icons.Toast('冻结成功', 'success')
            },400)
          })
        }
      }
    })
  },
  freezecount(){
    this.damand('/cards/freezecount', "GET", "", (info) => {
      var info = info.data.data
      this.setData({
        freezecount:info
      })
    })
  },
  upgrade(){
    this.damand('/cards/upgrade', "GET", "", (info) => {
      var info = info.data.data
      if (!info.available){
        if (this.data.Remainingtime !== 0){
              this.freezecount()
          }
      }else{
        wx.showToast({
          title:'您可以在10天内升级哦',
          icon: 'none',
          duration: 2000
        })
      }
      this.setData({
        upgrade: info.available
      })
    })
  },
  changeValue(){
    this.damand('/users/credits', "GET", "", (info) => {
      var info = info.data.data
      this.setData({
        changeValue:info
      })
    })
  },
  Remainingtime(){
    this.damand('/cards/points', "GET", "", (info) => {
      console.log(info)
      var info = info.data.data
      var time = Math.ceil(info.points/24)
      if (!info.isFrozen){
          this.upgrade()
        
      }
      this.setData({
        Remainingtime:time,
        Thaw: info.isFrozen
      })
    })
  },
   getallday(){
    this.damand('/users/registertime', "GET", "", (info) => {
      var info = info.data.data
      var odate = new Date(info)
      var zeroDate = odate.getFullYear() + "/" + (odate.getMonth() + 1) + "/" + odate.getDate()
      zeroDate = new Date(zeroDate)
      zeroDate = zeroDate.getTime()
      var ndate = new Date().getTime()
      var gdate = ndate - zeroDate
      var day = Math.ceil(gdate / 1000 / 60 / 60 / 24)
      console.log(day)
      this.setData({
        allDay:day
      })
    })
  },
  getinfo(){
    this.damand('/users/essential',"GET","",(info)=>{
      var info = info.data.data
      this.data.user.img = info.avatarUrl
      this.data.user.name = info.nickName
      this.setData({
        user: this.data.user
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
      this.setData({
        top:0,
        cmargin: '85rpx auto 0'
      })
      setTimeout(()=>{
        var promise = new Promise(function (resolve) {
          resolve(42);
        });
        promise.then(this.getallday()).then(this.Remainingtime()).then(this.changeValue())
        this.setData({
          top: '-128rpx',
          cmargin:'0 auto'
        })
        wx.stopPullDownRefresh()
      },1000)
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