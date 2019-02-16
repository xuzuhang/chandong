var http = 'https://wxaapi.cicadafitness.net'
function damand(url, method, data, callback,tit) {
    var that = this
    master(url, method, data, callback, tit,that)
}
function master(url, method, data, callback, tit,that){
  if (tit) {
    wx.showLoading({
      title: tit,
    })
  } else {
    wx.showNavigationBarLoading()
  }
  if (url.indexOf('https://wxaapi.cicadafitness.net') !== -1) {
    url = url.replace('https://wxaapi.cicadafitness.net', "")
  }
  wx.getStorage({
    key: 'retime',
    success: function (res) {
      var lock = res.data.damand
      if (lock == "") {
        var header = {
          'content-type': 'application/json'
        }
      } else {
        var header = {
          'content-type': 'application/json',
          'authorization': lock // 默认值
        }
      }
      wx.request({
        url: http + url,
        header,
        data: data,
        method: method,
        success: (info)=> {
          
          var code = info.data.code
          var status = Math.floor(info.statusCode / 100)
          if (status === 5){
            wx.reLaunch({
              url: '../../error/error/error?type=500'
            })
          }else{
            if (code === 401) {
              wx.login({
                success: (res) => {
                  var fcode = res.code
                  wx.getUserInfo({
                    withCredentials: true,
                    success: (res) => {
                      wx.request({
                        url: http + '/users/login?code=' + fcode + '&encryptedData=' + encodeURIComponent(res.encryptedData) + "&iv=" + encodeURIComponent(res.iv),
                        method: "GET",
                        success: (res) => {
                          var scode = res.data.data.token
                          wx.setStorage({
                            key: "retime",
                            data: {
                              damand: scode,
                              user: res.data.data.userId
                            }
                          })
                          that.damand(http + url, method, data, callback)
                        },
                        fail(res) {
                          console.log(res)
                        }
                      })
                    }
                  })
                }
              })
            } else {
              var infos = info.data
              if (infos.code === 0) {
                callback(info)
              } else {
                // callback(info)
                setTimeout(() => {
                  wx.showToast({
                    title: infos.message,
                    icon: 'none',
                    duration: 2000
                  })
                }, 400)
              }
              return
            }
          }
          
        },
        fail(res) {
          wx.reLaunch({
            url: '../../error/error/error?type=time'
          })
        },
        complete() {
          wx.hideNavigationBarLoading()
          if (tit) {
            wx.hideLoading()
          }
        }
      })

    },
    fail(res) {
      wx.login({
        success: (res) => {
          var fcode = res.code
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              wx.request({
                url: http + '/users/login?code=' + fcode + '&encryptedData=' + encodeURIComponent(res.encryptedData) + "&iv=" + encodeURIComponent(res.iv),
                method: "GET",
                success: (res) => {
                  var scode = res.data.data.token
                  wx.setStorage({
                    key: "retime",
                    data: {
                      damand: scode,
                      user: res.data.data.userId
                    }
                  })
                  that.damand(http + url, method, data, callback)
                },
                fail(res) {
                  console.log(res)
                }
              })
            }
          })
        }
      })
    }
  })
}
module.exports = damand
