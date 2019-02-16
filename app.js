App({
  onLaunch: function () {
    wx.getSystemInfo({        //得到设备宽分辨率
      success: function (res) {
        wx.setStorage({
          key: "comwidth",
          data: {
            width: res.windowWidth
          }
        })
      },
    })
   
  },
  
  globalData: {
    
  }
})