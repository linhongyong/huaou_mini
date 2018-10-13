

var util = require('../../utils/util.js');
var login = require('../../utils/login.js');
const Dialog = require('../../components/dialog/dialog');
const Toptips = require('../../components/toptips/index.js');

Page({


  data: {
  },
  onLoad: function (options) {
    if (!util.isAuthorize()) {
      return;
    } else {
      console.log("重新登录");
      login.getUserInfo();
    }
  },
  onShow: function () {
    // this.getList();//创建后返回此页要刷新
  },

  onReady: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },


  //------------------------------------------------------ff
  getList: function () {
    let that = this;
    util.getDataByAjax({//--首页商品列表
      url: "/jxZkGzzPzjl/list",
      method: "Post",
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data.result.list,
        })
      },
      error: function () {

      }
    });
  },


  //------------------------------------------------------ff
  toAdd: function () {
    wx.navigateTo({
      url: '../pangzhan_add/pangzhan_add'
    })
  },
  //------------------------------------------------------ff3
  getPageContentData: function () {//登录后才能获取的数据写在这里

  },
  // util调用
  showAuthorizeDialog: function () {//未授权点击其他调用
    var that = this;
    Dialog({
      logo: "../res/" + util.logo,
      title: util.appName,
      message: '授权登录后才能正常使用!',
      selector: '#zan-button-dialog',
      buttons: [{
        text: '以后再说',
        color: 'red',
        type: 'cancel'
      },
      {
        text: '授权登录',
        openType: "getUserInfo",
        color: '#3CC51F',
        type: 'confirm',

      }]
    }).then(({ type }) => {
      // console.log(type);
    });
  },
  getuserinfo: function (e) {//手动授权
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorageSync("isAuthorize", true);
      login.getUserInfo();
    }
    else {
      wx.setStorageSync("isAuthorize", false);
    }
  },
  onLogin: function (res) {//监听登录
    // Toptips({
    //   duration: 2000,
    //   content: "授权成功，欢迎选购",
    //   backgroundColor: "#06A940"
    // });
    this.getPageContentData();
  }
})  
