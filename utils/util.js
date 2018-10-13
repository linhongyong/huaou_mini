var app = getApp();
var Toptips = require('../components/toptips/toptips.js');

//项目配置ff**********************************************************************************************************
const appName = '华瓯监理';
var website = "https://www.believeyou.top";
// var website = "http://www.believeyou.top:3001/mock/11";
const logo = 'logo.png';

//请求函数封装ff********************************************************************************************************
/**
 * 请求封装
 * obj 请求参数封装
 * method 请求方法 如get、post
 */
let isRequesting = false;
function getDataByAjax(obj, method) {
  // 重复提交拦截
  if (obj.preventSubmits){
    if (isRequesting){
      return;
    }else{
      isRequesting = true;
    }
  }
  let start;
  // 判断是否授权
  if (obj.isAuthorize && !isAuthorize()) {
    return;
  }
  // 是否需要有 “加载中...提示”
  if (!!obj.isShowLaoding) {
    wx.showLoading({
      title: "加载中.."
    });
    start = Date.now();
  }
  // 使用本地的time13还是服务器的
  if (true) {//app.globalData.isValid
    var time13 = Date.now();
    wxRequest(obj, time13, start, method);
  } else {
    getTime13().then(time13 => {
      wxRequest(obj, time13, start, method);
    })
  }
}

function wxRequest(obj, time13, start) {
  var sign = encrypt(JSON.stringify({
    app_type: 'wechat-site',
    version: 1,
    time: time13,
    temp: Math.random() * 100
  }));
  wx.request({
    url: website + obj.url,
    data: obj.data,
    method: !!obj.method ? obj.method : "Get",
    header: {
      token: wx.getStorageSync("token"),
      apptype: 'wechat-site',
    },
    success: function (res) {
      isRequesting = false;
      console.log(obj.url+"************************************");
      console.log(res);
      if (!!obj.isShowLaoding) {
        let end = Date.now();
        var time = end - start;
        if (time < 500) {//让加载中提示显示至少500毫秒
          setTimeout(function () {
            wx.hideToast();
          }, 500 - time);
        } else {
          wx.hideToast();
        }
      }
      if (res.data.status == 200 || res.statusCode == 200) {
        obj.success(res);
      } else if (res.data.status == 400) {
        wx.clearStorageSync("isAuthorize");
        console.log("重新登录");
        wx.switchTab({
          url: '../index/index',
        })
      }
      else {
        obj.success(res);
        obj.error && obj.error(res);
        // !!isDataCommon(res.data.message) && Toptips({
        //   duration: 3000,
        //   content: res.data.message,
        // });
        // wx.showToast({
        //   title: '500错误',
        // })
      }
    },
    error: function (res) {
      console.log(res);
      Toptips({
        duration: 3000,
        content: "请求失败",
      });
    }
  });//wx.request
}
function getTime13() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: website + '/api/time13',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        resolve(res.data.data);
      },
      error: function () {
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  })
}

/**
 * 判断是否授权，没有则调用page()中的showAuthorizeDialog
 * return 是否授权
 */
function isAuthorize() {//
  if (!isDataCommon(wx.getStorageSync("isAuthorize"))) {
    const pages = getCurrentPages();
    const ctx = pages[pages.length - 1];
    ctx.showAuthorizeDialog();
    return false;
  }
  return true;
}
//上传图片到服务器**************************************************************************************************
let uploadedImgs;
function uploadImgPromise(url){
  let promise = new Promise((resolve, reject) => {
    wx.uploadFile({
      url: website + '/file/uploads',
      // url:"http://www.therethey.com:3001/api/mall/upload/img",
      filePath: url,
      name: 'files',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
      },
      success: function (res) {
        console.log("----------------------------uploadedImgs------------------");
        console.log(res);
        var data = JSON.parse(res.data);
        console.log(data);
        uploadedImgs.push(data.result[0]);
        resolve();
      },
      fail: function (err) {
        console.log("图片上传失败");
        Toptips({
          content: "图片上传失败",
        })
      }
    })
  })
  return promise;
}

function uploadImgPromises(imgs, callback){
  uploadedImgs = [];
  var promiseArr = [];
  var resultArrr = [];
  for (let i = 0; i < imgs.length; i++) {
    promiseArr.push(uploadImgPromise(imgs[i]));
  }
  Promise.all(promiseArr).then(() => {
    callback && callback(uploadedImgs);
  });
}

//加解密ff**********************************************************************************************************
var CryptoJS = require('aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("czm736099435qqqq");//十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse('1314520131452020');//十六位十六进制数作为秘钥偏移量
//解密方法
function decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
function encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}


//工具函数**********************************************************************************************************

/**
 * 判断参数是否可用
 * return 可用返回原值，不可用返回false
 * 注：data为Boolean时返回原值
 */
function isDataCommon(data) {
  if (typeof data == "number") {
    return data;
  }
  else if (typeof data == "string") {
    if (!!data.trim()) {
      return data;
    }
    else {
      return false;
    }
  }
  else if (typeof data == "object") {
    for (var p in data) {
      if (p !== undefined) {
        return data;//有参数，且有值
      }
    }
    return false;//无参数或者有但没有值
  }
  else if (typeof data == "boolean") {
    return data;
  }
  else if (typeof data == "undefined") {
    return false;
  }
  else {
    console.log("该参数基本数据类型");
  }
  console.log(data);
}
//格式化数据库时间********************************************************************************************
function releaseTimeFormat(date){
  let date2 = new Date(date);
  let date1 = new Date();
  let minutes = parseInt((date1 - date2) / 1000);
  let seconds = parseInt(minutes / 60);
  let hours = parseInt(seconds / 60);;
  let days = parseInt(hours / 24);
  // console.log(date2, date1,minutes, seconds, hours, days);
  if (seconds == 0) {
    return `刚刚`;
  }
  if (seconds < 60){
    return `${seconds}分钟前`;
  }
  if (hours < 24) {
    return `${hours}小时前`;
  }
  if (days > 0){
    return `${days}天前`;
  }
}


/**
 * date 应该是时间撮
 * 返回格式化的时间 如：2018/08/7 12:30:00
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 向外暴露接***************************************************************************************************

module.exports = {
  appName: appName,
  formatTime: formatTime,
  getDataByAjax: getDataByAjax,
  getDataByAjax: getDataByAjax,
  uploadImgPromise,//图片上传
  uploadImgPromises,//图片上传
  decrypt: decrypt,
  encrypt: encrypt,
  isDataCommon,//判断参数是否可用
  isAuthorize,
  website,
  logo,
  releaseTimeFormat
}
