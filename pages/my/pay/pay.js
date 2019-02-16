// pages/my/pay/pay.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      value:1,
      order:{},
      time:{
        m:'',
        s:''
      },
      changeValue:"",
      money:""
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order = JSON.parse(options.order)
    this.setData({
      order: this.data.order
    })
    console.log(this.data.order)
    this.settime()
    this.point()
  },
  point(){
    this.damand('/users/credits', "GET", "", (info) => {
      var info = info.data.data
      this.setData({
        changeValue: info
      })
      this.damand('/users/balances?count=5&max=""', 'GET', '', (info) => {
        var info = info.data.data
        if (info.length == 0) {
          this.data.money = '0.00'
        } else {
          this.data.money = info[0].balance.toFixed(2)
        }
       
        this.setData({
          money: this.data.money
        })
      })
    })
  },
  radioChange(res){
    this.setData({
      value: res.detail.value
    })
    console.log(res.detail.value)
  },
  sure(){
      if(this.data.value==3){      //假如用余额支付
        this.pays('/cards/orders/' + this.data.order.id + '/pay')
      } else if (this.data.value == 4){
        this.pays('确认支付' + this.data.order.price*2 + '蜕变值吗','/cards/orders/' + this.data.order.id + '/pay/credits')
      } else if(this.data.value == 1){
        this.wxpay('确认支付' + this.data.order.price + '元吗')
      }
  },
  wxpay(){

    wx.showModal({
      title: '提示',
      content: '确认支付' + this.data.order.price + '元吗',
      success: res => {
        if (res.confirm) {
          this.damand('/cards/orders/'+this.data.order.id+'/pay/weixin', "POST", '', (info) => {
            var info = info.data.data
            console.log(info)
            wx.requestPayment({
              'timeStamp':info.timeStamp,
              'nonceStr': info.nonceStr,
              'package':info.package,
              'signType':info.signType,
              'paySign': info.paySign,
              'success': (res)=> {
                    this.data.order.status=2
                    this.setData({
                      order: this.data.order
                    })
                   var infostr = JSON.stringify(this.data.order)
                  clearInterval(this.timer)
                  wx.navigateTo({
                    url: '../orderDetails/orderDetails?order=' + infostr
                  })
              },
              'fail': function (res) {
                console.log(res)
              }
            })
           
          }, "付款中")

        }
      }
    })
  },
  pays(msg,url){
    wx.showModal({
      title: '提示',
      content: msg,
      success: (res) => {
        if (res.confirm) {
          this.damand(url, "POST", '', (info) => {
            var info = info.data.data
            var infostr = JSON.stringify(info)
            clearInterval(this.timer)
            wx.navigateTo({
              url: '../orderDetails/orderDetails?order=' + infostr,
              success() {
                Icons.Toast('付款成功', 'success')
              }
            })
          }, "付款中")

        }
      }
    })
  },
  settime(){
    this.damand('/time', "GET", "", (info) => {
      var time = info.data.data
      var otime = new Date(time).getTime()
      var ntime = new Date(this.data.order.expires).getTime()
      var Surplus = ntime - otime
      var date = new Date(Surplus)
      this.data.time.m = this.addzero(date.getMinutes())
      this.data.time.s = this.addzero(date.getSeconds())
      this.timer = setInterval(() => {
        if (Surplus <= 0) {
          this.data.time.m = "00"
          this.data.time.s = "00"
        } else {
          Surplus = Surplus - 1000
          date = new Date(Surplus)
          this.data.time.m = this.addzero(date.getMinutes())
          this.data.time.s = this.addzero(date.getSeconds())
        }
        this.setData({
          time: this.data.time
        })
      }, 1000)
    })
  },
  addzero(str){
      if(str<10){
        return "0"+str
      }else{
        return  str
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
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer)
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