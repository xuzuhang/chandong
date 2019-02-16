// pages/state/state.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      video:{
        id:"",
        array:[]
      },
      img1:{
        he:"",
        w:""
      }
  },
  damand: damand,
  photo(){
    wx.showActionSheet({
      itemList: ['拍摄', '从手机相片中选择', '运动时刻(15s短视频)'],
      success:(res)=> {
        switch (res.tapIndex){
          case 0:
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                wx.navigateTo({
                  url: '../Release/Release?types=photo&src=' + tempFilePaths,
                })
              }
            })
            break;
          case 1:
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
              success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                wx.navigateTo({
                  url: '../Release/Release?types=photo&src=' + tempFilePaths,
                })
              }
            })
            break;
          case 2:
            wx.chooseVideo({
              sourceType: ['camera'],
              compressed:true,
              maxDuration: 15,
              camera: 'back',
              success: (res) => {
                if (res.duration > 15) {
                  wx.showToast({
                    title: '视频超过15秒',
                    icon: 'none'
                  })
                  return;
                }else{
                  var vid = JSON.stringify(res)
                  wx.navigateTo({
                    url: '../Release/Release?types=video&src=' + vid,

                  })
                }
                
              }
            })
            break;
        }
      }
    })
     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var promise = new Promise(function (resolve) {
      resolve(42);
    });
    promise.then(this.getallvideo())
  },
  toinfo(e){
    var ind = e.currentTarget.dataset.ind
    console.log(ind)
    var types = this.data.video.array[ind].type
    var id = this.data.video.array[ind].id
    wx.navigateTo({
      url: '../stateinfo/stateinfo?type='+types+'&id=' + id
    })
  },
  
  times(val,index){
      var index = this.data.video.array.length + index
      var date = new Date(val.createTime)
      var date1 = date.getTime()
      this.damand('/time', "GET", "",(info)=>{
          var date2 = new Date(info.data.data).getTime()
          var Difference = date2-date1
          var onemouths = 30*24*60*60*1000
          var oneday = 24*60*60*1000
          var onehour = 60*60*1000
          var onemiutes = 60*1000
          if (Difference < oneday){
            if (Difference<onehour){
              for(var i=1;i<=60;i++){
                if (Difference <= i * onemiutes){
                   val.times = i+"分钟前"
                   break
                }
              }
            }else{
              for (var i = 2; i <=24; i++) {
                if (Difference < i * onehour) {
                  val.times = i + "小时前"
                  break
                }
              }
            }

          }else if (Difference < onemouths){
            for (let i = 2; i <= 30; i++) {
              if (Difference < i * oneday) {
                val.times = i + "天前"
                break
              }
            }
          }else{
            val.times = date.getFullYear() + '/' + this.addzero((date.getMonth() + 1)) + '/' + this.addzero(date.getDate()) + " " + this.addzero(date.getHours()) + ":" + this.addzero(date.getMinutes()) + ":" + this.addzero(date.getSeconds())
          }
          this.data.video.array.splice(index,0,val)

          this.setData({
            video: this.data.video
          })
      })
  },
  addzero(str) {
    if (str < 10) {
      return "0" + str
    } else {
      return str
    }
  }, 
  getallvideo(){
      this.damand('/moments?count=3&last=' + this.data.video.id, "GET", "", (info) => {
        var info = info.data.data
        if (info.length) {
          var len = info.length
          this.data.video.id = info[len - 1].id
          for (let i = 0; i < info.length; i++) {
            this.times(info[i], i)
          }
        } else {
          setTimeout(function () {
            Icons.Toast("没有数据了哦", 'none')
          }, 400)
        }
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
    setTimeout(() => {
      this.setData({
        video: {
          id: "",
          array: []
        }
      })
      var promise = new Promise(function (resolve) {
        resolve(42);
      });
      promise.then(this.getallvideo())
      wx.stopPullDownRefresh()
    }, 500)
  },
  upshow(){
    var promise = new Promise(function (resolve) {
      resolve(42);
    });
    promise.then(this.getallvideo())
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:function () {
    var promise = new Promise(function (resolve) {
      resolve(42);
    });
    promise.then(this.getallvideo())
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