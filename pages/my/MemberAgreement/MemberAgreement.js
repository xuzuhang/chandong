// pages/my/MemberAgreement/MemberAgreement.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    time: '2018年7月',
    scroll: "",
    autograImg:'',
    price:"",
    ids:'',
    referrerId:""
  },
  damand: damand,
  gettimes() {  //得到时间
    var date = new Date();   //获得时间
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    this.data.time = year + '年' + mouth + '月' + day + '日'
    this.setData({
      time: this.data.time
    })},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettext()
    this.getReferrerId()
    this.setData({
      price:options.price,
      ids:options.ids
    })
      this.gettimes()
      wx.setStorage({
        key: 'autograph',
        data: '',
      })
  },
  getReferrerId() {
    wx.getStorage({
      key: 'Whatfor',
      success: (res) => {
        this.setData({
          referrerId: res.data.Referee
        })
      }
    })
  },
  gettext(){
    wx.request({
      url: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/agreements/register.txt',
      method:"GET",
      success:(info)=>{
        this.setData({
          text:info.data
        })
      }
    })
   
  },
  scroll(e) {
    if (e.detail.scrollHeight <= e.detail.scrollTop + 340) {
      this.setData({
        scroll: 1
      })
    }
  },
  toautoraph: function () {   //去签名页
    wx.navigateTo({
      url: '../autograph/autograph',
    })
  },
  sure(){
    if (this.data.scroll==""){
      wx.showToast({
        title: '请阅读完成会员协议',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.autograImg==""){
      wx.showToast({
        title: '请签上自己名字',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.damand('/cards/orders', "POST",
        {
          'cardId': this.data.ids,
          'signatureUrl': this.data.autograImg,
          'referrerId': this.data.referrerId
        },(info) => {
          var info = info.data.data
          var infostr = JSON.stringify(info)
          if (info.status == 2) {
            wx.navigateTo({
              url: '../orderDetails/orderDetails?order=' + infostr
            })
          } else {
            wx.navigateTo({
              url: '../pay/pay?order=' + infostr
            })
          }
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
    wx.getStorage({
      key: 'autograph',
      success: (res) => {
        this.setData({
          autograImg: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key: 'autograph',
      data: '',
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key: 'autograph',
      data: '',
    })
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