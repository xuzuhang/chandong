// pages/my/feedback/feedback.js
const damand = require('../../../utils/request.js')
var uploadFn = require('../../../utils/upload.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexs:0,
    tabArray: ['小程序', '门店', '服务', '活动', '私教', '器械', '优惠券', '其他'],
    imgArray:[],
    upImg:[],
    textarea:''
  },
  damand: damand,
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  text(res){
    var res = res.detail.value
    this.setData({
      textarea:res
    })
  },
  tabcg(res){
    var index = res.currentTarget.dataset.index
      this.setData({
        indexs:index
      })
  },
  toProcessing(){
      wx.navigateTo({
        url: '../Processing/Processing',
      })
  },
  remove(res) {
    var index = res.currentTarget.dataset.index
    this.data.imgArray.splice(index, 1)
    this.setData({
      imgArray: this.data.imgArray
    })
  },
  addImg() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        var info = res.tempFiles[0].path
        this.data.imgArray.push(info)
        this.setData({
          imgArray: this.data.imgArray
        })
      }
    })
  },
  tofeedback(){  //点击提交反馈
    if (this.data.textarea){
      if (this.data.imgArray.length==0){
        this.damand("/complaints", "POST", {
          'type': this.data.tabArray[this.data.indexs],
          'description': this.data.textarea,
          'photos': this.data.imgArray
        }, (info) => {
          wx.navigateBack({
            delta: 1,
            success() {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        },"提交中")
      }else{
        this.getimgto(() => {
          this.damand("/complaints", "POST", {
            'type': this.data.tabArray[this.data.indexs],
            'description': this.data.textarea,
            'photos': this.data.imgArray
          }, (info) => {
            
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
            
            }, "提交中")
        })
      }
      
    }else{
      wx.showToast({
        title: '问题或建议不能为空哦',
        icon: 'none',
        duration: 2000
      })
    }
    
  }, 
  getimgto(fn){  //得到图片
    wx.showLoading({
      title: '提交中',
    })
    var len = this.data.imgArray.length
    var  op = 0
    if (len > 0) {
      for(let i =0;i<len;i++){
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
  uploads:function (path,fn) {
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
                    uploadFn(filePath, lock, 'complaints', fn, 1257000451, "complaints")
                  }
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