
var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const Toptips = require('../../../components/toptips/index.js');
const Dialog = require('../../../components/dialog/dialog');
var app = getApp();
Page({
  data: {
    
    isColonShow : false,
    currentSedimentHeight: 0,
    sedimentHeightList: ['请选择', 40, 45, 50, 80, 90, 100, 280, 290, 300],

    currentSlurryProp: 0,
    slurryPropList: ['请选择', 1.1, 1.2,1.3],

    currentActualSlump:0,
    actualSlumpList: ['请选择', 180, 190, 200, 210, 220],
    pang:{
    },
    tempImagesOfCage: [],
    tempImagesOfHoleDepth: [],
    result:{
    }
  },
  onLoad: function (options) {
    let that = this;
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (hour < 10) { hour = "0" + hour }
    if (minute < 10) { minute = "0" + minute }
    this.setData({
      hour: hour,
      minute: minute,
      // zongjian: wx.getStorageSync("zongjian"),
      shigongfang: wx.getStorageSync("shigongfang"),
      buildingCode: wx.getStorageSync("currentBuildingCode"),
      currentProjectName: wx.getStorageSync("currentProjectName"),
      administrator: app.globalData.administrator
    })
    this.makeColonGlint();
    // var options = {pileCode:1}
    if (options.pileCode) {
      this.setData({
        ['pang.pileCode']: options.pileCode,
      })
      this.getOrCreate();
    }
    //审核旁站数据情况
    if (options.pangzhanId) {
      this.setData({
        pangzhanId: options.pangzhanId,
        isWaitCheck: true
      })
      this.getPangzhanById();
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

  // },
  /**
   * 天气选择
   */
  radioChangeOfWeather: function (e) {
    if (!this.isAllowEdit()) {
      return false
    };
    if (!this.data.pang.id) {
      wx.showToast({
        title: '旁站不存在',
      })
      return;
    }
    this.setData({
      ['pang.weather']: e.detail.value
    })
    this.updatePangzhan();
  },

  //------------------------------------------------------ff
  makeColonGlint:function(){
    if (!this.isAllowEdit()) {
      return false
    };
    let that = this;
    setInterval(function(){
      that.setData({
        isColonShow: !that.data.isColonShow
      })
    },1000)
    setInterval(function () {
      let date = new Date();
      let hour = date.getHours();
      let minute = date.getMinutes();
      console.log(hour, minute)
      if (hour < 10) { hour = "0" + hour }
      if (minute < 10) { minute = "0" + minute}
      that.setData({
        hour: hour,
        minute: minute
      })
    }, 60000)

  },
  
  /**
   * 获得时间
   * case index,表示顺序序号
   */
  getTime:function(e){
    if (!this.isAllowEdit()) {
      return false
    };
    // if (!this.data.id) {
    //   wx.showToast({
    //     title: '旁站不存在',
    //   })
    //   return;
    // }
    let prop = `pang.${e.currentTarget.dataset.index}`
    this.setData({
      [prop]: util.formatTime(new Date())
    })
    return;

    this.updatePangzhan();
  },

  preview: function (e) {
    let that = this;
    console.log(e);
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: that.data.tempFilePaths[index], // 当前显示图片的http链接
      urls: that.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },

/********************************************** 图片相关 ****************************************** */
  /**
   * 上传照片
   */
  uploadImages: function (e) {
    if (!pangzhan.isAllowEdit(this)) {
      return false
    };
    let that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let index = e.currentTarget.dataset.index;
        let len1 = that.data.pang[index].length;
        let len2 = res.tempFilePaths.length;
        if (len2 > 8 - len1) {
          res.tempFilePaths.length = 9 - len1;
        }
        util.uploadImgPromises(res.tempFilePaths, function (imgs) {
          that.setData({
            ['pang.' + index]: that.data.pang[index] ? that.data.pang[index].concat(imgs) : imgs,
          })
        });
      }
    })
  },
  updateImagesOrSave: function (e) {
    if (!pangzhan.isAllowEdit(this)) {
      return false
    };
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (that.data.pang[index].length > 0) {
      that.updatePangzhan();
    } else {
      Toptips("照片不能为空");
    }
  },
  deletePic: function (e) {
    if (!pangzhan.isAllowEdit(this)) {
      return false
    };
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let stepindex = e.currentTarget.dataset.stepindex;
    let that = this;
    that.data.pang[stepindex].splice(index, 1);
    this.setData({
      ['pang.' + stepindex]: that.data.pang[stepindex]
    })
  },
  bindTimeChange: function (e) {
    if (!pangzhan.isAllowEdit(this)) {
      return false
    };
    let whichTime = e.currentTarget.dataset.index
    console.log("whichTime", whichTime);
    if (!this.data.pang[whichTime]) {
      console.log("时间字段出错", this.data.pang[whichTime]);
      return;
    }
    let data = this.data.pang[whichTime].split(' ')[0] + " " + e.detail.value + ":00";
    this.setData({
      [`pang.${whichTime}`]: data
    })
    console.log('picker发送选择改变，携带值为', e.detail.value, this.data.pang[whichTime]);
    this.updatePangzhan();
  },
  // 
  // -----------------------------------------------------------------------------------------------------------------------------
  /**edit
   * 切换成可编辑状态
   */
  toEdit: function (e) {
    if (!this.isAllowEdit()) {
      return false
    };
    let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
    this.setData({
      [isEdit]: true
    })
    return;
    
  },
  /**
   * 取消编辑状态
   */
  toDone: function (e) {
    let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
    this.setData({
      [isEdit] : false
    })
  },
  /**
   * 保存
   */
  onInputSave: function (e) {
    console.log(e);
    //先输入楼号和桩号
    if (e.currentTarget.dataset.index == 'pileCode' || e.currentTarget.dataset.index == 'buildingCode') {
    } else {
      // if (!this.data.id) {
      //   wx.showToast({
      //     title: '旁站不存在',
      //   })
      //   return;
      // }
    }
    let porp = `pang.${e.currentTarget.dataset.index}`
    let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
    //为空时不设置
    if (!e.detail.value.value.trim()){
      this.setData({
        [porp]: null,
        [isEdit]: false
      })
      return;
    }else{
      this.setData({
        [porp]: e.detail.value.value,
        [isEdit]: false
      })  
    }
    // 输入楼号桩号决定旁站
    if (e.currentTarget.dataset.index == 'pileCode' || e.currentTarget.dataset.index == 'buildingCode'){
      this.getOrCreate();
      return
    }
    let obj = this.data.pang;
    // 公式计算
    if (e.currentTarget.dataset.index == 'groundHeight' || e.currentTarget.dataset.index == 'pileTopHeight'){
      this.setData({
        songzhuangDeep: math.accSub(obj.groundHeight, obj.pileTopHeight),
      })
    }
    this.updatePangzhan();
  },
  /**
   * 确认完成
   */
  /**
 * 确认完成
 */
  submitToCheck: function () {
    let that = this;
    if (this.data.pang.status == 1) {
      this.setData({
        ['pang.status']: 2,
        ['pang.endTime']: new Date,
      })
    } else if (this.data.pang.status == 2) {
      this.setData({
        ['pang.status']: 3,
      })
    }
    this.updatePangzhan();
    if (this.data.isWaitCheck) { return; }
    let toIds = [];
    for (let i = 0; i < this.data.administrator.length; i++) {
      toIds.push(this.data.administrator[i].userId);
    }
    let data = {
      type: "0003",
      title: `${wx.getStorageSync('currentProjectName')} ${wx.getStorageSync('currentBuildingCode')}号楼 ${this.data.pang.pileCode}号预应力管桩旁站完成`,
      toIds: toIds,
      parameter: {
        "pangzhanId": this.data.pang.id
      }
    }
    util.getDataByAjax({//--首页商品列表
      url: "/message/addJxgzz",
      method: "Post",
      data,
      success: function (res) {
        Toptips({
          duration: 1000,
          content: "成功提交",
          backgroundColor: "#06A940"
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: -1
          })
        }, 2000)
      },
      error: function () { }
    });
  },

  getOrCreate: function(){
    if (!this.data.buildingCode || !this.data.pang.pileCode){
      return;
    }
    let that = this;
    util.getDataByAjax({ 
      url: "/yylgzpz/getOrCreate",
      method: "Post",
      data: {
        projectId: wx.getStorageSync("currentProjectId")-0,
        buildingId: wx.getStorageSync("currentBuildingId") - 0,
        pileCode: that.data.pang.pileCode - 0,
      },
      success: function (res) {
        let obj = res.data.result ? res.data.result : {};
        that.setData({
          pang: obj,
          abc1: math.accSub(math.accAdd(obj.platformElevation , obj.designPileLength) , (obj.pileTopHeight)),
          abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
          ['pang.lastTenHitLrrigationUrl']: obj.lastTenHitLrrigationUrl ? JSON.parse(obj.lastTenHitLrrigationUrl) : [],
          ['pang.weldingUrlAndTime']: obj.weldingUrlAndTime ? JSON.parse(obj.weldingUrlAndTime) : [],
        })

      },
      error: function () {

      }
    });
  },
  updatePangzhan: function () {
        let that = this;
    if (!this.data.pang.mainBarNum || !this.data.pang.mainBarType) {
      this.setData({
        ['pang.mainBar']:null
      })
    }
    if (!this.data.pang.status) {
      this.setData({
        ['pang.status']: 1,
        ['pang.projectName']: app.globalData.project.projectName,
        ['pang.startTime']: new Date,
      })
    }
    let obj = this.data;
    let data = this.data.pang;
    util.getDataByAjax({
      url: '/yylgzpz/update',
      method: "Post",
      data,
      success: function (res) {
        Toptips({
          duration: 1000,
          content: "成功采集！",
          backgroundColor: "#06A940"
        });
        // wx.showToast({
        //   title: '成功采集！',
        //   success: function () {
        //   }
        // })
      },
      error: function () { }
    });
  },
  // getPangzhanById: function () {
  //   let that = this;
  //   util.getDataByAjax({//--首页商品列表
  //     url: "/snJbjPzjl/getSnJbjPzjl",
  //     method: "Get",
  //     data: {
  //       id: this.data.pangzhanId
  //     },
  //     success: function (res) {
  //       let obj = res.data.result;
  //       that.setData({
  //         pang: res.data.result,
  //         ['pang.tryDataUrl']: obj.tryDataUrl ? JSON.parse(obj.tryDataUrl) : [],
  //       })
  //     },
  //     error: function () {

  //     }
  //   });
  // }

  // 是否可以修改
  isAllowEdit: function () {
    if (this.data.pang.status >= 3) {
      console.log('旁站状态，不允许修改');
      return false;
    }
    var roles = wx.getStorageSync('roles');
    var currentProjectId = wx.getStorageSync('currentProjectId');
    var isAllowRole = false;
    roles.forEach(function (v) {
      if ((v.roleName == '专监' || v.roleName == '监理员') && v.projectId == currentProjectId) {
        isAllowRole = true;
        return false;
      }
    })
    if (!isAllowRole) {
      console.log('身份不是专监或监理员，不允许修改');
      return false
    }
  }
  })
  