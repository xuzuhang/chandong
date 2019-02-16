function icon(){
    this.Toast=function (tit,icon){
          wx.showToast({
            title: tit,
            icon: icon,
            duration: 2000
          })
    }
    this.slod=function (tit){
      wx.showLoading({
        title: tit,
      })
    }
    this.hide=function (){
      wx.hideLoading()
    }
}
module.exports = new icon()