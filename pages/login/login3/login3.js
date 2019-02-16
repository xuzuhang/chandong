// pages/login3/login3.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexarray: [{ pic: '../lgimg/sexm1.png', picc:'../lgimg/sexm2.png',dism:"none",disc:"block"},
      { pic: '../lgimg/sexw1.png', picc: '../lgimg/sexw2.png', dism: "block", disc:"none" }],
      sex:1,
      date: '1990-01-01'
  },
  bindDateChange:function(res){    //记录生日值
    this.setData({
      date: res.detail.value
    })
  },
  damand: damand,
  changesex:function(res){        //改变男女性别样式并记录
      var index = res.currentTarget.dataset.sex
      if(index == 0){
        this.data.sexarray[0].dism = "none"
        this.data.sexarray[0].disc = "block"
        this.data.sexarray[1].dism = "block"
        this.data.sexarray[1].disc = "none"
          this.setData({
            sex:1,    //记录男女
            sexarray: this.data.sexarray  //改变渲染
          })
      }else{
        this.data.sexarray[0].dism = "block"
        this.data.sexarray[0].disc = "none"
        this.data.sexarray[1].dism = "none"
        this.data.sexarray[1].disc = "block"
        this.setData({
          sex:2,
          sexarray: this.data.sexarray 
        })
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.info){
      var info = JSON.parse(options.info)
      if (info.gender==1){
        this.data.sexarray[0].dism = "none"
        this.data.sexarray[0].disc = "block"
        this.data.sexarray[1].dism = "block"
        this.data.sexarray[1].disc = "none"
      }else{
        this.data.sexarray[0].dism = "block"
        this.data.sexarray[0].disc = "none"
        this.data.sexarray[1].dism = "none"
        this.data.sexarray[1].disc = "block"
      }
      this.setData({
        sex: info.gender,
        date: info.birthday,
        sexarray: this.data.sexarray
      })
    }
  },
  last:function(){   //点击上一步触发的函数
    this.damand('/users/essential','GET','',(info)=>{
      var info = info.data.data
      info = JSON.stringify(info)
      wx.reLaunch({
        url: '../login2/login2?info='+info
      })
    })
  },
  next:function(){  //点击上一步的函数
         this.damand('/users/genderandbirthday', 'PUT', {
            'gender': this.data.sex,
            'birthday': this.data.date
          }, (info) => {
            wx.navigateTo({
              url: '../login4/login4?sex=' + this.data.sex
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