
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



  //------------------------------------------------------ff
  getMessageList: function(){
    let that = this;
    util.getDataByAjax({
      url: '/message/getList',
      method: "Post",
      data: {
        pageIndex: 1,
        pageSize: 100
      },
      success: function (data) {
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