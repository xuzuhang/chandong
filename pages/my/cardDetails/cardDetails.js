// pages/my/cardDetails/cardDetails.js
const damand = require('../../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      id:1,
      cardimg:'',
      tit:'',
      price:3000,
      latitude:0,
      longitude:0,
      storename:'',
      address:"",
      distance:0,
      idcards:false,
      passports:false,
      upgrade:false,
    text: "　　1.本协议所称“会员”是指年满16周岁未满60周岁身体健康并向场馆（蝉动）缴纳了相应会员卡或相关课程全部费用，能如实提供和陈述个人信息，取得本场馆发放的电子会员卡或电子课程卡的人士。因此您有义务对入会时所提供资料的真实性、合法性负责。以上任一条件不满足，蝉动有权拒绝向您提供服务。\n　　2.原始取得，指的是在“蝉动”客户端或是在微信公众账号“蝉动”注册、填写真实、有效、全面的个人资料，办理入会手续并缴纳会费后（办理课程购买手续并支付费用后）取得会员资格。\n　　3.私教课程仅供会员本人使用，一旦售出，非不可抗因素不予退课；在教练及会员双方沟通允许的前提下可以转让。因学员问题要转让课程的情况，将不享受购买时的优惠，将按照课程原价进行课程流转，差价需由学员自行承担；教练或平台因素需要更换教练的情况，课程流转同样享受购买时的优惠价格。\n　　4.、年卡会员卡用户每年至多可享受一次停卡机会 ，停卡时间不得低于30天，不超过60天，但特殊情况如：怀孕、受伤等除外，请申请停卡的会员联系蝉动客服并提供相关有效证明。停卡时间到后，自动恢复其会员资格，不另行通知。\n　　5. 由于互联网高速发展，本协议列明的条款并不能完全概况双方所有权利与义务，现有的约定也可能不完全符合未来发展。因此，蝉动有权根据业务发展随时增加各类补充协议，补充协议一经公示且您继续使用蝉动的，视为您同意上述补充协议。\n　　6.、本人保证所提供的入会资料及个人信息真实有效。\n　　7.本人身体健康且没有本协议约定的不适合进行运动的疾病。\n　　8.本人已阅读、理解并同意上述条文。\n　　9. 本合同的效力、解释、变更、执行及争议的解决等均适用中华人民共和国法律。因本合同产生的任何争议，双方应协商解决，协商不成的，应提交金华市婺城区法院进行裁决"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var promise = new Promise((resolve)=> {
      this.carddetails(id)
      resolve(42);
    });
      promise.then(this.getloc()).then(this.cardhave())
     
  },
  upgrade() {
    this.damand('/cards/upgrade', "GET", "", (info) => {
      var info = info.data.data
      if (info.available) {
        this.setData({
          price: info.price,
          upgrade: true
        })
      }
    })
  },
  carddetails(ids){
    this.damand("/cards/" + ids, 'GET', '', (info) => {
      var info = info.data.data
      this.setData({
        id: info.id,
        cardimg: info.coverUrl,
        tit: info.title,
        price: info.price
      })
    })
  },
  cardhave(){
    this.damand('/idcards/exists', "GET", "", (info) => {   //有没有提交过身份证
        this.setData({
          idcards: info.data.data
        })
      this.damand('/passports/exists', "GET", "", (info) => {   //有没有提交过护照
        this.setData({
          passports: info.data.data
        })
        this.upgrade()
      })
    })
   
  },
  sures(){
    if (this.data.idcards || this.data.passports){
      wx.navigateTo({
        url: '../MemberAgreement/MemberAgreement?price=' + this.data.price + '&ids=' + this.data.id
      })
    }else{
        wx.navigateTo({
          url: '../certficates/certficates?price=' + this.data.price + '&ids=' + this.data.id 
      })
    }
  },
  getloc(){
    wx.getLocation({
      success: (res) => {
        this.damand('/shops/nearest?latitude=' + res.latitude + '&longitude=' + res.longitude + '&count=1', "GET", "", (info) => {
          var info = info.data.data[0]
          this.setData({
            address: info.address,
            storename: info.name,
            distance: parseInt(info.distance),
            latitude: info.latitude,
            longitude: info.longitude
          })
        })
      }
    })
  },
  damand: damand,
  openloc:function(){
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 28,
      name: this.data.storename
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