
var util = require('../../../utils/util.js')
Page({


  data: {
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.getMessageList();
    this.getUnreadNum();
  },

  onReady: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },


  //------------------------------------------------------ff
  toDetail: function(e){
    this.setRead(this.data.list[e.currentTarget.dataset.index].id);
    let obj = this.data.list[e.currentTarget.dataset.index];
    let parameter = JSON.parse(obj.parameter);
    if (obj.type == "0001"){
      wx.navigateTo({
        url: `../../pangzhan/pangzhan_jxgzz/pangzhan_jxgzz?pangzhanId=${parameter.pangzhanId}`,
      })
    } else if (obj.type == "0002"){
      wx.navigateTo({
        url: `../../pangzhan/pangzhan_shuini/pangzhan_shuini?pangzhanId=${parameter.pangzhanId}`,
      })
    } else if (obj.type == "0003") {
      wx.navigateTo({
        url: `../../pangzhan/pangzhan_yylgz/pangzhan_yylgz?pangzhanId=${parameter.pangzhanId}`,
      })
    }
  },


  //------------------------------------------------------ff
  setRead: function (id) {
    let that = this;
    util.getDataByAjax({
      url: `/message/setRead?id=${id}`,
      method: "Post",
      data: {
      },
      success: function (res) {
        that.getUnreadNum();
      },
      error: function (error) {
       
      },
    });
  },
  getMessageList: function () {
    let that = this;
    util.getDataByAjax({
      url: '/message/getList',
      method: "Post",
      data: {
        pageIndex: 1,
        pageSize: 100
      },
      success: function (res) {
        that.setData({
          list: res.data.result
        })
      },
      error: function (error) {
        console.log(error);
      },
    });
  },
  getUnreadNum: function () {
    let that = this;
    util.getDataByAjax({
      url: '/message/getUnreadNum',
      method: "get",
      data: {},
      success: function (res) {
       console.log(res)
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
})  