// pages/my/Lockers/Lockers.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      state:1,
      num:'001',
      shop:"浙师大",
      otime:0,
      timer:{
        h:'00',
        m:'00',
        s:'00'
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.damand("/shops/lockers",'GET','',(info)=>{
        var info = info.data
        console.log(info)
        if(info.data){
          this.data.otime = new Date(info.data.startTime).getTime()
          this.setData({
            otime:this.data.otime,
            state: 2
          })
          this.setTime()
        }else{
          this.setData({
            state: 1
          })
        }
    })
  },
  damand: damand,
  start(){   //当点击启用柜子

   
    this.damand("/shops/lockers", 'POST', '', (info) => {
      var info = info.data
      console.log(info)
        this.data.num = info.data.number
        this.data.otime = new Date(info.data.startTime).getTime()
        this.damand("/shops/" + info.data.shopId, 'GET', '', (info) => {
          var shop = info.data.data.name
          this.setData({
            state:2,
            num: this.data.num,
            shop: shop,
            otime: this.data.otime
          })
          this.setTime()
        })
      
    })
  },
  Retire(){   //按退租
    wx.showModal({
      title: '您确定要退租吗',
      success:(res)=> {
        if (res.confirm) {
          clearInterval(this.sett)
          this.damand("/shops/lockers", 'DELETE', '', (info) => {
            var info = info.data
            clearInterval(this.sett)
            this.setData({
              state: 3
            })
          },"退租中")
        } 
      }
    })
    
  },
  setTime(){
    this.damand("/time","GET",'',(info)=>{

      var info = info.data.data
      var times = new Date(info).getTime()
      var time = times - this.data.otime - 8 * 60 * 60 * 1000
      var ndate = new Date(time)
      this.data.timer.h = this.addzero(ndate.getHours())
      this.data.timer.m = this.addzero(ndate.getMinutes())
      this.data.timer.s = this.addzero(ndate.getSeconds())
      this.setData({
        timer: this.data.timer
      })
     this.sett=setInterval(()=>{
       console.log(11)
        time = time +1000
        ndate = new Date(time)
        this.data.timer.h = this.addzero(ndate.getHours())
        this.data.timer.m = this.addzero(ndate.getMinutes())
        this.data.timer.s = this.addzero(ndate.getSeconds())
        this.setData({
          timer: this.data.timer
        })
      },1000)
    })
  },
  addzero(str){
      if(str<10){
        return "0"+str
      }else{
        return str
      }
  },
  open(){  //开柜子
    this.damand("/shops/lockers/open","POST",'',(info)=>{
      wx.hideLoading()
       var info = info.data
       if(info.code==0){
         setTimeout(function(){
           wx.showToast({
             title: '开柜成功',
             icon: 'success',
             duration: 2000
           })
         },400)
        
       }
    },"开柜中")
  },
  back(){
    wx.navigateBack({
      delta:1
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
    clearInterval(this.sett)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.sett)
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