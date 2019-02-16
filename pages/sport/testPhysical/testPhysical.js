// pages/sport/testPhysical/testPhysical.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    BMI: {
      thisweek: {
        value: "--",
        text: "--"
      },
      lastweek: {
        value: "--",
        text: "--"
      }
    },
    ids:"",
    sptimeArray: [],
    pici: 0,
    cweek:0,
    oweek:0,
    tweek:0,
    weekArray: [{
      date:"5.17",
      day:"周一"
    }, {
      date: "5.17",
      day: "周二"
      }, {
        date: "5.17",
        day: "周三"
      }, {
        date: "5.17",
        day: "周四"
      }, {
        date: "5.17",
        day: "周五"
      }, {
        date: "5.17",
        day: "周六"
      }, {
        date: "5.17",
        day: "周日"
      }],
      day:0,
      ListArray:[],
    WdateArray: ["5.17", "5.17", "5.17", "5.17", "5.17", "5.17", "5.17"]
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTimestamp() //获得时间戳
    this.getallweek()  //获得下拉时间
    this.geteveryDate(this.data.cweek)  //获得每天时间
    this.getinfos(this.data.cweek) //得到每天的运动时间数值
    this.gettoday() //得到今天的值
  },
  gettoday() {
    var bmif = this.getday(new Date(this.data.cweek)).join("-")
    var bmio = this.getday(new Date(this.data.oweek)).join("-")
    this.BMI(bmif, bmio)
  },
  BMI(today, prvday) {  //得到bmi并比较
    this.damand('/fitness/bmi/average?startAt=' + today + '&days=7', "GET", "", (info) => {
      var info = info.data
      if (info.data) {
        this.data.BMI.thisweek.text = info.data.toFixed(1)
        this.data.BMI.thisweek.value = info.data
      } else {
        this.data.BMI.thisweek.text = "--"
        this.data.BMI.thisweek.value = 0
      }
      this.setData({
        BMI: this.data.BMI
      })
    })
    this.damand('/fitness/bmi/average?startAt=' + prvday + '&days=7', "GET", "", (info) => {
      var info = info.data
      if (info.data) {
        this.data.BMI.lastweek.text = info.data.toFixed(1)
        this.data.BMI.lastweek.value = info.data
      } else {
        this.data.BMI.lastweek.text = "--"
        this.data.BMI.lastweek.value = 0
      }
      this.setData({
        BMI: this.data.BMI
      })
    })
  },
  getones(){  //获得第一次请求的数据
    this.damand("/fitness/weigh?count=5&lastId=" + this.data.ids, "GET", "", (info) => {
      var info = info.data.data
      var len = info.length
      for (var i = 0; i < len; i++) {
        var datess = new Date(info[i].createTime)
        info[i].year = datess.getFullYear()
        info[i].mouth = datess.getMonth() + 1
        info[i].day = datess.getDate()
        this.data.ListArray.push(info[i])
      }
      this.setData({
        ListArray: this.data.ListArray
      })
      if (!len == 0) {
        this.data.ids = info[len - 1].id
        this.setData({
          ids: this.data.ids
        })
      }
    })
  },
  getallweek() {
    var opick = this.getweek(this.data.oweek)
    var tpick = this.getweek(this.data.tweek)
    var cpick = this.getweek(this.data.cweek)
    this.setData({
      sptimeArray: [cpick, opick, tpick]
    })
  },
  Supertime(fn) {  //算出多少多余的时间
    var h = 1
    this.damand('/shops/current', "GET", "", (info) => {
      var info = info.data
      if (info.data) {
        var odate = new Date(info.data.time).getTime()
        this.damand('/time', "GET", "", (info) => {
          var ndate = new Date(info.data.data).getTime()
          h = (ndate - odate) / 1000
          fn(h)
        })
      }
    })
  },
  getinfos(times) {      //得到每天的运动时间数值
    var date = new Date(times)
    var start = this.getday(date).join("-")
    this.damand('/shops/exercisehours/stat?startAt=' + start + '&days=7', "GET", "", (info) => {
      var infos = info.data.data
      console.log(infos)
      this.data.weekArray.forEach((val, index) => {
        if (infos[index].duration == 0) {
          console.log(val)
          val.pro = "2%"
          this.data.weekArray[index].duration = 0
        } else {
          this.data.weekArray[index].duration = infos[index].duration
        }
        if (this.data.pici == 0 && this.data.day == index) {
          this.Supertime((h) => {
            console.log(infos)
            this.data.weekArray[index].duration = infos[index].duration + h
            console.log(h)
            this.setData({
              weekArray: this.data.weekArray
            })
            console.log(this.data.weekArray)
            this.getpros()
          })
        }
      })
      this.setData({
        weekArray: this.data.weekArray
      })
      this.getpros()

    })
  },
  getpros() {   //得到百分比
    var len = this.data.weekArray.length
    var max = 0
    for (var i = 0; i < len; i++) {
      if (this.data.weekArray[i].duration >= max) {
        max = this.data.weekArray[i].duration
      }
    }
    for (var j = 0; j < len; j++) {

      if (this.data.weekArray[j].duration == 0) {
        this.data.weekArray[j].pro = '10%'
      } else {
        this.data.weekArray[j].pro = this.data.weekArray[j].duration / max * 90 + 10 + "%"
      }
    }
    this.setData({
      weekArray: this.data.weekArray
    })
  },
  getTimestamp() {
    var date = new Date()
    var day = date.getDay()
    this.data.cweek = new Date().getTime() - (day - 1) * 24 * 60 * 60 * 1000    //获得本周第一天的时间戳
    this.data.oweek = this.data.cweek - 7 * 24 * 60 * 60 * 1000       //获得上个星期第一天的时间戳
    this.data.tweek = this.data.cweek - 14 * 24 * 60 * 60 * 1000      //获得上上个星期的时间戳
    this.setData({
      cwwek: this.data.cweek,
      oweek: this.data.oweek,
      tweek: this.data.tweek,
      day: day - 1
    })
  },
  geteveryDate (times) {
      var onetime = 24*60*60*1000
      var date
      for(var i = 0;i<7;i++){ 
         date = new Date(times + i * onetime)
        var arr = this.getday(date)
        arr.shift()
        var arrs = arr.join(".")
       this.data.weekArray[i].date = arrs
      }
      this.setData({
        weekArray: this.data.weekArray
      })
  },
  getweek(times) {
    var otimes = new Date(times)
    var fd = this.getday(otimes).join(".")
    var ntimes = new Date(times + 6 * 24 * 60 * 60 * 1000)
    var ld = this.getday(ntimes).join(".")
    return fd + "~" + ld
  },
  getday(date) {
    var year = date.getFullYear()
    var mouth = date.getMonth() + 1
    var day = date.getDate()
    return [year, mouth, day]
  },
  bindPickerChange: function (e) {   //当下拉发生改变的时候
    switch (e.detail.value) {
      case '0':
        this.geteveryDate(this.data.cweek)
        this.getinfos(this.data.cweek)
        break;
      case '1':
        this.geteveryDate(this.data.oweek)
        this.getinfos(this.data.oweek)
        break;
      case '2':
        this.geteveryDate(this.data.tweek)
        this.getinfos(this.data.tweek)
        break;
    }
    this.setData({
      pici: e.detail.value
    })
  },
  toresult(res){  //去详情页
      console.log(res)
      var index = res.currentTarget.dataset.ind
      var infos = this.data.ListArray[index]
      infos = JSON.stringify(infos)
      wx.navigateTo({
        url: '../Result/Result?info=' + infos
      })

  },
  tobodyHeath(){   //去蓝牙页面
  var that = this
    this.damand("/shops/current","GET","",(info)=>{   //判断在没在店里
        var info = info.data
        
        if(info.data){
          var id = info.data.id
          this.damand("/shops/facilities/"+id,"GET","",(info)=>{   //判断有没有体脂仪
              var infos = info.data.data
              var len = infos.length
              var num = 0
              for(var i =0;i<len;i++){
                num++
                if(infos[i].typeId=='16'){
                  this.damand("/shops/use/" + infos[i].id,"GET","",(info)=>{  //判断体脂仪有没有人在使用
                
                        wx.openBluetoothAdapter({
                          success: function (res) {
                            wx.closeBluetoothAdapter({
                              success: function (res) {
                                wx.navigateTo({
                                  url: '../bodyHeath/bodyHeath',
                                })
                              }
                            })
                          },
                          fail(res){
                            setTimeout(function(){
                              Icons.Toast('请开启蓝牙设备', 'none')
                            },400)
                          }
                        })
                  })
                  num--
                }
              }
             if(num==len){
               setTimeout(function () {
                 Icons.Toast('本店没有体脂仪', 'none')
               }, 400)
             }
          })
        }else{
          setTimeout(function () {
            Icons.Toast('您不在店里哦', 'none')
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
    this.getTimestamp() //获得时间戳
    this.getallweek()  //获得下拉时间
    this.geteveryDate(this.data.cweek)  //获得每天时间
    this.getones() //获得第一次请求的数据
    this.getinfos(this.data.cweek) //得到每天的运动时间数值
    this.gettoday() //得到今天的值
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
  onPullDownRefresh:function () {
    
  },
  scrolls:function(e){
    this.damand("/fitness/weigh?count=5&lastId=" + this.data.ids, "GET", "", (info) => {
      var info = info.data.data
      var len = info.length
      console.log(info)
      for (var i = 0; i < len; i++) {
        var datess = new Date(info[i].createTime)
        info[i].year = datess.getFullYear()
        info[i].mouth = datess.getMonth() + 1
        info[i].day = datess.getDate()
        this.data.ListArray.push(info[i])
      }
      this.setData({
        ListArray: this.data.ListArray
      })
      console.log(this.data.ListArray)
      if (!len == 0) {
        this.data.ids = info[len - 1].id
        this.setData({
          ids: this.data.ids
        })
      }
    })
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