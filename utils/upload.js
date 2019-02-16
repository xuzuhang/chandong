/**
 * 最终上传到cos的URL
 * 把以下字段配置成自己的cos相关信息，详情可看API文档 https://www.qcloud.com/document/product/436/6066
 * REGION: cos上传的地区
 * APPID: 账号的appid
 * BUCKET_NAME: cos bucket的名字
 * DIR_NAME: 上传的文件目录
 */
// var cosUrl = "https://" + REGION + ".file.myqcloud.com/files/v2/" + APPID + "/" + BUCKET_NAME + DIR_NAME

var cosUrl = "https://sh.file.myqcloud.com/files/v2/"

//填写自己的鉴权服务器地址
var cosSignatureUrl = 'https://wxaapi.cicadafitness.net/cos/authorization' 
/**
 * 上传方法
 * filePath: 上传的文件路径
 * fileName： 上传到cos后的文件名
 */
function upload(filePath, lock, types, fn, appid, bucket) {

    // 鉴权获取签名
 wx.request({
    url: cosSignatureUrl+'?type='+types,
    header: {
      'content-type': 'application/json',
      'authorization': lock // 默认值
    },
    success:function (cosRes) {
      // 签名
      var signature = cosRes.data.data.authorization

      // 头部带上签名，上传文件至COS
      wx.uploadFile({
        url: cosUrl + appid + "/" + bucket+"/"+ cosRes.data.data.path,
        filePath: filePath,
        header: {
          'Authorization': signature
        },
        name: 'filecontent',
        formData: {
          op: 'upload'
        },
        success: function (e) {
          fn(e, cosRes.data.data.path)
        },
        fail: function (e) {
          console.log('e', e)
        }
      })
    }
  })
  
}

module.exports = upload