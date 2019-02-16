// pages/login7/login7.js
var num1 = 0
var num2 = 0
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classArray: [{'name':"1",'state':0}
      , {'name': "2", 'state':0 }, {'name': 3, 'state':0}, {'name': 9, 'state':0}, {'name': 10, 'state':0}
      , {'name': "篮球", 'state':0 }, {'name': "300", 'state':0}, {'name': "100",'state':0}],
    classcs:[],
    classchose:[],
    courseArray: [{ 'name': "6", 'state': 0 }
      , { 'name': "足球", 'state': 0 }, { 'name': 8, 'state': 0 }, { 'name': 9, 'state': 0 }, { 'name': 150, 'state': 0 }
      , { 'name': 1200, 'state': 0 }, { 'name': 78, 'state': 0 }, { 'name': 90, 'state': 0 }],
     coursecs:[],
     coursechose:[]
  },
  damand: damand,
  classchoose:function(res){    //项目喜好的逻辑
    var index = res.currentTarget.dataset.i 
    var  that = this
    var  lock = true
    for (var i = 0; i < this.data.classcs.length; i++) {
      console.log(this.data.classcs[i],index)
      if (this.data.classcs[i] == index) {
        lock = false
        this.data.classArray[index].state = 0
        this.data.classcs.splice(i, 1)
      }
    }
    if(lock){
      if (this.data.classcs.length == 3) {
        num1++
        switch (num1 % 3) {
          case 1:
            this.data.classArray[that.data.classcs[0]].state = 0
            this.data.classcs[0] = index
            break;
          case 2:
            this.data.classArray[that.data.classcs[1]].state = 0
            this.data.classcs[1] = index
            break;
          case 0:
            this.data.classArray[that.data.classcs[2]].state = 0
            this.data.classcs[2] = index
            break;
        }
        this.data.classArray[index].state = 1
      } else {
        if (this.data.classArray[index].state == 1) {
          this.data.classcs.pop(index)
          this.data.classArray[index].state = 0
        } else if (this.data.classArray[index].state == 0) {
          this.data.classArray[index].state = 1
          this.data.classcs.push(index)
        }
      }
    }
    this.setData({
      classArray: this.data.classArray,
      classcs: this.data.classcs
    });
  },
  coursechoose:function(res){
    var index = res.currentTarget.dataset.i
    var that = this
    var lock = true
    for (var i = 0; i < this.data.coursecs.length; i++) {
      console.log(this.data.coursecs[i], index)
      if (this.data.coursecs[i] == index) {
        lock = false
        this.data.courseArray[index].state = 0
        this.data.coursecs.splice(i, 1)
      }
    }
    if (lock) {
      if (this.data.coursecs.length == 3) {
        num2++
        switch (num2 % 3) {
          case 1:
            this.data.courseArray[that.data.coursecs[0]].state = 0
            this.data.coursecs[0] = index
            break;
          case 2:
            this.data.courseArray[that.data.coursecs[1]].state = 0
            this.data.coursecs[1] = index
            break;
          case 0:
            this.data.courseArray[that.data.coursecs[2]].state = 0
            this.data.coursecs[2] = index
            break;
        }
        this.data.courseArray[index].state = 1
      } else {
        if (this.data.courseArray[index].state == 1) {
          this.data.coursecs.pop(index)
          this.data.courseArray[index].state = 0
        } else if (this.data.courseArray[index].state == 0) {
          this.data.courseArray[index].state = 1
          this.data.coursecs.push(index)
        }
      }
    }
    this.setData({
      courseArray: this.data.courseArray,
      coursecs: this.data.coursecs
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.interests()
    this.courses()
  },
  courses(){
    wx.request({
      url: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/users/configs/courses.js',
      success: (info) => {
        var coursearr = []
        for (var i = 0; i < info.data.length; i++) {
          var obj = {
            name: info.data[i],
            state: 0
          }
          coursearr.push(obj)
        }
        this.setData({
          courseArray: coursearr
        })
      }
    })
  },
  interests(){
    wx.request({
      url: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/users/configs/interests.js',
      success: (info) => {
        var classarr = []
        for (var i = 0; i < info.data.length; i++) {
          var obj = {
            name: info.data[i],
            state: 0
          }
          classarr.push(obj)
        }
        this.setData({
          classArray: classarr
        })
      }
    })
  },
  last: function () {   //点击上一步触发的函数
    this.damand('/users/purpose', 'GET', '', (info) => {
      var info = JSON.stringify(info.data.data)
      wx.reLaunch({
        url: '../login6/login6?info='+info
      })
    })
  },
  next: function () {  //点击下一步的函数
    var length1 = this.data.classcs.length
    var length2 = this.data.coursecs.length
    if (length1 < 1 || length2<1){
      Icons.Toast('项目和课程至少选一个哦', 'none')
    }else{
      for (var i = 0; i < length1; i++) {
        this.data.classchose.push(this.data.classArray[this.data.classcs[i]].name)
      }
      for (var i = 0; i < length2; i++) {
        this.data.coursechose.push(this.data.courseArray[this.data.coursecs[i]].name)
      }
      this.setData({
        classchose: this.data.classchose,
        coursechose: this.data.coursechose
      })
      this.damand('/users/interestsandcourses', 'PUT', {
        'interests': this.data.classchose,
        'courses': this.data.coursechose
    }, (info) => {
      wx.getStorage({
        key: 'Whatfor',
        success: (res) => {
          var res = res.data
          if (res.event) {  
            wx.redirectTo({
              url: '../../my/card/card',
            })
          } else {
            wx.switchTab({
              url: '../../index/index/index'
            })
          }
        }
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