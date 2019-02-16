// pages/login1/login1.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    msg:'',
    time:60,
    codemsg:"发送验证码",
    btncolor:'#36374c',
    buttondis: true,
    code:'',
    returncode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  code:function(res){    //当输入验证码失去焦点时记录验证码的值
      this.setData({
        code: res.detail.value
      })
    
  },
  next:function(res){     //点击下一步时触发的事件
    this.damand('/users/mobile', 'PUT', {  //发送给服务端验证验证码和手机是否正确
      'mobile': this.data.phone,
      'verifyCode': this.data.code
    }, (info) => {
      if (info.data.code) {      
      } else {
        wx.redirectTo({
          url: '../login2/login2',   //如果没问题则跳转到第二页进行注册
        }) 
      }
    }) 
                
  },
  damand:damand,
  send:function(){   //当点击验证码发送的按钮
        clearInterval(this.times)
        this.damand('/verifycodes?mobile=' + this.data.phone, 'GET', '', (info) => {  //发送验证码的接口
        var info = info.data
              if(info.code==0){
                this.setData({       //得到后端给的随机码
                  returncode: info.data
                })
                this.times = setInterval(() => {   //设置定时器让60s后才能再次触发事件
                  this.setData({
                    time: this.data.time - 1,
                    codemsg: this.data.time + "后重新发送",
                    buttondis: true,
                    btncolor: '##36374c'
                  })
                  console.log(this.data.time)
                  if (this.data.time == -1) {
                    this.setData({
                      time: 60,
                      codemsg: "发送验证码",
                      buttondis: false,
                      btncolor: '#fca903'
                    })
                    clearInterval(this.times)
                  }

                }, 1000)
              }else{
                wx.showToast({
                  title: info.message,
                  icon: 'none',
                  duration: 2000
                })
              }
        })
         
   
  },
  onLoad: function (options) {
    
  },
  yanzheng:function(res){      //输入时验证手机号
      var num =  res.detail.value;
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/  //必须为11位的手机数字结构
      if(reg.test(num)){
        this.setData({              //成功则按钮可按  
          phone: res.detail.value, 
          buttondis: false,
          btncolor: '#fca903'
        })
      }else{
        this.setData({
          buttondis: true,
          btncolor: '#36374c'
        })
      }
  },
  prompt:function(res){
    var num = res.detail.value;
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/  //失去焦点验证手机结构是否正确
    if (!reg.test(num)){
      Icons.Toast('请输入正确手机号码', 'none')
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