
var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const Toptips = require('../../../components/toptips/index.js');
const Dialog = require('../../../components/dialog/dialog');
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
      zongjian: wx.getStorageSync("zongjian"),
      shigongfang: wx.getStorageSync("shigongfang"),
      buildingCode: wx.getStorageSync("currentBuildingCode"),
      currentProjectName: wx.getStorageSync("currentProjectName"),
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
        pangzhanId: options.pangzhanId
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
    if (!this.data.pang.id) {
      wx.showToast({
        title: '旁站不存在',
      })
      return;
    }
    let that = this;
    wx.chooseImage({
      count: e.currentTarget.dataset.index == "weldingUrlAndTime" ? 1 : 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (e.currentTarget.dataset.index == "lastTenHitLrrigationUrl"){
          let len1 = that.data.pang.lastTenHitLrrigationUrl.length;
          let len2 = res.tempFilePaths.length;
          if (len2 > 8 - len1) {
            res.tempFilePaths.length = 9 - len1;
          }
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            that.setData({
              ['pang.lastTenHitLrrigationUrl']: that.data.pang.lastTenHitLrrigationUrl ? that.data.pang.lastTenHitLrrigationUrl.concat(imgs) : imgs,
            })
          });
        }
        else if (e.currentTarget.dataset.index == "weldingUrlAndTime"){
          // let len1 = that.data.pang.weldingUrlAndTime.length;
          // let len2 = res.tempFilePaths.length;
          // let time = util.formatTime(new Date());
          // if (len2 > 8 - len1) {
          //   res.tempFilePaths.length = 9 - len1;
          // }
          let time = util.formatTime(new Date());
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            that.setData({
              ['pang.weldingUrlAndTime']: that.data.pang.weldingUrlAndTime ? that.data.pang.weldingUrlAndTime.concat([{ url: imgs[0], time: time }]) : [{ url: imgs[0],time:time }]
            })
          });
        }
        else if (e.currentTarget.dataset.index == "deptRockUrl") {
          let len1 = that.data.pang.deptRockUrl.length;
          let len2 = res.tempFilePaths.length;
          if (len2 > 8 - len1) {
            res.tempFilePaths.length = 9 - len1;
          }
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            that.setData({
              ['pang.deptRockUrl']: that.data.pang.deptRockUrl ? that.data.pang.deptRockUrl.concat(imgs) : imgs
            })
          });
        }
      }
    })
  },

  updateImagesOrSave:function(e){
    let that = this;
    console.log(e);
    if (e.currentTarget.dataset.index == "lastTenHitLrrigationUrl") {
      if (that.data.pang.lastTenHitLrrigationUrl.length > 0){
        that.updatePangzhan();
      }else{
        wx.showToast({
          title: '照片不能为空',
        })
      }
      
    }
    else if (e.currentTarget.dataset.index == "weldingUrlAndTime"){
      if (that.data.pang.weldingUrlAndTime.length > 0){
        that.updatePangzhan();
      }else{
        wx.showToast({
          title: '照片不能为空',
        })
      }
    }
    else if (e.currentTarget.dataset.index == "deptRockUrl") {
      if (that.data.pang.deptRockUrl.length > 0) {
        that.updatePangzhan();
      } else {
        wx.showToast({
          title: '照片不能为空',
        })
      }
    }
  },

  deletePic: function (e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let stepindex = e.currentTarget.dataset.stepindex;
    let that = this;
    
    console.log(that.data.tempFilePaths);
    if (stepindex == "lastTenHitLrrigationUrl"){//
      that.data.pang.lastTenHitLrrigationUrl.splice(index, 1);
      this.setData({
        ['pang.lastTenHitLrrigationUrl']: that.data.pang.lastTenHitLrrigationUrl
      })
    } else if (stepindex == "actualDeepImg") {//
      that.data.pang.actualDeepImg.splice(index, 1);
      this.setData({
        ['pang.actualDeepImg']: that.data.pang.actualDeepImg
      })
    }
    else if (stepindex == "deptRockUrl") {//
      that.data.pang.deptRockUrl.splice(index, 1);
      this.setData({
        ['pang.deptRockUrl']: that.data.pang.deptRockUrl
      })
    }
  }, 

  bindTimeChange: function (e) {
    if (!this.data.pang.id) {
      wx.showToast({
        title: '旁站不存在',
      })
      return;
    }
    console.log(e);
    let date;
    let time = util.formatTime(new Date());
    switch (e.currentTarget.dataset.index) {
      case 'startTime':
        date = this.data.startTime.split(' ')[0];
        this.setData({
          startTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'endTime':
        date = this.data.endTime.split(' ')[0];
        this.setData({
          endTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'dropCageEndTime':
        date = this.data.dropCageStartTime.split(' ')[0];
        this.setData({
          dropCageEndTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'dropCageEndTime':
        date = this.data.dropCageStartTime.split(' ')[0];
        this.setData({
          dropCageEndTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'secondCleanStartTime':
        date = this.data.secondCleanStartTime.split(' ')[0];
        this.setData({
          secondCleanStartTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'secondCleanEndTime':
        date = this.data.secondCleanEndTime.split(' ')[0];
        this.setData({
          secondCleanEndTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'perfusionStartTime':
        date = this.data.perfusionStartTime.split(' ')[0];
        this.setData({
          perfusionStartTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'perfusionEndTime':
        date = this.data.perfusionEndTime.split(' ')[0];
        this.setData({
          perfusionEndTime: date + " " + e.detail.value + ":00"
        })
        break;
    }

    this.updatePangzhan();

    console.log('picker发送选择改变，携带值为', e.detail.value);
   
  },
  // -----------------------------------------------------------------------------------------------------------------------------
  /**edit
   * 切换成可编辑状态
   */
  toEdit: function (e) {
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
    this.setData({
      ['pang.status']: 2
    })
    this.updatePangzhan();
    let toIds = [];
    for (let i = 0; i < this.data.zongjian.length; i++) {
      toIds.push(this.data.zongjian[i].userId);
    }
    let data = {
      type: "0003",
      title: `${wx.getStorageSync('currentProjectName')} ${wx.getStorageSync('currentBuildingCode')}号楼 ${this.data.pang.pileCode}号预应力管桩旁站完成`,
      toIds: [
       76
      ],
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
        ['pang.status']: 1
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
  })
  