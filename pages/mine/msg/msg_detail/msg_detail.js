var util = require('../../../../utils/util.js')
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(parseInt(options.id), wx.getStorageSync("userId"));
    var param = util.encrypt(JSON.stringify({
      user_id: wx.getStorageSync("userId"),
      id: parseInt(options.id)
    }));
    util.getDataByAjax({
      url: "message/read/" + param,
      success: function (res) {
        console.log(res.data);
        that.setData({
          data: res.data
        })
        WxParse.wxParse('article', 'html', res.data.content, that, 0);
      },
      error: function () {

      }
    });
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
  
  }
})