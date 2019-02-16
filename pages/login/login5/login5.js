// pages/login4/login4.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
var http = 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/users/bodytypes/'
Page({

  /**
   * 页面的初始数据
   */
  data:{
    imgs:[],
    index:0,
    sex:1
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.info){
      var infos = JSON.parse(options.info).bodyType
      console.log(infos)
      this.getallimg(infos)
    }else{
      this.getallimg()
    }
  },
  getallimg(infos){
    this.damand('/users/genderandbirthday','GET','',(info)=>{  
      if (info.data.data.gender==1){
        this.setData({
          sex:1,
          imgs: [{ img: http + 'mm1.png', chose: http + 'm1.png', statei: 'none', statec: "block" }, { img: http + 'mm2.png', chose: http + 'm2.png', statei: 'block', statec: "none" }, { img: http + 'mm3.png', chose: http + 'm3.png', statei: 'block', statec: "none" }, { img: http + 'mm4.png', chose: http + 'm4.png', statei: 'block', statec: "none" }, { img: http + 'mm5.png', chose: http + 'm5.png', statei: 'block', statec: "none" }, { img: http + 'mm6.png', chose: http + 'm6.png', statei: 'block', statec: "none" }]
        })
      }else{
        this.setData({
          sex:2,
          imgs: [{ img: http + 'nn1.png', chose: http + 'n1.png', statei: 'none', statec: "block" }, { img: http + 'nn2.png', chose: http + 'n2.png', statei: 'block', statec: "none" }, { img: http + 'nn3.png', chose: http + 'n3.png', statei: 'block', statec: "none" }, { img: http + 'nn4.png', chose: http + 'n4.png', statei: 'block', statec: "none" }, { img: http + 'nn5.png', chose: http + 'n5.png', statei: 'block', statec: "none" }, { img: http + 'nn6.png', chose: http + 'n6.png', statei: 'block', statec: "none" }]
        })
      }
      if (infos) {
        this.data.imgs[0].statec = "none"
        this.data.imgs[0].statei = "block"
        this.data.imgs[infos].statec = "block"
        this.data.imgs[infos].statei = "none"
        this.data.index = infos
      } else {
        this.data.index = 0
      }
      this.setData({
        index: this.data.index,
        imgs: this.data.imgs
      })
      })
  },
  last: function () {   //点击上一步触发的函数
    this.damand('/users/heightandweight', 'GET', '', (info) => {
      var info = JSON.stringify(info.data.data)
      wx.reLaunch({
        url: '../login4/login4?info='+info
      })
    })
  },
  next: function () {  //点击下一步的函数
    this.damand('/users/bodytype', 'PUT', {
        'bodytype':this.data.index
      }, (info) => {
        wx.navigateTo({
          url: '../login6/login6'
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  changeimg:function(res){
    var i = res.currentTarget.dataset.img
    this.data.imgs[this.data.index].statec = "none"
    this.data.imgs[this.data.index].statei = "block"
    this.data.imgs[i].statec = "block"
    this.data.imgs[i].statei = "none"
    this.setData({
      imgs: this.data.imgs,
      index:i
    })
   
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