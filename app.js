//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    if (!wx.getStorageSync('currentPzIndex')){
      wx.setStorageSync('currentPzIndex', 0)
    }
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.isAuthorize = true;
              wx.setStorageSync("isAuthorize", true);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          this.globalData.isAuthorize = false;
          wx.setStorageSync("isAuthorize", false);
        }
      }
    })
  },
  //旁站：1：已开始；2已完成；3已验收未确认；4已确认未验收；5已验收已确认
  globalData: {
    isFirst: true,
    roles:[],//用户所拥有的角色,
    projectRoleNames: [],//当前项目下用户的角色
    isCanSeeAllProject: false,
    administrator: [],
    isCanCheck: false,//是否有审核权限
    isCanConfirm: false,//是否有权确认
    isCanWrite: false,//是否有修改权限
    isCanWriteAfterCheck: false,//是否有审核后修改权限
    currentPzIndex: 0,//旁站的类型
    userInfo: {},//用户信息
    project:{},//当前项目
    building:{},//当前楼栋
  }
})