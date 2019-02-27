// pages/mine/index/index.js
var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const appApi = require('../../../api/app-api.js')
const Toptips = require('../../../components/toptips/index.js');
const Dialog = require('../../../components/dialog/dialog');
var app = getApp();
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
      info: info,
      roles: app.globalData.roles,
    })
    this.getUserInfo();

  },
  statisticsForToday: function(){
    console.log("统计方法调用")
    let statisticsForToday = [];
    this.setData({
      statisticsForToday
    })
    let promises = [];
    for (let i = 0; i < app.globalData.buildingList.length; i++) {
      let data = {
        projectId: app.globalData.project.id,
        buildingId: app.globalData.buildingList[i].id,
        type: `000${app.globalData.currentPzIndex - 0 + 1}`,
        endTime: new Date()
      }
      let promise = this.getNumByConditionPromise(data, function (num) {
        statisticsForToday.push({
          buildingName: app.globalData.buildingList[i].buildingName,
          num,
        })
      });
      promises.push(promise);
    }
    Promise.all(promises).then((resolve, reject) => {
      console.log(statisticsForToday);
      this.setData({
        statisticsForToday: statisticsForToday
      })
    })
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
    if (app.globalData.currentPzIndex == 0){
      this.setData({
        project: app.globalData.project,
      })
      this.statisticsForToday();
      appApi.pangzhanStatistics({ projectId: app.globalData.project.id, type:"0001"})
      .then((res)=>{
        this.solveMethod(res.data.result)
        console.log(res);
      })
      // this.statisticsForStatus3();
      // this.statisticsForStatus5();
      // let statisticsNumForAll=0;
      // for (let i = 0; i < app.globalData.buildingList.length; i++) {
      //   statisticsNumForAll += this.data.statisticsForStatus3[i].num + this.data.statisticsForStatus5[i].num 
      // }
      // this.setData({
      //   statisticsNumForAll
      // })
    }
    
  },
  solveMethod: function(data){
    let statusMapList = [0, 0, 0, 0, 0, 0, 0];
    let finishedNum = 0;
    let unCheckNum = 0;
    let startedNum = 0;
    let allPileNum = 0;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].statusMap['3']) data[i].statusMap['3'] = 0;
      if (!data[i].statusMap['5']) data[i].statusMap['5'] = 0;
      if (!data[i].statusMap['2']) data[i].statusMap['2'] = 0;
      if (!data[i].statusMap['4']) data[i].statusMap['4'] = 0;
      if (!data[i].statusMap['1']) data[i].statusMap['1'] = 0;
      finishedNum += data[i].statusMap['3'] + data[i].statusMap['5'];
      unCheckNum += data[i].statusMap['2'] + data[i].statusMap['4'];
      startedNum += data[i].statusMap['1'];
      allPileNum += data[i].pileNum
      for (let j = 0; j < 6; j++) {
        if (!!data[i].statusMap[j + '']) {
          statusMapList[j] = statusMapList[j] + data[i].statusMap[j + '']
        }
      }
    }
    console.log(statusMapList, finishedNum);
    let statisticsDes = `${app.globalData.project.projectName} 项目共有 ${allPileNum} 根桩。
					进行中: ${startedNum}。待审核: ${unCheckNum}。
					已完成: ${finishedNum}, 其中`;
    for (let i = 0; i < data.length; i++) {
      statisticsDes += `${data[i].buildingName} 完成： ${data[i].statusMap['3'] + data[i].statusMap['5']} ; `
    }
    this.statisticsDes = statisticsDes;
    this.setData({ statisticsDes})
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
  getNumByConditionPromise(data,okfn){
    return new Promise((resolve, reject)=>{
      util.getDataByAjax({
        url: '/pangzhan/getPzNumByCondition',
        method: "Post",
        data,
        success: function (res) {
          console.log(res.data.result)
          okfn && okfn(res.data.result);
          resolve(res.data.result)
        },
        error: function (error) {
          reject();
        },
      });
    })
  },
  // 退出登录
  logout: function(){
    wx.showModal({
      title: util.appName,
      content: '是否要退出登录？',
      success: function(res){
        if (res.confirm){
          wx.clearStorage();
          util.getDataByAjax({
            url: '/signOutWeiXin',
            method: "Post",
            data:{},
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
  },

  // 跳转到修改密码页面
  toPassword: function(){
    wx.navigateTo({
      url: '../password/password',
    })
  }
})