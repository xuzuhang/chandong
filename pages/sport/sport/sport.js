// pages/sport/sport.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgpic:"",
    planlist:[],
    alltime:0,
    sport:{
        today:{
          value:0,
          text:0
        },
        prvday: {
          value: 0,
          text: 0
        }
    },
    Supertime:0,
    BMI:{
      thisweek:{
        value:"--",
        text:"--"
      },
      lastweek: {
        value: "--",
        text: "--"
      }
    },
    Planstart:{
      sc: 'scale(0,0)',
      background:'normal',
      wheight:"100%",
      overflow:"visible"
    },
    plansArray:[{
      array:["有氧训练","力量训练"],
      index:0
    }, {
      array: ["跑步机", "两达到","拉伸"],
      id: [],
      index: 0
      }, {
        array: ["10-20分钟", "20-40分钟","40分钟以上"],
        index: 0
      },
      {
        array: [],
        value:[],
        index: 0
      },{
        time:"12:00"
      },{
        array:["10分钟","30分钟","1小时"],
        value:[600,1800,3600],
        index:0
      }],
    indexweek:2,
    sptimeArray: [],
    pici: 0,
    cweek: 0,
    oweek: 0,
    tweek: 0,
    weekArray: [{
      date: "5.17",
      day: "周一",
      pro:"1%"
    }, {
      date: "5.17",
      day: "周二",
      pro: "1%"
    }, {
      date: "5.17",
      day: "周三",
      pro: "1%"
    }, {
      date: "5.17",
      day: "周四",
      pro: "1%"
    }, {
      date: "5.17",
      day: "周五",
      pro: "1%"
    }, {
      date: "5.17",
      day: "周六",
      pro: "1%"
    }, {
      date: "5.17",
      day: "周日",
      pro: "1%"
    }],
    day:1,
    listweek:[
      {
        week:"周三",
        date:"5/24"
      },
      {
        week:"昨天",
        date:"5/24"
      },
      {
        week:"今天",
        date:"5/24"
      },
      {
        week:"明天",
        date:"5/24"
      },
      {
        week:"周六",
        date:"5/24"
      }
    ]
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userinfo()     //获得用户信息
    this.getTimestamp() //获得时间戳
    this.getallweek()     //获得所有时间列
    this.gettoday()    //获得今日运动时间
    this.geteveryDate(this.data.cweek)  //获得每天时间
    this.getlistweek()  //获得我的计划的时间
    this.getinfos(this.data.cweek) //得到每天的运动时间数值
    this.getalltime()  //得到所有时间
    this.Getspecificplans(this.data.listweek[2].value)   //获得训练计划表
  },
  userinfo() {
    this.damand('/users/essential',"GET", "", (info) => {
      var info = info.data.data
      this.setData({
        imgpic: info.avatarUrl
      })
    })
  },
  returncolor(time, star,duration){ //开始年月日 开始小时秒  持续时间
        var date = new Date(time)
        var  arr =star.split(":")
        date.setHours(arr[0])
        date.setMinutes(arr[1])
        var ntime = new Date().getTime() - date.getTime() 
        var difference = duration * 60 * 1000
        if (ntime > 0 && ntime > difference){
          return "#999"
        } else if (0 < ntime && ntime <= difference){
          return "#f57a00"
        } else if (ntime > 0 && ntime > difference){
          return "#000"
        }
  },
  getDevicename(id,fn){  //得到设备名称
    this.damand('/facilities/types/' + id, "GET", "", (info) => {
      var info = info.data.data.name
      fn(info)
    })
  },
  Getspecificplans(time) {  //获得训练计划表
    this.damand("/fitness/plans/"+time,"GET","",(info)=>{
      var infos = info.data.data
      console.log(infos)
      var len = infos.length
      var arrs = []
      if(len>0){
              for (let i = 0; i < len; i++){
                  var obj = {}
                  obj.purpose = infos[i].purpose
                  obj.time = infos[i].time
                  obj.intensity = infos[i].intensity
                  obj.duration = infos[i].duration / 60
                  obj.color = this.returncolor(time, obj.time, obj.duration)
                  arrs.push(obj)
                this.getDevicename(infos[i].facilityType, (name)=>{
                    arrs[i].name = name
                    this.setData({
                      planlist: arrs
                    })
                })
              }
      }else{
        this.setData({
          planlist: arrs
        })
      }
    })
  },
  getalltime(){  //得到运动总时长
    this.damand("/shops/exercisehours/total","GET","",(info)=>{
      var infos = info.data.data
      var time = infos / 3600
      this.data.alltime = time.toFixed(0)
      this.setData({
        alltime: this.data.alltime
      })
      this.Supertime((h) => {
        time = (h + infos)/3600
        this.data.alltime = time.toFixed(0)
        this.setData({
          alltime: this.data.alltime
        })
      })
    })
  },
 Supertime(fn){  //算出多少多余的时间
    var h = 0
    this.damand('/shops/current', "GET", "", (info) => {
        var info = info.data
        if(info.data){
          var odate = new Date(info.data.time).getTime()
          this.damand('/time', "GET", "", (info) => {
            var ndate = new Date(info.data.data).getTime()
            h = (ndate - odate) / 1000
            fn(h)
          })
        }
        
      
    })
  },
  gettoday(){
    var todate = new Date()
    var todtime = new Date().getTime()-24*60*60*1000
    var prvstart = this.getday(new Date(todtime)).join("-")
    var todstart = this.getday(todate).join("-")
    this.sport(todstart, prvstart)
    var bmif = this.getday(new Date(this.data.cweek)).join("-")
    var bmio = this.getday(new Date(this.data.oweek)).join("-")
    this.BMI(bmif, bmio)
  },
  BMI(today, prvday){  //得到bmi并比较
    this.damand('/fitness/bmi/average?startAt=' + today + '&days=7', "GET", "", (info) => {
      var info = info.data
      if(info.data){
        this.data.BMI.thisweek.text = info.data.toFixed(1)
        this.data.BMI.thisweek.value = info.data
      }else{
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
  sport(today,prvday){   //得到运动时间并比较
    this.damand('/shops/exercisehours/stat?startAt=' + today + '&days=1',"GET","",(info)=>{  
      var infos = info
      var info =infos.data.data[0].duration / 3600
      this.data.sport.today.text = info.toFixed(1)
      this.data.sport.today.value = info
      this.setData({
        sport: this.data.sport
      })
      this.Supertime((h)=>{
        info = (infos.data.data[0].duration+h)/3600
        this.data.sport.today.text = info.toFixed(1)
        this.data.sport.today.value = info
        this.setData({
          sport: this.data.sport
        })
      })
    })
    this.damand('/shops/exercisehours/stat?startAt=' + prvday + '&days=1',"GET","",(info)=>{
      var info = info.data.data[0].duration/3600
      this.data.sport.prvday.text = info.toFixed(1)
      this.data.sport.prvday.value = info
         this.setData({
           sport: this.data.sport
         })
    })
  },
  getTimestamp(){
    var date = new Date()
    var day = date.getDay()
    this.data.cweek = new Date().getTime() - (day - 1) * 24 * 60 * 60 * 1000    //获得本周第一天的时间戳
    this.data.oweek = this.data.cweek - 7 * 24 * 60 * 60 * 1000       //获得上个星期第一天的时间戳
    this.data.tweek = this.data.cweek - 14 * 24 * 60 * 60 * 1000      //获得上上个星期的时间戳
    this.setData({
      cwwek:this.data.cweek,
      oweek:this.data.oweek,
      tweek:this.data.tweek,
      day: day - 1
    })
  },
  getallweek(){
    var opick = this.getweek(this.data.oweek)
    var tpick = this.getweek(this.data.tweek)
    var cpick = this.getweek(this.data.cweek)
    this.setData({
      sptimeArray: [cpick, opick, tpick]
    })
  },
  getinfos(times){      //得到每天的运动时间数值
    var date = new Date(times)
    var start = this.getday(date).join("-")
    this.damand('/shops/exercisehours/stat?startAt='+start+'&days=7',"GET","",(info)=>{
      var infos = info.data.data
      console.log(infos)
      this.data.weekArray.forEach((val,index)=>{
        if (infos[index].duration == 0) {
          console.log(val)
          val.pro = "2%"
          this.data.weekArray[index].duration = 0
        } else {
          this.data.weekArray[index].duration = infos[index].duration
        }
        if (this.data.pici == 0 && this.data.day == index){ 
          this.Supertime((h) => {
            this.data.weekArray[index].duration=infos[index].duration + h
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
  getpros(){   //得到百分比
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
        this.data.weekArray[j].pro = this.data.weekArray[j].duration / max * 90 +10+ "%"
      }
    }
    this.setData({
      weekArray: this.data.weekArray
    })
  },
  getplanday(){
      var date
      var times = new Date().getTime()
      var onetime = 24 * 60 * 60 * 1000
      for (var i = 0; i < 7; i++) {
        date = new Date(times + i * onetime)
        var day = this.getweekday(times + i * onetime)
        var arr = this.getday(date)
        var arrs = arr[0]+"年"+arr[1]+"月"+arr[2]+"日"+"("+day+")"
        var value = arr[0]+"-"+arr[1]+"-"+arr[2]
        this.data.plansArray[3].array.push(arrs)
        this.data.plansArray[3].value.push(value)
      }
      this.setData({
        plansArray: this.data.plansArray
      })
  },
  getweek(times){
    var  otimes = new Date(times)
    var fd = this.getday(otimes).join(".")
    var ntimes = new Date(times + 6 * 24 * 60 * 60 * 1000)
    var ld = this.getday(ntimes).join(".")
    return fd+"~"+ld
  },
  geteveryDate(times) {
    var onetime = 24 * 60 * 60 * 1000
    var date
    for (var i=0;i<7; i++) {
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
  getweekday(times){  //按照时间算出今天星期几
      var date = new Date(times)
      var day = date.getDay()
      switch(day){
        case 1:
          return  "周一"
        case 2:
          return  "周二"
        case 3:
          return  "周三"
        case 4:
          return  "周四"
        case 5:
          return  "周五"
        case 6:
          return  "周六"   
        case 0:
          return  "周日"
         
      }
  },
  getlistweek(){         //我的计划列表
    var lday = this.data.cweek - 2 * 24 * 60 * 60 * 1000
    var nday = this.data.cweek + 2 * 24 * 60 * 60 * 1000
    this.data.listweek[0].week = this.getweekday(lday)
    this.data.listweek[4].week = this.getweekday(nday)
    var date = new Date()
    var time = date.getTime()
    var oday = 24*60*60*1000
    for(var i=0;i<3;i++){
      var times = date.getTime()+(i-2)*oday
      var ndate = new Date(times)
      var arr = this.getday(ndate)
      var value = arr.join("-")
      arr.shift()
      var arrs = arr.join("/")
      
      if(i==0){
        this.data.listweek[i].week = this.getweekday(times)
      }
      this.data.listweek[i].date = arrs
      this.data.listweek[i].value = value
    }
    for(var j=3;j<5;j++){
      var times = date.getTime() + (j-2) * oday
      var ndate = new Date(times)
      var arr = this.getday(ndate)
      var value = arr.join("-")
      if (j == 4) {
        this.data.listweek[j].week = this.getweekday(times)
      }
      arr.shift()
      var arrs = arr.join("/")
      this.data.listweek[j].date = arrs
      this.data.listweek[j].value = value
    }
    this.setData({
      listweek:this.data.listweek
    })
  },
  getday(date){     //用日期得到年月日
      var year = date.getFullYear()
      var mouth = this.addzero(date.getMonth()+1)
      var day = this.addzero(date.getDate())
      return [year,mouth,day]
  },
  addzero(str){
      if(str<10){
        return '0'+str
      }else{
        return str
      }
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
  tabweeks:function(res){   //点击我的计划每一项时间
      var res = res.currentTarget.dataset.indexweek
      this.Getspecificplans(this.data.listweek[res].value)   //获得训练计划表
      this.setData({
        indexweek:res
      })
  },
    makePlan:function(){      //点击定制计划
      this.data.Planstart.background = "#eed1b3"
      this.data.Planstart.wheight = "1280rpx"
      this.data.Planstart.overflow = "hidden"
      this.data.Planstart.sc = 'scale(1,1)'
     this.setData({
       Planstart: this.data.Planstart
     })
     this.mainStrength()
     this.getplanday()
    },
  remove(){  //按取消计划
      this.data.Planstart.background = "normal"
      this.data.Planstart.wheight = "100%"
      this.data.Planstart.overflow = "visible"
      this.data.Planstart.sc = 'scale(0,0)'
      this.setData({
        Planstart: this.data.Planstart
      })
    },
  Preservation(){        //保存计划
    this.damand("/fitness/plans","POST",{
      'purpose': this.data.plansArray[0].array[this.data.plansArray[0].index],
      'facilityType': this.data.plansArray[1].id[this.data.plansArray[1].index],   //训练项目
      'intensity': this.data.plansArray[2].array[this.data.plansArray[2].index],   //训练强度
      'date': this.data.plansArray[3].value[this.data.plansArray[3].index],   //日期
      'time': this.data.plansArray[4].time,   //时间
      'duration': this.data.plansArray[5].value[this.data.plansArray[5].index] //时长，按秒计
    },(info)=>{
        this.data.Planstart.background = "normal"
        this.data.Planstart.wheight = "100%"
        this.data.Planstart.overflow = "visible"
        this.data.Planstart.sc = 'scale(0,0)'
        if (this.data.indexweek>1){
          this.Getspecificplans(this.data.listweek[this.data.indexweek].value)
        }
        this.setData({
          Planstart: this.data.Planstart
        })
        setTimeout(function(){
          Icons.Toast('保存成功', 'success')
        },400)
    },"保存中")


  },
  mainStrength(){                              //改变训练内容和强度
   
    this.damand('/facilities/types',"GET","",(info)=>{
      var info = info.data.data
      var len = info.length
      var aerobic = []
      var Power = []
      var tag
      var taglen
      var aerobicid = []
      var Powerid = []
      console.log(info)
      for(var i = 0;i<len;i++){
        tag = info[i].tags
        taglen = tag.length
        for(var j=0;j<taglen;j++){
           if(tag[j]=="力量"){
             Power.push(info[i].name)
             Powerid.push(info[i].id)
           } else if (tag[j] == "有氧"){
             aerobic.push(info[i].name)
             aerobicid.push(info[i].id)
           }
        }
      }
      if (this.data.plansArray[0].index==0){
        this.data.plansArray[1].array = aerobic
        this.data.plansArray[1].id = aerobicid
      }else{
        this.data.plansArray[1].array = Power
        this.data.plansArray[1].id = Powerid
      }
      this.setData({
          plansArray: this.data.plansArray
      })
      
    })
  },
  pickerProject: function (e) {     //改变训练计划
   var  index = e.detail.value
   this.data.plansArray[0].index = index
  if (index==0){
    this.data.plansArray[2].array = ["10-20分钟", "20-40分钟", "40分钟以上"]
  }else if(index==1){
    this.data.plansArray[2].array = ["1-3组", "3-5组", "5组以上"]
  }
  this.setData({
    plansArray: this.data.plansArray
  })
    this.mainStrength()
},
  pickerProjectMain: function (e) {     //改变项目内容
    this.data.plansArray[1].index = e.detail.value
  this.setData({
    plansArray: this.data.plansArray
  })
},
  pickerStrength: function (e) {     //改变训练强度
    this.data.plansArray[2].index = e.detail.value
  this.setData({
    plansArray: this.data.plansArray
  })
},
  pickerDate: function (e) {     //改变计划日期
    this.data.plansArray[3].index = e.detail.value
  this.setData({
    plansArray: this.data.plansArray
  })
},
  pickertime: function (e) {     //改变计划日期
    this.data.plansArray[4].time = e.detail.value
  this.setData({
    plansArray: this.data.plansArray
  })
},
  pickerTimeLength: function (e) {     //改变计划时长
    this.data.plansArray[5].index = e.detail.value
  this.setData({
    plansArray: this.data.plansArray
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
    this.userinfo()     //获得用户信息
    this.getTimestamp() //获得时间戳
    this.getallweek()     //获得所有时间列
    this.gettoday()    //获得今日运动时间
    this.geteveryDate(this.data.cweek)  //获得每天时间
    this.getlistweek()  //获得我的计划的时间
    this.getinfos(this.data.cweek) //得到每天的运动时间数值
    this.getalltime()  //得到所有时间
    this.Getspecificplans(this.data.listweek[2].value)   //获得训练计划表
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
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