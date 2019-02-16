// pages/state/Release/Release.js
const VodUploader = require('../../../utils/vod-web-sdk-v5.js');
const damand = require('../../../utils/request.js')
var uploadFn = require('../../../utils/upload.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordslen:0,
    imgArray: [],
    videosrc:'',
    videoinfo:"",
    types:"photo",
    conindex: 0,
    conArray: ['美国', '中国', '巴西', '日本'],
    textareaValue:""

  },
  damand: damand,
  // bindPickerChange: function (e) {
  //   this.setData({
  //     conindex: e.detail.value
  //   })
  // },
  bindWordLimit(e){
    var value = e.detail.value, len = parseInt(value.length);
    this.setData({
      wordslen: len,
      textareaValue:value
    }) 
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
      if(options.types=="photo"){
        this.data.imgArray.push(options.src)
        this.setData({
          imgArray: this.data.imgArray,
          types: options.types
        }) 
      }else{
        var video = JSON.parse(options.src)
        this.setData({
          videosrc:video,
          types: options.types
        }) 
      }
  },
  remove(res){
    var index = res.currentTarget.dataset.index
    this.data.imgArray.splice(index,1)
    this.setData({
      imgArray: this.data.imgArray
    }) 
  },
  addImg(){
      wx.chooseImage({
        count:1,
        success: (res)=> {
          var info = res.tempFiles[0].path
          this.data.imgArray.push(info)
          this.setData({
              imgArray:this.data.imgArray
          })
        }
      })
  },
  sendDynamics(){
    if (this.data.types == "photo"){  //如果是图片发布
      var len = this.data.imgArray.length
      if (len && this.data.wordslen){   //判断有没有图片进行上传
          this.getimgto(() => {
            this.damand("/moments","POST", {
              'title': this.data.textareaValue,
              'urls': this.data.imgArray,
              'type': this.data.types
            }, (info) => {
              wx.hideLoading()
              wx.navigateBack({
                delta: 1,
                success(){
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
              
            })
          })
        
      }else{
        wx.showToast({
          title: '图片和文字都要上传哦',
          icon: 'none',
          duration: 2000
        })
      }
    }else{                        //如果是视频发布
      this.upvideo((res)=>{
        var video = []
        video.push(this.data.videosrc)
        this.damand("/moments", "POST", {
          'title': this.data.textareaValue,
          'urls': video,
          'type':this.data.types,
          'fileId':res
        }, (info) => {
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        })
      })
    } 
  },
  getSignature: function (callback) {
    wx.showLoading({
      title: '提交中',
    })
    this.damand('/moments/authorization', "GET", "", (res) => {
      if (res.data && res.data.data.authorization) {
        callback(res.data.data.authorization);
      } else {
        return '获取签名失败';
      }
    })
  },
  upvideo(fn){
    var filePath = this.data.videosrc;
    var that = this
    VodUploader.start({
      videoFile: filePath, //必填，把chooseVideo回调的参数(file)传进来
      getSignature: this.getSignature, //必填，获取签名的函数
      finish: (result)=> {
        console.log('finish');
        console.log(result);
        that.setData({
          videosrc: result.videoUrl
        })
        console.log(that.data.videosrc)
        fn(result.fileId)
      }
      
      
    })
    
  },
  getimgto(fn) {  //得到图片
    wx.showLoading({
      title: '提交中',
    })
    var len = this.data.imgArray.length
    var op = 0
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        this.uploads(this.data.imgArray[i], (res) => {
          console.log(i)
          this.data.imgArray[i] = JSON.parse(res.data).data.source_url
          this.setData({
            imgArray: this.data.imgArray
          })
          op++
          if (op == len) {
            console.log(this.data.imgArray)
            fn()
          }
        })
      }
    }

  },
  uploads: function (path, fn) {
    var that = this
    var lock = ''
    // 选择上传的图片
    // 获取文件路径
    var filePath = path;
    wx.login({
      success: function (res) {
        var fcode = res.code
        wx.getUserInfo({
          withCredentials: true,
          success: (res) => {
            wx.request({
              url: 'https://wxaapi.cicadafitness.net/users/login?code=' + fcode + '&encryptedData=' + encodeURIComponent(res.encryptedData) + "&iv=" + encodeURIComponent(res.iv), //仅为示例，并非真实的接口地址
              success: function (res) {
                lock = res.data.data.token
                var time = res.data.data.expires
                uploadFn(filePath, lock, 'moments', fn, 1257000451, "moments")
              },

            })
          }
        })
        
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