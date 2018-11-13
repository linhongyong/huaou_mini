// const util = require("../../../utils/util.js")
let baiduAccount = [
  { APIKey: "R5GQUB3QXpAdTQpHLlnRhGyt", SecretKey: "gCBBpt92iGntXM4tgbxzUcOTRCfuspGC", grantType: "client_credentials",token: null}
]

function getDataByAjax(obj){
  wx.request({
    url: obj.url,
    data: obj.data,
    method: !!obj.method ? obj.method : "get",
    header: obj.header,
    success: function (res) {
      console.log(res)
      obj.success && obj.success(res)
    },
    error: function (res) {
     
    }
  });//wx.request
}
/**
 * 获得AccessToken
 */
function getBaiduAccessToken (){
  
  return new Promise((resolve, reject) => {
    if (baiduAccount[0].token) {
      resolve(baiduAccount[0].token)
    }
    getDataByAjax({
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=${baiduAccount[0].grantType}&client_id=${baiduAccount[0].APIKey}&client_secret=${baiduAccount[0].SecretKey}`,
      method: "Post",
      success: function (res) {
        resolve(res.data.access_token)
      }
    });
  })
}
/**
 * 通用文字识别
 */
function getDataFromImageCommon(token, data) {
  return new Promise((resolve, reject) => {
    getDataByAjax({
      url: `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}`,
      method: "Post",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data,
      success: function (res) {
        resolve(res)
      }
    });
  })
}
/**
 * 表格文字识别，提交
 */
function submitImageForTableData(token, data) {
  return new Promise((resolve, reject) => {
    getDataByAjax({
      url: `https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/request?access_token=${token}`,
      method: "Post",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data,
      success: function (res) {
        resolve(res)
      }
    });
  })
}
function getDataByRequestId(token, data) {
  return new Promise((resolve, reject) => {
    getDataByAjax({
      url: `https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/get_request_result?access_token=${token}`,
      method: "Post",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data,
      success: function (res) {
        resolve(res)
      }
    });
  })
}
function getDataFromTableImage(token, data){
  return submitImageForTableData(token, data)
  .then( res => {
    data = {
      request_id: "14688120_684050",
      result_type: "json"
    }
    return getDataByRequestId(token, data)
  })
}
/**
 * 自定义模板文字识别
 */
function getDataFromImageByTmpl(token, data) {
  return new Promise((resolve, reject) => {
    getDataByAjax({
      url: `https://aip.baidubce.com/rest/2.0/solution/v1/iocr/recognise?access_token=${token}`,
      method: "Post",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data,
      success: function (res) {
        resolve(res)
      }
    });
  })
}

module.exports = {
  getBaiduAccessToken,
  getDataFromImageCommon,
  getDataFromTableImage,
  getDataFromImageByTmpl,
}