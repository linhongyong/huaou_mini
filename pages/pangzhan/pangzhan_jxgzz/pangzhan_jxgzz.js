
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
      barCageCount: 2,
    },
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
      buildingCode: wx.getStorageSync("currentBuildingCode"),
      currentProjectName: wx.getStorageSync("currentProjectName"),
      administrator: app.globalData.administrator,
      isCanCheck: app.globalData.isCanCheck,
      isCanConfirm: app.globalData.isCanConfirm
    })
    this.makeColonGlint();
    if (options.pileCode){
      this.setData({
        ['pang.pileCode']: options.pileCode,
      })
      this.getOrCreate();
    }
    //审核旁站数据情况
    if (options.pangzhanId){
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
    if (!this.isAllowEdit()){
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
    // return;

    this.updatePangzhan();
  },
  /**
//  * 监听成渣厚度
//  */
//   onPickerChangeOfSedimentHeight: function (e) {
//     if (!this.data.id) {
//       wx.showToast({
//         title: '旁站不存在',
//       })
//       return;
//     }
//     let that = this;
//     this.setData({
//       sedimentHeight: that.data.sedimentHeightList[e.detail.value],
//       currentSedimentHeight:e.detail.value
//     })
//     that.updatePangzhan();
//   },
//   /**
//    * 监听泥浆比重10
//    */
//   onPickerChangeOfSlurryProp: function (e) {
//     if (!this.data.id) {
//       wx.showToast({
//         title: '旁站不存在',
//       })
//       return;
//     }
//     let that = this;
//     this.setData({
//       slurryProp: that.data.slurryPropList[e.detail.value],
//       currentSlurryProp: e.detail.value
//     })
//     that.updatePangzhan();
//   },
//   /**
//    * 坍落度
//    */
//   onPickerChangeOfActualSlump: function (e) {
//     if (!this.data.id) {
//       wx.showToast({
//         title: '旁站不存在',
//       })
//       return;
//     }
//     let that = this;
//     this.setData({
//       actualSlump: that.data.actualSlumpList[e.detail.value],
//       currentActualSlump: e.detail.value
//     })
//     that.updatePangzhan();
//   },
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
    if (!this.isAllowEdit()) {
      return false
    };
    if (!this.data.pang.id) {
      wx.showToast({
        title: '旁站不存在',
      })
      return;
    }
    let that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (e.currentTarget.dataset.index == "barCageCountImg"){
          let len1 = that.data.pang.barCageCountImg.length;
          let len2 = res.tempFilePaths.length;
          if (len2 > 8 - len1) {
            res.tempFilePaths.length = 9 - len1;
          }
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            
            that.setData({
              ['pang.barCageCountImg']: that.data.pang.barCageCountImg ? that.data.pang.barCageCountImg.concat(imgs) : imgs,
              // actualDeepImg:null
            })
          });
        }
        else if (e.currentTarget.dataset.index == "actualDeepImg"){
          let len1 = that.data.pang.actualDeepImg.length;
          let len2 = res.tempFilePaths.length;
          if (len2 > 8 - len1) {
            res.tempFilePaths.length = 9 - len1;
          }
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            that.setData({
              ['pang.actualDeepImg']: that.data.pang.actualDeepImg ? that.data.pang.actualDeepImg.concat(imgs) : imgs
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
    if (!this.isAllowEdit()) {
      return false
    };
    let that = this;
    console.log(e);
    if (e.currentTarget.dataset.index == "barCageCountImg") {
      if (that.data.pang.barCageCountImg.length > 0){
        that.updatePangzhan();
      }else{
        wx.showToast({
          title: '照片不能为空',
        })
      }
      
    }
    else if (e.currentTarget.dataset.index == "actualDeepImg"){
      if (that.data.pang.actualDeepImg.length > 0){
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
    if (!this.isAllowEdit()) {
      return false
    };
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let stepindex = e.currentTarget.dataset.stepindex;
    let that = this;
    
    console.log(that.data.tempFilePaths);
    if (stepindex == "barCageCountImg"){//下钢筋笼
      that.data.pang.barCageCountImg.splice(index, 1);
      this.setData({
        ['pang.barCageCountImg']: that.data.pang.barCageCountImg
      })
    } else if (stepindex == "actualDeepImg") {//孔深
      that.data.pang.actualDeepImg.splice(index, 1);
      this.setData({
        ['pang.actualDeepImg']: that.data.pang.actualDeepImg
      })
    }
    else if (stepindex == "deptRockUrl") {//岩样
      that.data.pang.deptRockUrl.splice(index, 1);
      this.setData({
        ['pang.deptRockUrl']: that.data.pang.deptRockUrl
      })
    }
  }, 

  bindTimeChange: function (e) {
    if (!this.isAllowEdit()) {
      return false
    };
    let whichTime = e.currentTarget.dataset.index
    console.log("whichTime", whichTime);
    if (!this.data.pang[whichTime]){
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
    let porp = `pang.${e.currentTarget.dataset.index}`
    let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
    //负号检测是否正确,平台标高，桩顶标高
    if (e.currentTarget.dataset.index == 'platformElevation' || e.currentTarget.dataset.index == 'pileTopHeight') {
      if (isNaN(e.detail.value.value)) {
        Toptips("符号错误");
        return;
      }
    }
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
    if (e.currentTarget.dataset.index == 'pileCode'){
      this.getOrCreate();
      return
    }
    let obj = this.data.pang;
    // 公式计算
    if (e.currentTarget.dataset.index == 'platformElevation' || e.currentTarget.dataset.index == 'designPileLength' || e.currentTarget.dataset.index == 'pileTopHeight' ){
      this.setData({
        abc1: math.accSub(math.accAdd(obj.platformElevation, obj.designPileLength), obj.pileTopHeight),
        abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
      })
    }
    if (e.currentTarget.dataset.index == 'actualDeep' || e.currentTarget.dataset.index == 'pileTopHeight' || e.currentTarget.dataset.index == 'groundElevation' ){
      this.setData({
        ecd: math.accSub(math.accAdd(obj.actualDeep, obj.pileTopHeight), (obj.groundElevation)),
      })
    }
    // 充盈系数
    if (e.currentTarget.dataset.index == 'actualVolume' || e.currentTarget.dataset.index == 'theoryVolume') {
      this.setData({
        ['pang.fe']: math.accDiv(obj.actualVolume, obj.theoryVolume, 2)
      })
    }
    // 主筋拼接
    if (e.currentTarget.dataset.index == 'mainBarNum' || e.currentTarget.dataset.index == 'mainBarType') {
      this.setData({
        ['pang.mainBar']: `${this.data.pang.mainBarNum}φ${this.data.pang.mainBarType}`
      })
    }
    
    this.updatePangzhan();
  },
  /**
   * 确认完成
   */
  submitToCheck: function () {
    let that = this;
    let status;
    //1.确定更新内容
    if(this.data.pang.status == 1){
      this.setData({
        ['pang.endTime']: new Date,
      })
      status=2;
    } else if (this.data.pang.status == 2){
      if (app.globalData.isCanCheck){//有权验收
        status = 3;
      }
      if (app.globalData.isCanConfirm) {//有权确认
        status = 4;
      }
      if (app.globalData.isCanCheck && app.globalData.isCanConfirm){
        status = 5;
      }
    } else if (this.data.pang.status == 3){
      if (app.globalData.isCanConfirm) {//有权确认
        status = 5;
      }
    }
    else if (this.data.pang.status == 4) {
      if (app.globalData.isCanCheck) {//有权验收
        status = 5;
      }
    }
    this.setData({
      ['pang.superName']: app.globalData.roles[0].userName,
      ['pang.status']: status
    })
    //2.更新旁站
    this.updatePangzhan();
    //3.返回上一页
    setTimeout(function () {
      wx.navigateBack({
        delta: -1
      })
    }, 2000)

    //
    this.savaOperationLog();
    if (this.data.isWaitCheck){
      //更新审核消息为已审核
      return;
    }
    
    //不发消息
    // let toIds = [];
    // for (let i = 0; i < this.data.administrator.length; i++){
    //   toIds.push(this.data.administrator[i].userId);
    // }
    // let data = {
    //   type: "0001",
    //   title: `${wx.getStorageSync('currentProjectName')} ${wx.getStorageSync('currentBuildingCode')}号楼 ${this.data.pang.pileCode}号机械灌注桩旁站完成`,
    //   toIds: toIds,
    //   parameter: {
    //     "pangzhanId": this.data.pang.id
    //   }
    // }
    // if (toIds.length){//toIds不能为空
    //   util.getDataByAjax({
    //     url: "/message/addJxgzz",
    //     method: "Post",
    //     data,
    //     success: function (res) {
    //       Toptips({
    //         duration: 1000,
    //         content: "成功提交",
    //         backgroundColor: "#06A940"
    //       });
    //       setTimeout(function () {
    //         wx.navigateBack({
    //           delta: -1
    //         })
    //       }, 2000)
    //     },
    //     error: function () { }
    //   });
    // }
    
  },
  setMsgStatus: function (id) {
    let that = this;
    util.getDataByAjax({
      url: `/message/setRead?id=${id}`,
      method: "Post",
      data: {
      },
      success: function (res) {
        // that.getUnreadNum();
      },
      error: function (error) {

      },
    });
  },
  getOrCreate: function () {
    if (!this.data.pang.pileCode) {
      return;
    }
    let that = this;
    util.getDataByAjax({//--首页商品列表
      url: "/jxZkGzzPzjl/add",
      method: "Post",
      data: {
        projectId:app.globalData.project.id,
        buildingId: wx.getStorageSync("currentBuildingId") - 0,
        pileCode: that.data.pang.pileCode - 0,
      },
      success: function (res) {
        let obj = res.data.result ? res.data.result : {};
        that.setData({
          pang: obj,
          abc1: math.accSub(math.accAdd(obj.platformElevation, obj.designPileLength), (obj.pileTopHeight)),
          abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
          ecd: math.accSub(math.accAdd(obj.actualDeep, obj.pileTopHeight), (obj.groundElevation)),
          ['pang.actualDeepImg']: obj.actualDeepImg ? JSON.parse(obj.actualDeepImg) : [],
          ['pang.barCageCountImg']: obj.barCageCountImg ? JSON.parse(obj.barCageCountImg) : [],
          ['pang.deptRockUrl']: obj.deptRockUrl ? JSON.parse(obj.deptRockUrl) : [],
          // ['pang.mainBarNum']: obj.mainBar ? obj.mainBar.split('φ')[0] : null,
          // ['pang.mainBarType']: obj.mainBar ? obj.mainBar.split('φ')[1] : null,
          ['pang.fe']: math.accDiv(obj.actualVolume, obj.theoryVolume, 2)
        })

      },
      error: function () {

      }
    });
  },
  updatePangzhan: function () {
    let that = this;
    if(!this.data.pang.status){
      this.setData({
        ['pang.status']: 1,
        ['pang.startTime']: new Date,
        ['pang.projectName']: app.globalData.project.projectName
      })
    }
    let obj = this.data;
    let data = this.data.pang;
    // data.openTime = data.startTime;
    // data.stopTime = data.endTime;
    util.getDataByAjax({
      url: '/jxZkGzzPzjl/update',
      method: "Post",
      data,
      success: function (res) {
        Toptips({
          duration: 1000,
          content: "成功采集！",
          backgroundColor: "#06A940"
        });
      },
      error: function () { }
    });
  },
  getPangzhanById: function(){
    let that = this;
    util.getDataByAjax({//--首页商品列表
      url: "/jxZkGzzPzjl/getJxZkGzzPzjl",
      method: "Get",
      data: {
        id: this.data.pangzhanId
      },
      success: function (res) {
        let obj = res.data.result ? res.data.result : {};
        that.setData({
          pang: obj,
          abc1: math.accSub(math.accAdd(obj.platformElevation, obj.designPileLength), (obj.pileTopHeight)),
          abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
          ecd: math.accSub(math.accAdd(obj.actualDeep, obj.pileTopHeight), (obj.groundElevation)),
          ['pang.actualDeepImg']: obj.actualDeepImg ? JSON.parse(obj.actualDeepImg) : [],
          ['pang.barCageCountImg']: obj.barCageCountImg ? JSON.parse(obj.barCageCountImg) : [],
          ['pang.deptRockUrl']: obj.deptRockUrl ? JSON.parse(obj.deptRockUrl) : [],
          // ['pang.mainBarNum']: obj.mainBar ? obj.mainBar.split('φ')[0] : null,
          // ['pang.mainBarType']: obj.mainBar ? obj.mainBar.split('φ')[1] : null,
          ['pang.fe']: math.accDiv(obj.actualVolume, obj.theoryVolume, 2)
        })

      },
      error: function () {

      }
    });
  },
  // 是否可以修改
  isAllowEdit: function(){
    if (this.data.pang.status >= 3) {//3已完成状态
      if (app.globalData.isCanWriteAfterCheck){
        Toptips("请到PC端修改");
      }else{
        Toptips("此旁站已确认无法修改");
      }
      return false;
    }
    if (app.globalData.isCanWrite){
      return true;
    }else{
      Toptips("无修改权限");
      return false
    }
  },
  savaOperationLog: function () {
    let that = this;
    let data = {
      pangzhanId: this.data.pang.id,
      type: `000${app.globalData.currentPzIndex-0+1}`,
      typeName: null,
      buildingId: app.globalData.building.id,
      projectId: app.globalData.project.id,
      editPoint: '小程序旁站数据采集',
      reason: null,
      editerId: app.globalData.userInfo.id
    }
    util.getDataByAjax({
      url: '/pangzhan/addEditReason',
      method: "Post",
      data,
      success: function (res) {
        console.log(data);
      },
      error: function () { }
    });
  },
})  
  
  