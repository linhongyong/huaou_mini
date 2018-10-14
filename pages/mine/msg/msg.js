
var util = require('../../../utils/util.js')
Page({


  data: {
  },
  onLoad: function (options) {
    this.getMessageList();
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
  toDetail: function(e){
    let obj = this.data.list[e.currentTarget.dataset.index];
    let parameter = JSON.parse(obj.parameter);
    if (obj.type == "0001"){
      wx.navigateTo({
        url: `../../pangzhan/pangzhan_jxgzz/pangzhan_jxgzz?pangzhanId=${parameter.pangzhanId}`,
      })
    }
  },


  //------------------------------------------------------ff
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
  }
})  