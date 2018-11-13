

var util = require('../../../utils/util.js');
const Dialog = require('../../../components/dialog/dialog');
const Toptips = require('../../../components/toptips/index.js');
const rcgn = require('../common/js/rcgn.js')
const { chooseImage, image2base64 } = require('../common/js/image-process.js');
const { getBaiduAccessToken, getDataFromImageCommon  } = require('../common/js/baidu.js');
import { Base64 } from 'js-base64'
Page({
  data: {
    imageUrl:"../../../res/upload.png"
  },
  onLoad: function(){
    Object.assign(this, rcgn)
  },
  onShow: function () {
  },
  onReady: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },


  //------------------------------------------------------ff
  
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
        return getDataFromImageCommon(token, {
          image: data,
        }) 
      }).then(res => {
        wx.hideLoading();
        console.log(res)
        if (res.data.words_result_num > 0){
          this.setData({
            imageData: res.data.words_result
          })
        }else{
          this.setData({
            imageData: []
          })
        }
      //   if (res.data.error_code == 0){
      //     this.setData({
      //       imageData: res.data.data.ret
      //     })
      //   }
      //   else if (res.data.error_code == 216202) {
      //     Toptips("照片过大");
      //   } else if (res.data.error_code == 272000) {
      //     Toptips("识别失败，未能匹配模板");
      //   }
      //   else{
      //     Toptips("出现错误");
      //   }
        
      })
    })
  },


})  
