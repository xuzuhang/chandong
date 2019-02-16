// pages/my/certficates/certficates.js
const damand = require('../../../utils/request.js')
var uploadFn = require('../../../utils/upload.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:1,
    cardId:1,
    scroll:"",
    stit:'上传身份证照片',
    time:'2018年7月',
    autograImg: '',   // 签名页图片
    facadeid:'' ,      //身份证正面照片   
    identityid:'',      //身份证反面照片
    passportImg:'',    //护照照片
    price:'',
    text: '' ,
    passid:'',
    passname: "",
    referrerId: "",
    idcards:{
      'id':"",//身份证号码
      'name':"",//姓名
      'sex':"",//性别
      'nation':"",//民族
      'birth':"",//生日
      'address':"",//地址
      'authority':"",//发证机关
      'validDate':"",//有效期
      'frontUrl':"",//正面照片的url
      'backUrl':""//反面照片的url
    }
  },
  damand: damand,
  tab: function (res) {      //tab切换逻辑
    var index = res.currentTarget.dataset.index
    if(index==1){
      this.setData({
        stit: '上传身份证照片'
      })
    }else{
      this.setData({
        stit: '上传护照身份页照片'
      })
    }
    this.setData({
      index: index
    })
  },
  toautoraph:function(){   //去签名页
      wx.navigateTo({
        url: '../autograph/autograph',
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.gettext()
      this.gettimes()
      this.getReferrerId()
      this.setData({
        price:options.price,
        cardId:options.ids
      })
      wx.setStorage({
        key: 'autograph',
        data: '',
      })
  },
  getReferrerId(){
    wx.getStorage({
      key: 'Whatfor',
      success:(res)=> {
        this.setData({
          referrerId: res.data.Referee
        })
      },
    })
  },
  gettext() {
    wx.request({
      url: 'https://static-1257000451.cos.ap-shanghai.myqcloud.com/agreements/register.txt',
      method: "GET",
      success: (info) => {
        this.setData({
          text: info.data
        })
      }
    })

  },
  gettimes(){  //得到时间
    var date = new Date();   //获得时间
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    this.data.time = year + '年' + mouth + '月' + day + '日'
    this.setData({
      time: this.data.time
    })
  },
  FacadeID:function(){   //点击身份证正面的事件
    this.uploads((info,cos) => {
                  var data = "https://idcards-1257000451.cos.ap-shanghai.myqcloud.com/" + cos   
                   this.setData({
                     facadeid:data
                   })
                   this.damand('/ocr/authorization?type=idcards', 'GET', '', (info) => {   //身份证认证
                     wx.request({
                       url: 'https://recognition.image.myqcloud.com/ocr/idcard',
                       method: 'POST',
                       data: {
                         appid: info.data.data.appid,
                         url_list: [data],
                         card_type:0
                       },
                       header: {
                         // 'host':'recognition.image.myqcloud.com',
                         'content-type': 'application/json ',
                         'authorization': info.data.data.authorization
                       },
                       success: (res) => {
                         var data = res.data.result_list[0].code
                         var datas = res.data.result_list[0].data
                         if(!data==0){
                           this.setData({
                             facadeid:''
                           })
                           wx.showToast({
                             title: '证件识别失败请重新上传',
                             icon: 'none',
                             duration: 2000
                           })
                         }else{
                           wx.showToast({
                             title: '证件识别成功',
                             icon: 'success',
                             duration: 2000
                           })

                           this.data.idcards.id = datas.id
                           this.data.idcards.name = datas.name
                           this.data.idcards.sex = datas.sex
                           this.data.idcards.nation = datas.nation
                           this.data.idcards.birth = datas.birth
                           this.data.idcards.frontUrl = this.data.facadeid
                           this.data.idcards.address = datas.address
                         }
                       }
                     })
                   })
                 })

  },
  IdentityId:function(){   //点击身份证反面的事件
    this.uploads((info,cos) => {
                   
                    var data = "https://idcards-1257000451.cos.ap-shanghai.myqcloud.com/" + cos
                   this.setData({
                     identityid:data
                   })



                   this.damand('/ocr/authorization?type=idcards', 'GET', '', (info) => {   //身份证认证
                     console.log(info.data.data.appid)
                     wx.request({
                       url: 'https://recognition.image.myqcloud.com/ocr/idcard',
                       method: 'POST',
                       data: {
                         appid:info.data.data.appid,
                         url_list: [data],
                         card_type: 1
                       },
                       header: {
                         // 'host':'recognition.image.myqcloud.com',
                         'content-type': 'application/json ',
                         'authorization': info.data.data.authorization
                       },
                       success: (res) => {
                         var data = res.data.result_list[0].code
                         var datas = res.data.result_list[0].data
                         if (!data == 0 || !datas.authority) {
                           this.setData({
                             identityid: ''
                           })
                           wx.showToast({
                             title: '证件识别失败请重新上传',
                             icon: 'none',
                             duration: 2000
                           })
                         } else {
                           wx.showToast({
                             title: '证件识别成功',
                             icon: 'success',
                             duration: 2000
                           })
                           this.data.idcards.authority = datas.authority
                           this.data.idcards.validDate = datas.valid_date
                           this.data.idcards.backUrl = this.data.identityid
                         }
                       }
                     })
                   })
                   
                 })

  },
  Cpassport(){             //点击护照事件
        this.uppass((info,cos) => {
          var data = "https://passports-1257000451.cos.ap-shanghai.myqcloud.com/" + cos
          this.setData({
            passportImg: data
          })
        })
  },
  uploads:function(fn){
    var that = this
    var lock = ''
    // 选择上传的图片
    wx.chooseImage({
      count:1,
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 获取文件路径
        var filePath = res.tempFilePaths[0];
        // 文件上传cos
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
                    uploadFn(filePath, lock, 'idcards', (info, cos) => {
                      fn(info, cos)
                    }, 1257000451, "idcards")
                  }
                })
              }
            })
           
          }
        })
      }
    })
  },
  uppass:function(fn){
    var that = this
    var lock = ''
    // 选择上传的图片
    wx.chooseImage({
      count:1,
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 获取文件路径
        var filePath = res.tempFilePaths[0];
        // 文件上传cos
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
                    uploadFn(filePath, lock, 'passports', (info, cos) => {
                      fn(info, cos)
                    }, 1257000451, "passports")

                  }
                })
              }
            })
           
          }
        })
      }
    })
  },
  passid:function(val){
      var val = val.detail.value
      this.setData({
        passid:val
      })
  },
  passname:function(val){
      var val = val.detail.value
      this.setData({
        passname:val
      })
  },
  sure:function(){      //确认购买
    if(this.data.index==1){
      switch(''){
        case this.data.scroll:
          wx.showToast({
            title: '请阅读完成会员协议',
            icon: 'none',
            duration: 2000
          })
          break;
        case this.data.facadeid:
          wx.showToast({
            title: '请上传身份证正面',
            icon: 'none',
            duration: 2000
          })
        break;
        case this.data.identityid:
          wx.showToast({
            title: '请上传身份证反面',
            icon: 'none',
            duration: 2000
          })
        break;
        case this.data.autograImg:
          wx.showToast({
            title: '请签上自己名字',
            icon: 'none',
            duration: 2000
          })
        break;
        default:
        this.damand('/idcards', "PUT", this.data.idcards, (info) => {
          console.log(info)
          this.damand('/cards/orders', "POST",
            {
              'cardId': this.data.cardId,
              'signatureUrl': this.data.autograImg,
              'referrerId':this.data.referrerId
            }
            , (info) => {
              var info = info.data.data
              var infostr = JSON.stringify(info)
              if (info.status == 2) {
                wx.navigateTo({
                  url: '../orderDetails/orderDetails?order=' + infostr
                })
              } else {
                wx.navigateTo({
                  url: '../pay/pay?order=' + infostr
                })
              }
            })
        })
        
      }
    }else{
      switch ('') {
        case this.data.scroll:
          wx.showToast({
            title: '请阅读完成会员协议',
            icon: 'none',
            duration: 2000
          })
          break;
        case this.data.passportImg:
          wx.showToast({
            title: '请上传护照照片',
            icon: 'none',
            duration: 2000
          })
          break;
        case this.data.passname:
          wx.showToast({
            title: '请填写真实姓名',
            icon: 'none',
            duration: 2000
          })
          break;
        case this.data.passid:
          wx.showToast({
            title: '请填写护照识别号',
            icon: 'none',
            duration: 2000
          })
          break;
        case this.data.autograImg:
          wx.showToast({
            title: '请签上自己名字',
            icon: 'none',
            duration: 2000
          })
          break;
        default:
          this.damand('/passports', "PUT", {
            'id':this.data.passid,
            'name': this.data.passname,
            'url': this.data.passportImg
          }, (info) => {
          })
          this.damand('/cards/orders', "POST",
            {
              'cardId': this.data.cardId,
              'signatureUrl': this.data.autograImg
            }
            , (info) => {
              var info = info.data.data
              var infostr = JSON.stringify(info)
              if (info.status == 2) {
                wx.navigateTo({
                  url: '../orderDetails/orderDetails?order=' + infostr
                })
              } else {
                wx.navigateTo({
                  url: '../pay/pay?order=' + infostr
                })
              }
            })
      }
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
        wx.getStorage({
          key: 'autograph',
          success:(res)=>{
            this.setData({
              autograImg: res.data
            })
          },
        })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key: 'autograph',
      data: '',
    })
  },
  scroll(e){
    console.log(e.detail.scrollHeight)
    console.log(e.detail.scrollTop)
    if (e.detail.scrollHeight <= e.detail.scrollTop+190){
        this.setData({
          scroll:1
        })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
        wx.setStorage({
          key: 'autograph',
          data: '',
        })
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