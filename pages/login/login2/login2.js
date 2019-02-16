// pages/login2/login2.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['3000以下','3000-5000','5000-10000','10000以上'],
    imgsrc:'',
    msg:'',
    name:'',
    job:'',
    minSalary:'',
    maxSalary:'',
    home:{
      address:'',
      latitude:'',
      longitude:''
    },
    jobadderss:{
      address: '',
      latitude: '',
      longitude: ''
    },
    index:''
  },
  damand: damand,
  nameinfo:function(res){             //昵称
    var names = res.detail.value;
      this.setData({
        msg: '错误',
        name: res.detail.value
      })
  },
  jobinfo:function(res){
    var jobs = res.detail.value;
    this.setData({
      job:jobs
    })
  },
  bindPickerChange: function (e) {
    this.data.minSalary = this.ranges[e.detail.value].min
    this.data.maxSalary = this.ranges[e.detail.value].max
    this.setData({
      index: e.detail.value,
      minSalary: this.data.minSalary,
      maxSalary: this.data.maxSalary
    })
    console.log(this.data.minSalary, this.data.maxSalary)
  },
  homeInfo:function(){
    wx.chooseLocation({
      success: (res)=> {
        this.setData({
          home:{
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      },
      fail:(res)=>{
        this.setData({
          home: {
            address: '',
            latitude: '',
            longitude:''
          }
        })
      }
    })
  },
  jobadderssInfo: function () {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          jobadderss: {
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        console.log(this.data.jobadderss)
      },
      fail:(res)=>{
        this.setData({
          jobadderss: {
            address: '',
            latitude: '',
            longitude:''
          }
        })
      }
    })
  },
  next:function(){  //点击下一步
    if (this.data.name != '' && this.data.home.address && this.data.jobadderss.address){
      this.damand('/users/essential', 'PUT', {
        'avatarUrl': this.data.imgsrc,
        'nickName': this.data.name,
        'job': this.data.job,
        'minSalary': this.data.minSalary,
        'maxSalary': this.data.maxSalary,
        'home': this.data.home,
        'work': this.data.jobadderss
      }, (info) => {
      wx.navigateTo({
        url: '../login3/login3'
      })
      })
    }else{
      switch(''){
        case this.data.name:
          Icons.Toast('请填写昵称', 'none')
          break;
        case this.data.home.address:
          Icons.Toast('请填写家庭位置', 'none')
          break;
        case this.data.jobadderss.address:
          Icons.Toast('请填写公司位置', 'none')
          break;
      }
      
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ranges = [
      { 'title': '3000以下', 'min': 0, 'max': 3000 },
      { 'title': '3000-5000', 'min': 3000, 'max': 5000 },
      { 'title': '5000-10000', 'min': 5000, 'max': 10000 },
      { 'title': '10000以上', 'min': 10000, 'max': null }
    ]
        wx.getUserInfo({
          success: (res) => {
            this.setData({
              imgsrc: res.userInfo.avatarUrl
            })
          },
          fail: (res) => {
            console.log(res)
          }
        })
        if (options.info){
        var info = JSON.parse(options.info)
        for (var i = 0; i < this.ranges.length; i++) {
          if (this.ranges[i].min == info.minSalary) {
            this.data.index = i
            break
          }
        }
        this.setData({
            name:info.nickName,
            home:info.home,
            jobadderss:info.work,
            job:info.job,
            index:this.data.index
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