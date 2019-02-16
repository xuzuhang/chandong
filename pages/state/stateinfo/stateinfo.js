// pages/state/stateinfo/stateinfo.js
const damand = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data:{
      imgs:[],
      id:"",
      video:"",
      user: {
        avatarUrl:"",
        name:"",
        tit: ""
      },
      userId:"sss",
      imgSize:[],
      option:""
  },
  damand:damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    this.init()
    this.setData({
      option: options.id
    })
    if (options.type=="video"){
      this.damand("/moments/" + options.id,"GET","",(info)=>{
        var info = info.data.data
        this.setData({
          video:info.urls[0],
          id: info.userId,
          user:{
            avatarUrl: info.avatarUrl,
            name: info.nickName,
            tit:info.title
          }
        })
      })
    }else{
      this.damand("/moments/" + options.id, "GET", "", (info) => {
        var info = info.data.data
        for (var i = 0; i < info.urls.length; i++) {
          this.data.imgs.splice(i, 0, { url: info.urls[i], width: 0, height:0})
        }
        this.setData({
          imgs: this.data.imgs,
          id:info.userId,
          user: {
            avatarUrl: info.avatarUrl,
            name: info.nickName,
            tit: info.title
          }
        })
  
      })
    }
  },
  share(e){
    var e = e.currentTarget.dataset.img

      console.log(e)
    console.log(this.data.imgs)
    var arr = this.data.imgs.map((val)=>{
        return val.url
    })
    wx.previewImage({
      current: e, // 当前显示图片的http链接
      urls: arr,// 需要预览的图片http链接列表
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  remove(){
    wx.showModal({
      content: '确定删除吗',
      success:  (res)=> {
        if (res.confirm) {
          this.damand("/moments/" + this.data.option, "DELETE", "", (info) => {
                wx.navigateBack({
                  delta:1,
                  success(){
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                })
          })
        }
      }
    })
    
  },
  init(){
    wx.getStorage({
      key: "retime",
      success:(res) => {
        var res = res.data.user
        this.setData({
          userId: res
        })
      }
    })
  },
  imgStyles(e) {
    console.log(e)
    var index = e.currentTarget.dataset.in
    var w = e.detail.width
    var h = e.detail.height
     w = 225*w/h 
     h = 225
    this.data.imgs[index].width = w+"px"
    this.data.imgs[index].height = h+"px"
    this.setData({
      imgs: this.data.imgs
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