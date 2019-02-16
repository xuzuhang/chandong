var uploadFn = require('../../../utils/upload.js')
const damand = require('../../../utils/request.js')
Page({
  data: {
    pen: 3, //画笔粗细默认值
    color: '#1c1c1e',//画笔颜色默认值
    savelock:true
  },
  damand: damand,
  arrs: [],
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存Y坐标轴变量
  //手指触摸动作开始
  touchStart: function (e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    this.context = wx.createContext()


    this.context.setStrokeStyle(this.data.color)
    this.context.setLineWidth(this.data.pen)
    this.context.setLineCap('round') // 让线条圆润 
    this.context.beginPath()
  },
  //手指触摸后移动
  touchMove: function (e) {

    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y


    this.context.moveTo(this.startX, this.startY)
    this.context.lineTo(startX1, startY1)
    this.context.stroke()
    var objg = {
      x: startX1,
      y: startY1
    }
    this.arrs.push(objg)
    this.startX = startX1;
    this.startY = startY1;
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
  },
  detele: function () {
    this.context.clearRect(0, 0, 750, 750)
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            console.log(res.userInfo.avatarUrl)
          }
        })
      }
    })
  },
  save: function () {
    if (this.data.savelock){
      this.setData({
        savelock:false
      })
      wx.showLoading({
        title: '保存中',
      })
      var that = this
      var canvas = wx.createCanvasContext("myCanvas")

      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: (res) => {
          var filePath = res.tempFilePath;
          var that = this
          var lock = ''
          wx.login({
            success: function (res) {
              var fcode = res.code
              wx.getUserInfo({
                withCredentials: true,
                success: (res) => {
                  wx.request({
                    url: 'https://wxaapi.cicadafitness.net/users/login?code=' +fcode+ '&encryptedData=' + encodeURIComponent(res.encryptedData)+"&iv="+ encodeURIComponent(res.iv), //仅为示例，并非真实的接口地址
                    success: function (res) {
                     var lock = res.data.data.token
                    
                      uploadFn(filePath, lock, 'signatures', (info, cos) => {
                        var data = JSON.parse(info.data).data.resource_path
                        data = "https://signatures-1257000451.cos.ap-shanghai.myqcloud.com/" + cos
                        wx.setStorage({
                          key: 'autograph',
                          data: data,
                        })
                        wx.navigateBack({
                          delta: 1,
                          success() {
                            wx.hideLoading()
                          }
                        })
                      }, 1257000451, "signatures")

                    }
                  })
                }
              })
              
            }
          })

        }
      })
    }
    
  },
  //手指触摸动作结束
  touchEnd: function () {

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    return {
      title: '蝉动健身',
      path: '/pages/common/enterImg/enterImg',
      imageUrl: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/advertisements/share.jpg'
    }
  }
})