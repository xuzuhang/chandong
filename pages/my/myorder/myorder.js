// pages/my/myorder/myorder.js
const damand = require('../../../utils/request.js')
var Icons = require('../../../utils/icon.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    allorder:[],
    bepaid:[],
    alreadypaid:[],
    allordernum:'',
    bepaidnum:'',
    alreadynum:''
  },
  tab: function (res) {      //tab切换逻辑
    var index = res.currentTarget.dataset.index
    this.setData({
      index: index
    })
    if(index==1){
      if (this.data.bepaid.length == 0) {
        this.setData({
          allorder: []
        })
        this.requestdata("", "", "allorder", "allordernum")
      }
    }else if (index == 2) {
      if (this.data.bepaid.length == 0) {
        this.setData({
          bepaid: []
        })
        this.requestdata("", 1, "bepaid", "bepaidnum")
      }
    } else if (index == 3) {
      if (this.data.alreadypaid.length == 0) {
        this.setData({
          alreadypaid:[]
        })
        this.requestdata("", 3, "alreadypaid", "alreadynum")
      }
    }
  },
  damand: damand,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestdata("", "", "allorder","allordernum")
  },
  requestdata(last,status,name,numname){

    this.damand('/cards/orders?count=5&last='+last+'&status='+status, 'GET', '', (info) => {
      var info = info.data.data
      info.forEach((currentValue, index, arr) => {
        currentValue.times = this.time(currentValue.createTime)
        this.data[name].push(currentValue)
      })
      if (info.length==0) {
        this.data[numname] = 0
      } else {
        this.data[numname] = info[info.length - 1].id
        console.log(this.data[numname])
      }
      if(this.data.index==1){
        this.setData({
          allorder: this.data[name],
          allordernum: this.data[numname]
        })
      }else if(this.data.index==2){
        this.setData({
          bepaid: this.data.bepaid,
          bepaidnum: this.data.bepaidnum
        })
      }else if(this.data.index==3){
        this.setData({
          alreadypaid: this.data.alreadypaid,
          alreadynum: this.data.alreadynum
        })
      }
    })
  },
  time(time){
    var date = new Date(time)
    var year = date.getFullYear() + '/' + this.addzero((date.getMonth() + 1)) + '/' + this.addzero(date.getDate()) + " " + this.addzero(date.getHours()) + ":" + this.addzero(date.getMinutes()) + ":" + this.addzero(date.getSeconds())
    return year
  },
  addzero(str) {
    if (str < 10) {
      return "0" + str
    } else {
      return str
    }
  },  
  alllower(){
     
          if (this.data.allordernum==0){
            Icons.Toast('没有数据了哦', 'none')
          }else{
            this.requestdata(this.data.allordernum, "", "allorder", "allordernum")
          }       
  },
  belower(){
    if (this.data.bepaidnum == 0) {
      Icons.Toast('没有数据了哦', 'none')
    } else {
      this.requestdata(this.data.bepaidnum, 1, "bepaid", "bepaidnum")
    }
  },
  alrlower(){
    if (this.data.alreadynum == 0) {
      Icons.Toast('没有数据了哦', 'none')
    } else {
      this.requestdata(this.data.alreadynum, "", "alreadypaid", "alreadynum")
    }
  },
  detele(res){
    var index = res.currentTarget.dataset.detei
  
    if(this.data.index==1){
      if (this.data.allorder[index].status==1){
        wx.showModal({
          content: '确定取消订单吗',
          success: (res)=> {
            if (res.confirm) {
              this.damand('/cards/orders/' + this.data.allorder[index].id,"DELETE","",(info)=>{
                  this.data.allorder.splice(index,1)
               
                  this.setData({
                    allorder: this.data.allorder,
                    bepaid:[],
                    alreadypaid:[]
                  })
                  Icons.Toast('已取消', 'success')
              },"取消订单中")
            } 
          }
        })
      } else{
        wx.showModal({
          content: '确定删除订单吗',
          success: (res)=> {
            if (res.confirm) {
              this.damand('/cards/orders/' + this.data.allorder[index].id, "DELETE", "", (info) => {
                this.data.allorder.splice(index, 1)
                this.setData({
                  allorder: this.data.allorder,
                  bepaid: [],
                  alreadypaid: []
                })
                Icons.Toast('已删除', 'success')
              },"删除订单中")
            } 
          }
        })
      }
    } else if (this.data.index == 2){
      wx.showModal({
        content: '确定取消订单吗',
        success: (res) => {
          if (res.confirm) {
            this.damand('/cards/orders/' + this.data.bepaid[index].id, "DELETE", "", (info) => {
              this.data.bepaid.splice(index, 1)
              this.setData({
                bepaid: this.data.bepaid,
                allorder: [],
                alreadypaid: []
              })
              Icons.Toast('已取消', 'success')
            },"取消订单中")
          }
        }
      })
    } else if (this.data.index == 3){
      wx.showModal({
        content: '确定删除订单吗',
        success: (res) => {
          if (res.confirm) {
            this.damand('/cards/orders/' + this.data.alreadypaid[index].id, "DELETE", "", (info) => {
              this.data.alreadypaid.splice(index, 1)
              this.setData({
                alreadypaid: this.data.alreadypaid,
                allorder: [],
                bepaid: []
              })
              Icons.Toast('已删除', 'success')
            },"删除订单中")
          }
        }
      })
    }
      
  },
  toOrder(res){
    var index = res.currentTarget.dataset.ind
    if (this.data.allorder[index].status!==5){
      var infostr
      if (this.data.index == 1) {
        infostr = JSON.stringify(this.data.allorder[index])
        wx.navigateTo({
          url: '../orderDetails/orderDetails?order=' + infostr
        })
      } else if (this.data.index == 2) {
        infostr = JSON.stringify(this.data.bepaid[index])
        wx.navigateTo({
          url: '../orderDetails/orderDetails?order=' + infostr
        })
      } else if (this.data.index == 3) {
        infostr = JSON.stringify(this.data.alreadypaid[index])
        wx.navigateTo({
          url: '../orderDetails/orderDetails?order=' + infostr
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