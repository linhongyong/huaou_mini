// pages/mine/index/index.js
var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const Toptips = require('../../../components/toptips/index.js');
const Dialog = require('../../../components/dialog/dialog');
var self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var info = {
      nickname: wx.getStorageSync('nickname'),
      headpic: wx.getStorageSync('headpic'),
      account: wx.getStorageSync('account'),
    }
    self.setData({
      info: info
    })
    this.getUserInfo();
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
  
  },
  // 退出登录
  logout: function(){
    wx.showModal({
      title: util.appName,
      content: '是否要退出登录？',
      success: function(res){
        if (res.confirm){
          wx.clearStorage();
          // wx.reLaunch({
          //   url: '../../pangzhan/index/index',
          // })
          util.getDataByAjax({
            url: '/signOutWeiXin',
            method: "Post",
            success: function (res) {
              console.log("----------------------------------")
              wx.clearStorage();
              wx.reLaunch({
                url: '../../pangzhan/index/index',
              })
            },
            error: function (error) {
              console.log(error);
            },
          });  
          wx.clearStorage();
          wx.reLaunch({
            url: '../../pangzhan/index/index',
          })
        }
      },
      fail: function(error){
        console.log(error);
      }
    })
  },
  getUserInfo(){
    let that = this;
    util.getDataByAjax({
      url: '/user/getUserLogin',
      method: "get",
      success: function (res) {
        console.log(res)
        that.setData({
          user: res.data.result
        })
      },
      error: function (error) {
        console.log(error);
      },
    });  
  }
})