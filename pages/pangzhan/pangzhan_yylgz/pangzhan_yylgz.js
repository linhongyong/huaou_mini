
var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const Toptips = require('../../../components/toptips/index.js');
const pangzhan = require('../common/js/pangzhan.js')
const uploadImages = require('../common/js/uploadImages.js')
const textInput = require('../common/js/textInput.js')
const time = require('../common/js/time.js')
const radio = require('../common/js/radioInput.js')
var app = getApp();
Page({
  data: {
    
    isColonShow : false,
    pang:{
    },
    result:{
    },
    updatePangzhanUrl: '/yylgzpz/update'
  },
  onLoad: function (options) {
    Object.assign(this, pangzhan, uploadImages, textInput, time, radio)
    this.pangzhanOnLoad();

    if (options.pileCode) {
      this.setData({
        ['pang.pileCode']: options.pileCode,
      })
      this.getOrCreate("/yylgzpz/getOrCreate", this.afterGetOrCreate);
    }
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
  /**
   * 保存
   */
  onInputSave: function (e) {
    let obj = this.data.pang;
    //负号检测是否正确,平台标高，桩顶标高
    if (e.currentTarget.dataset.index == 'pileTopHeight' || e.currentTarget.dataset.index == 'groundHeight' || e.currentTarget.dataset.index == 'actualElevation') {
      if (isNaN(e.detail.value.value)) {
        Toptips("符号错误");
        return;
      }
    }
    this.onInputSaveBefore(e);
    
    //送桩长度公式
    if (e.currentTarget.dataset.index == 'groundHeight' || e.currentTarget.dataset.index == 'pileTopHeight') {
      this.setData({
        songzhuangDeep: math.accSub(obj.groundHeight, obj.pileTopHeight),
      })
    }
    this.savaOperationLog(e.currentTarget.dataset.index);
    this.updatePangzhan();
  },
  afterGetOrCreate: function (obj) {
    this.setData({
      pang: obj,
      songzhuangDeep: math.accSub(obj.groundHeight, obj.pileTopHeight),
      ['pang.lastTenHitLrrigationUrl']: obj.lastTenHitLrrigationUrl ? JSON.parse(obj.lastTenHitLrrigationUrl) : [],
      ['pang.weldingUrlAndTime']: obj.weldingUrlAndTime ? JSON.parse(obj.weldingUrlAndTime) : [],
    })
  }
  
  

  // getOrCreate: function(){
  //   if (!this.data.buildingCode || !this.data.pang.pileCode){
  //     return;
  //   }
  //   let that = this;
  //   util.getDataByAjax({ 
  //     url: "/yylgzpz/getOrCreate",
  //     method: "Post",
  //     data: {
  //       projectId: wx.getStorageSync("currentProjectId")-0,
  //       buildingId: wx.getStorageSync("currentBuildingId") - 0,
  //       pileCode: that.data.pang.pileCode - 0,
  //     },
  //     success: function (res) {
  //       let obj = res.data.result ? res.data.result : {};
  //       that.setData({
  //         pang: obj,
  //         abc1: math.accSub(math.accAdd(obj.platformElevation , obj.designPileLength) , (obj.pileTopHeight)),
  //         abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
  //         ['pang.lastTenHitLrrigationUrl']: obj.lastTenHitLrrigationUrl ? JSON.parse(obj.lastTenHitLrrigationUrl) : [],
  //         ['pang.weldingUrlAndTime']: obj.weldingUrlAndTime ? JSON.parse(obj.weldingUrlAndTime) : [],
  //       })

  //     },
  //     error: function () {

  //     }
  //   });
  // },
  // updatePangzhan: function () {
  //       let that = this;
  //   if (!this.data.pang.mainBarNum || !this.data.pang.mainBarType) {
  //     this.setData({
  //       ['pang.mainBar']:null
  //     })
  //   }
  //   if (!this.data.pang.status) {
  //     this.setData({
  //       ['pang.status']: 1,
  //       ['pang.projectName']: app.globalData.project.projectName,
  //       ['pang.startTime']: new Date,
  //     })
  //   }
  //   let obj = this.data;
  //   let data = this.data.pang;
  //   util.getDataByAjax({
  //     url: '/yylgzpz/update',
  //     method: "Post",
  //     data,
  //     success: function (res) {
  //       Toptips({
  //         duration: 1000,
  //         content: "成功采集！",
  //         backgroundColor: "#06A940"
  //       });
  //       // wx.showToast({
  //       //   title: '成功采集！',
  //       //   success: function () {
  //       //   }
  //       // })
  //     },
  //     error: function () { }
  //   });
  // },
})
  