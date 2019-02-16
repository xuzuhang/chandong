// pages/login3s/login3s.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index: 30,
    height:160,
    weight: 0,
    weightValue: "kg",
    sex:1
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      height: parseInt(e.detail.value)+130
    })
  },
  damand: damand,
  kgnone:function(){
    this.setData({
      weightValue:''
    })
  },
  weight: function (res) {      //判断体重并记录
    var weight = res.detail.value
    var reg = /^([2-9]|1[0-9])([0-9](\.)| |)[0-9]$/    //20-200kg
    console.log(reg.test(weight))
    if (reg.test(weight)) {
      this.setData({
        weight: weight,
        weightValue: weight+'kg' 
      })
    } else {
      this.setData({
        weightValue: 'kg'
      })
      Icons.Toast('请输入正确格式如70.5', 'none')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newarry = []
    var sex = options.sex
    if(sex==1){
        this.setData({   //以男女设计身高体重初始值
          sex:1
        })
    }else{
      this.setData({
        sex: 2
      })
    }
    for (var i = 130; i < 251; i++) {     //身高130-251
      newarry.push(i)
    }
    this.setData({
      array: newarry
    })
    if (options.info) {
      var info = JSON.parse(options.info)
      this.setData({
        height: info.height,
        weight: info.weight,
        weightValue: info.weight + 'kg',
        index:info.height-130 
      })
    }
    
  },
  last: function () {   //点击上一步触发的函数
    this.damand('/users/genderandbirthday','GET','',(info)=>{
      var info = JSON.stringify(info.data.data)
      wx.reLaunch({
        url: '../login3/login3?info='+info
      })
    })
  },
  next: function () {  //点击下一步的函数
    if (this.data.weight) {
      this.damand('/users/heightandweight', 'PUT', {
        'height': this.data.height,
        'weight': this.data.weight
      }, (info) => {
        wx.navigateTo({
          url: '../login5/login5'
        })
      })
    } else {
      Icons.Toast('请输入体重', 'none')
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