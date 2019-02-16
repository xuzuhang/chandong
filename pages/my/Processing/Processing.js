// pages/my/Processing/Processing.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      listArray:[]
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getallpro()
  },
  getallpro(){  //得到数组
    this.damand("/complaints","GET","",(info)=>{
      var info = info.data.data
      this.data.listArray = info
      var len = info.length
      for(var i = 0;i<len;i++){
        this.data.listArray[i].createTime = this.gettime(info[i].createTime)
      }
      this.setData({
        listArray: this.data.listArray
      })
    })
  },
  gettime(time){
      var date = new Date(time)
      var ndate = this.addzero(date.getFullYear()) + "/" + this.addzero(date.getMonth() + 1)+"/"+this.addzero(date.getDate())+" "+this.addzero(date.getHours())+":"+ this.addzero(date.getMinutes())+":"+this.addzero(date.getSeconds())
      return ndate
  },
  addzero(str){
      if(str<10){
        return "0"+str
      }else{
        return str
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