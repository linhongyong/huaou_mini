

var util = require('../../../utils/util.js');
const Dialog = require('../../../components/dialog/dialog');
const Toptips = require('../../../components/toptips/index.js');
const { chooseImage, image2base64 } = require('../common/js/image-process.js');
const { getBaiduAccessToken, getDataFromImageByTmpl } = require('../common/js/baidu.js');
import { Base64 } from 'js-base64'
Page({
  data: {
    imageUrl:"../../../res/upload.png"
  },
  onShow: function () {
    // this.getList();//创建后返回此页要刷新
    console.log(Base64.encode("asd"))
    // ImageProcess.compressImage()
  },

  onReady: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },


  //------------------------------------------------------ff
  chooseImage: function(){
    let that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success(res) {
        if (res.tapIndex == 0){
          that.compressImage("camera")
        } else if (res.tapIndex == 1){
          that.compressImage("album")
        }else{
        }
      }
    })
  },
  compressImage: function (way) {
    chooseImage(way).then(url => {
      this.setData({
        imageUrl: url[0]
      })
      wx.showLoading({
        title: '识别中',
      })
      return image2base64(url[0])
    }).then( data => {
      getBaiduAccessToken().then( token => {
        return getDataFromImageByTmpl(token, {
          image: data,
          templateSign: "bcbfed47d92324ec3b6c4adca762086c"
        }) 
      }).then(res => {
        wx.hideLoading();
        if (!res.data.isStructured){
          this.setData({
            imageData: []
          })
        }
        if (res.data.error_code == 0){
          this.setData({
            imageData: res.data.data.ret
          })
        }
        else if (res.data.error_code == 216202) {
          Toptips("照片过大");
        } else if (res.data.error_code == 272000) {
          Toptips("识别失败，未能匹配模板");
        }
        else{
          Toptips("出现错误");
        }
        
      })
    })
  },


})  
