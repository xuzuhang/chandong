// pages/sport/Result/Result.js
const damand = require('../../../utils/request.js')
var context = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      user:{
        url:"",
        sex:"",
        weight:"",
        height:"",
        changevalue:""
      },
      BMI:{
        color:"#f57a00",
        value:'',
        result:"肥胖",
        arrvalue: ["瘦", "标准", "超重", "肥胖"],
        arrsta: [18.6, 25,30],
        max: 90
      }, 
      Bodyrate:{    //体脂率
        color: "#f57a00",
        text: "31.2%",
        value:"",
        result: "肥胖",
        arrvalue: ["偏瘦", "标准", "警惕","偏胖","肥胖"],
        arrsta: [11,17,22,27],
        max: 75
      },
      Waterrate:{  //水分率
        color: "#77a5ff",
        text: "31.2%",
        value:"",
        result: "不足",
        arrvalue: ["不足", "标准", "优秀"],
        arrsta: [53, 67],
        max: 75
      },
      everyclass:[
        {  //蛋白质
          name:"蛋白质率",
          company:"%",
          color: "#77a5ff",
          value:"",
          text: 0,
          result: "不足",
          arrvalue: ["不足", "标准", "优秀"],
          arrsta: [16, 18],
          max:30
        },
        {  //内脏脂肪指数  
          name: "内脏脂肪指数",
          company: "%",
          color: "#77a5ff",
          value: "",
          text: 0,
          result: "不足",
          arrvalue: ["标准", "警惕", "危险"],
          arrsta: [10, 15],
          max:60
        },
        {  //骨骼含量  
          name: "骨骼含量",
          company: "Kg",
          color: "#77a5ff",
          value:"",
          text: 0,
          result: "不足",
          arrvalue: ["不足", "标准", "优秀"],
          arrsta: [2.8, 3],
          max:8
        },
        {  //肌肉含量
          name: "肌肉含量",
          company: "Kg",
          color: "#77a5ff",
          value: "",
          text: 0,
          result: "不足",
          arrvalue: ["不足", "标准", "优秀"],
          arrsta: [49.5, 59.4],
          max:120
        },
        {  //基础代谢值  1876kcal
          name: "基础代谢值",
          company: "kCal",
          color: "#77a5ff",
          value:"",
          text: 0,
          result: "不足",
          arrvalue: ["偏低", "达标"],
          arrsta: [1649],
          max: 10000
        }
      ]
  },
  getstate:function(item){  //得到状态
    var item = this.data[item]
    if (Object.prototype.toString.call(item) =='[object Array]'){
      item.forEach((currentValue, index, arr)=>{
       this.getstateobj(currentValue)
      })
    }else{
      this.getstateobj(item)
    }
  },
  getstateobj(current){   //得到颜色和数值
    var value = current.value
    current.text = this.Percentile(value, current.max, current.arrsta) * 100 + '%'
    console.log(current)
    if (current.arrsta[0] > value) {
      current.result = current.arrvalue[0]
      current.color = "#77a5ff"
      if (current.name == "内脏脂肪指数"){
        current.color = "#6dc966"
      }
    } else if (current.arrsta[0] <= value && current.arrsta[1] > value) {
      current.result = current.arrvalue[1]
      current.color = "#6dc966"
      if (current.name == "内脏脂肪指数") {
        current.color = "#a444fe"
      }
    } else if (current.arrsta[1] <= value && current.arrsta[2] > value){
      current.result = current.arrvalue[2]
      current.color = "#aeaaff"
    }else if (current.arrsta[2] <= value && current.arrsta[3] > value){
      current.result = current.arrvalue[3]
      current.color = "#a444fe"
    } else{
      current.color = "#ff900e"
      if (current.arrvalue[3]){
        if (current.arrvalue[4]){
          current.result = current.arrvalue[4]
          current.color = "red"
        }else{
          current.result = current.arrvalue[3]
          current.color = "red"
        }
      }else{
        current.result = current.arrvalue[2]
      }
      if (current.name == "内脏脂肪指数") {
        current.color = "#a444fe"
      }
      if (current.name == "基础代谢值"){
        current.color = "#6dc966"
        current.result = current.arrvalue[1]
      }
    }
  },
  gets: function (info) {
      var info = JSON.parse(info)
      console.log(info)
      this.data.user.weight = info.weight
      this.data.BMI.value = info.bmi
      this.data.BMI.arrsta = info.bmiRatingList
      this.data.Bodyrate.value = info.bodyfatPercentage
      this.data.Bodyrate.arrsta = info.bodyfatRatingList
      this.data.Waterrate.value = info.waterPercentage
      this.data.Waterrate.arrsta = info.waterRatingList
      this.data.everyclass[0].value = info.proteinPercentage
      this.data.everyclass[0].arrsta = info.proteinRatingList
      this.data.everyclass[1].value = info.vfal
      this.data.everyclass[1].arrsta = info.vfalRatingList
      this.data.everyclass[2].value = info.boneKg
      this.data.everyclass[2].arrsta = info.boneRatingList
      this.data.everyclass[3].value = info.muscle
      this.data.everyclass[3].arrsta = info.muscleRatingList
      this.data.everyclass[4].value = info.bmr
      this.data.everyclass[4].arrsta = info.bmrRatingList
      this.setData({
          BMI: this.data.BMI,
          Bodyrate: this.data.Bodyrate,
          Waterrate: this.data.Waterrate,
          everyclass: this.data.everyclass,
          user:this.data.user
      })
      console.log(this.data.everyclass)
      this.nextrq()
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gets(options.info)
    this.getuserinfo()
  },
  getuserinfo(){
    this.damand('/users/essential',"GET","",(info)=>{
      var info = info.data.data
      this.data.user.url = info.avatarUrl
      this.setData({
        user:this.data.user
      })
    })
    this.damand('/users/credits',"GET","",(info)=>{
      var info = info.data.data
      this.data.user.changevalue = info
      this.setData({
        user: this.data.user
      })
    })
    this.damand('/users/genderandbirthday',"GET","",(info)=>{
      var info = info.data.data
      if (info.gender=="1"){
         this.data.user.sex = "男士"
      }else{
        this.data.user.sex = "女士"
      }
      this.setData({
        user: this.data.user
      })
    })
    this.damand('/users/heightandweight',"GET","",(info)=>{
      var info = info.data.data
      this.data.user.height = info.height
      this.setData({
        user: this.data.user
      })
    })
  },
  nextrq(){  //请求完后执行
    this.getstate('everyclass')
    this.getstate('Bodyrate')
    this.getstate('BMI')
    this.getstate('Waterrate')
    this.setData({
      everyclass: this.data.everyclass,
      BMI: this.data.BMI,
      Bodyrate: this.data.Bodyrate,
      Waterrate: this.data.Waterrate
    })
    wx.getSystemInfo({
      success: (res) => {
        this.width = res.windowWidth
        this.height = res.windowHeight
      }
    })

    this.drawpic()
    this.drawcircular('Bodyrate', '#ff900e', this.data.Bodyrate.value.toFixed(1) + '%', this.Percentile(this.data.Bodyrate.value, 75, [11, 17, 22, 27]))
    this.drawcircular('Waterrate', '#77a5ff', this.data.Waterrate.value.toFixed(1) + '%', this.Percentile(this.data.Waterrate.value, 75, [11, 17, 22, 27]))
  },
  drawpic(){    //画梯形表图
    var per = this.Percentile(this.data.BMI.value, 90,[18.6, 25, 30])
    var w = 654 / 750 * this.width
    var h = 280/750*this.width
    console.log(w,h)
    context = wx.createCanvasContext('myCanvas')
    context.beginPath()
    this.drawWord("偏瘦",13,"#999",0.073*w,0.43*h)
    this.drawWord("标准",13,"#999",0.35*w,0.38*h)
    this.drawWord("超重",13,"#999",0.59*w,0.28*h)
    this.drawWord("肥胖",13,"#999",0.8*w,0.13*h)
    this.drawWord("18.6",12,"#999",0.267*w,0.98*h)
    this.drawWord("25",12,"#999",0.52*w,0.98*h)
    this.drawWord("30",12,"#999",0.78*w,0.98*h)
    this.drawrectangle('#d9d9d9', 0, h/2, w/4, 0.082*h,0.017*h, '#d9d9d9')
    console.log(per)
    if(per<=0.25){
      var pero = per/0.25
      this.drawrectangle('#359dff', 0, h / 2, w / 4*pero, 0.082 * h*pero, 0.017 * h, '#359dff')
    }
    this.drawrectangle('#d9d9d9', w / 4+2, 0.47 * h, w / 4, 0.264 * h, 0.082 * h, '#d9d9d9')
    this.drawline('#77a5ff', w / 4+1, 0.557*h, w/4+1, h)
    if(per>0.25 && per<=0.5){
      var pero = (per-0.25)/0.25
      this.drawrectangle('#359dff', 0, h / 2, w / 4, 0.082 * h, 0.017 * h, '#359dff')
      this.drawrectangle('#77a5ff', w / 4 + 2, 0.47 * h, w / 4 * pero, (0.264-0.082) * h * pero+0.082*h, 0.082 * h, '#77a5ff')
    }
    this.drawrectangle('#d9d9d9', w / 2 + 4, 0.385 * h, w / 4, 0.514 * h, 0.267 * h, '#d9d9d9')
    this.drawline('#aeaaff', w / 2 + 3, 0.65 * h, w / 2+3, h)
    if (per>0.5 && per<=0.75){
      var pero = (per-0.5) / 0.25
      this.drawrectangle('#359dff', 0, h / 2, w / 4, 0.082 * h, 0.017 * h, '#359dff')
      this.drawrectangle('#77a5ff', w / 4 + 2, 0.47 * h, w / 4, 0.264 * h, 0.082 * h, '#77a5ff')
      this.drawrectangle('#aeaaff', w / 2 + 4, 0.385 * h, w / 4*pero, (0.514-0.267 )* h * pero+0.267*h, 0.267 * h, '#aeaaff')
    }
    this.drawrectangle('#d9d9d9', w*3/4 + 6, 0.27 * h, w / 4, 0.78 * h, 0.5 * h, '#d9d9d9')
    this.drawline('#a444fe', w *0.75 + 5, 0.77 * h, w *0.75 + 5, h)
    if (per>0.75){
      var pero = (per -0.75)/0.25
      this.drawrectangle('#359dff', 0, h / 2, w / 4, 0.082 * h, 0.017 * h, '#359dff')
      this.drawrectangle('#77a5ff', w / 4 + 2, 0.47 * h, w / 4, 0.264 * h, 0.082 * h, '#77a5ff')
      this.drawrectangle('#aeaaff', w / 2 + 4, 0.385 * h, w / 4, 0.514 * h, 0.267 * h, '#aeaaff')
      this.drawrectangle('#a444fe', w * 3 / 4 + 6, 0.27 * h, w / 4 * pero, (0.78-0.5) * h * pero+0.5*h, 0.5 * h, '#a444fe')
    }
    context.draw()
  },
  drawline(StrokeStyle,stx,sty,endx,endy){    //画线 线的颜色  开始位置 结束位置 
    context.setStrokeStyle(StrokeStyle)
    context.moveTo(stx, sty)
    context.lineTo(endx, endy)
    context.stroke()
    context.beginPath()
  },
  drawWord(text,size,fillstyle,x,y){     //在画布上写字  字的文本 大小 颜色  位置
    context.setFillStyle(fillstyle) 
    context.setFontSize(size)
    context.fillText(text,x,y)
    context.beginPath()
  },
  drawrectangle(StrokeStyle,stx,sty,w,ht,hb,fillstyle){      //画矩形  矩形描边颜色 起点坐标  矩形宽度 矩形上高度 矩形下高度 填充色
    var ch = ht-hb
    context.setStrokeStyle(StrokeStyle)
    context.moveTo(stx, sty)
    context.lineTo(stx+w, sty-ch/2)
    context.lineTo(stx+w, sty+ch/2+hb)
    context.lineTo(stx, sty+hb)
    context.setFillStyle(fillstyle)
    context.fill()
    context.stroke()
    context.beginPath()
  },
  drawcircular(id,color,text,more){    //画圆 canvansid 颜色 文本 显示多少
    var context = wx.createCanvasContext(id)
    var w = 168 / 750 * this.width
    context.arc(w / 2, w / 2, 0.41 * w, 0, 2 * Math.PI)
    context.setStrokeStyle('#d6d6d6')
    context.setLineWidth(0.071*w)
    context.stroke()
    context.beginPath();
    context.arc(w / 2, w / 2, 0.41 * w, 1.5 * Math.PI, (1.5 + 2 * more) * Math.PI)
    context.setStrokeStyle(color)
    context.stroke()
    context.setFillStyle("#000")
    context.setFontSize(16)
    context.fillText(text,w*0.24, w*0.55)
    context.draw()
  },
  Percentile(val,max,arr){   //值 最大值 最小值 数组  算出占多少白分
    var len = arr.length
    var per = 1/(len+1)
    for(var i=0;i<len;i++){
      if(arr[i] >=val){
        return val / arr[i] * (i + 1) * per
        break
      }
    }
    return per * len + ((val -arr[len-1])/(max-arr[len-1])*per)
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