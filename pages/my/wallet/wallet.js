// pages/my/wallet/wallet.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      money:"0.00",
      arraylist:[],
      num:1
  },
  toRecharge(){
      wx.navigateTo({
        url: '../Recharge/Recharge?money='+this.data.money,
      })
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  addzero(str) {
    if (str < 10) {
      return "0" + str
    } else {
      return str
    }
  },  
  lower(){
    if(this.data.num==''){
      wx.showToast({
        title: '没有数据了哦',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.damand('/users/credits/list?count=6&max=' + this.data.num, 'GET', '', (info) => {
        var info = info.data.data
        if (info.length == 0) {
          this.data.num = ''
        } else {
          this.data.num = info[info.length - 1].id
        }
        info.forEach((currentValue, index, arr) => {
          var date = new Date(currentValue.createTime)
          var year = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
          currentValue.createTime = year
          if (currentValue.amount > 0) {
            currentValue.color = '#9cf486'
            currentValue.amount = "+" + currentValue.amount.toFixed(2)
          } else if (currentValue.amount == 0) {
            currentValue.color = '#9cf486'
          } else {
            currentValue.color = '#696969'
            currentValue.amount = currentValue.amount.toFixed(2)
          }
          this.data.arraylist.push(currentValue)
        })

        this.setData({
          arraylist: this.data.arraylist,
          num: this.data.num
        })
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
    this.damand('/users/credits/list?count=6&max=""', 'GET', '', (info) => {
      var info = info.data.data
      if (info.length == 0) {
        this.data.money = '0.00',
          this.data.num = ''
      } else {
        this.data.money = info[0].balance.toFixed(2)
        this.data.num = info[info.length - 1].id
      }
      info.forEach((currentValue, index, arr) => {
        var date = new Date(currentValue.createTime)
        var year = date.getFullYear() + '/' + this.addzero((date.getMonth() + 1)) + '/' + this.addzero(date.getDate()) + " " + this.addzero(date.getHours()) + ":" + this.addzero(date.getMinutes()) + ":" + this.addzero(date.getSeconds())
        currentValue.createTime = year
        if (currentValue.amount > 0) {
          currentValue.color = '#9cf486'
          currentValue.amount = "+" + currentValue.amount.toFixed(2)
        } else if (currentValue.amount == 0) {
          currentValue.color = '#9cf486'
        } else {
          currentValue.color = '#696969'
          currentValue.amount = currentValue.amount.toFixed(2)
        }
        this.data.arraylist.push(currentValue)
      })
      this.setData({
        money: this.data.money,
        arraylist: this.data.arraylist,
        num: this.data.num
      })
    })
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