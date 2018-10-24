var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const Toptips = require('../../../components/toptips/index.js');
const Dialog = require('../../../components/dialog/dialog');

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


  getOldPsd: function (e) {
    var value = e.detail.value;
    this.setData({
      oldPsd: value
    })
  },
  getNewPsd: function (e) {
    var value = e.detail.value;
    this.setData({
      newPsd: value
    })
  },
  getConfirmNewPsd: function (e) {
    var value = e.detail.value;
    this.setData({
      confirmNewPsd: value
    })
  },

  // 修改密码 
  toEdit: function(){
    var oldPsd = this.data.oldPsd;
    var newPsd = this.data.newPsd;
    var confirmNewPsd = this.data.confirmNewPsd;
    if (!oldPsd){
      Toptips('请输入原密码');
      return 
    }
    if (!newPsd) {
      Toptips('请输入新密码');
      return
    }
    if (!confirmNewPsd) {
      Toptips('请重复输入新密码');
      return
    }
    if (newPsd !== confirmNewPsd) {
      Toptips('输入的两次密码不一致');
      return
    }

    util.getDataByAjax({
      url: '/user/changePassword',
      data: {
        passwordNew:newPsd, 
        passwordOld: oldPsd
      },
      method: "Post",
      success: function (res) {
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(function(){
          wx.navigateBack();
        },1000)
        
      },
      error: function (error) {
        Toptips(error);
      },
    });  
  }
})