var config = require('../config/index.js')
function wxRequest(obj) {
  return new Promise((resolve, reject)=>{
    wx.request({
      url: config.baseUrl + obj.url,
      data: obj.data,
      method: !!obj.method ? obj.method : "get",
      header: {
        token: wx.getStorageSync("token"),
      },
      success: function (res) {
        console.log(obj.url + "************************************");
        console.log(res);
        if (!!obj.isShowLaoding) {
          if (!obj.start) obj.start = 0;
          var time = Date.now() - obj.start;
          if (time < 500) {//让加载中提示显示至少500毫秒
            setTimeout(function () {
              wx.hideToast();
            }, 500 - time);
          } 
          else { wx.hideToast(); }
        }
        if (res.data.status == 200 || res.statusCode == 200) { resolve(res); } 
        else { reject(res) }
      },
      error: function (err) { reject(err) }
    });//wx.request
  })
}
let obj = new Object();

obj.post = function(url, data){
  let obj = {
    url, data,
    method: "post"
  }
  return new Promise((resolve, reject)=>{
    wxRequest(obj)
    .then((res)=>{
      resolve(res)
    })
    .catch((err)=>{
      console.error(err);
    })
  })
}
obj.get = function (url, data) {
  let obj = {
    url, data,
    method: "get"
  }
  return new Promise((resolve, reject) => {
    wxRequest(obj)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      console.error(err);
    })
  })
}

module.exports = obj;