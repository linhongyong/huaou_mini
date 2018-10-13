
var util = require('../../../utils/util.js')
const Toptips = require('../../../components/toptips/index.js');
const Dialog = require('../../../components/dialog/dialog');
Page({
  data: {

    isColonShow: false,
    currentTmpl: 0,
    currentProcedure: 0,
    procedureList: ['请选择', '主体结构', '建筑装饰装修', '屋面', '建筑给排水及供暖', '通风与空调', '建筑电气', '智能建筑', '建筑节能', '电梯'],

    currentHjshPropList: [0, 0, 0],
    hjshPropList: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],


    currentSedimentHeight: 0,
    sedimentHeightList: ['请选择', 40, 45, 50, 80, 90, 100, 280, 290, 300],

    currentSlurryProp: 0,
    slurryPropList: ['请选择', 1.1, 1.2, 1.3],

    currentActualSlump: 0,
    actualSlumpList: ['请选择', 180, 190, 200, 210, 220],

    id: null,
    weather: null,//工程地址
    projectAddress: null,//
    pzPart: null,//旁站部位
    building: null,//楼栋号
    workProcedure: null,//工序
    lookStartTime: null,//旁站监理开始时间
    lookEndTime: null,//旁站监理结束时间
    state: null,//
    projectId: null,//
    content: null,//施工内容
    problem: null,//发现及存在的问题
    rectification: null,//整改意见
    dealResult: null,//处理结果
    remarks: null,//备注
    projectManager: null,//项目经理
    projectManagerId: null,//项目经理Id
    qualityInspector: null,//质检员
    qualityInspectorId: null,//质检员id
    contractTime: null,//承包方时间
    supervisorTime: null,//承包方时间
    createTime: null,//承包方时间
    updateTime: null,//承包方时间

    //--------
    tempImagesOfCage: [],
    tempImagesOfHoleDepth: [],
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
      minute: minute
    })
    

    this.makeColonGlint();
    if (options.id) {
      this.setData({
        id: options.id,
      })
      this.getPangzhan();
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
  onPickerChangeOfProcedure: function (e) {
    let that = this;
    this.setData({
      currentProcedure: e.detail.value,
      workProcedure: e.detail.value != 0 ? that.data.procedureList[e.detail.value] : null
    })
  },
  /**
 * 监听模板变化
 */
  // onPickerChangeOfTmpl: function (e) {
  //   if (e.detail.value == 0) {
  //     return;
  //   }
  //   this.setData({
  //     currentTmpl: e.detail.value,
  //     templateId: this.data.tmplList[e.detail.value].id
  //   })
  //   this.updatePangzhan();
  // },

  /**
   * 天气选择
   */
  radioChangeOfWeather: function (e) {
    this.setData({
      weather: e.detail.value
    })
  },

  //------------------------------------------------------ff
  makeColonGlint: function () {
    let that = this;
    setInterval(function () {
      that.setData({
        isColonShow: !that.data.isColonShow
      })
    }, 1000)
    setInterval(function () {
      let date = new Date();
      let hour = date.getHours();
      let minute = date.getMinutes();
      console.log(hour, minute)
      if (hour < 10) { hour = "0" + hour }
      if (minute < 10) { minute = "0" + minute }
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
  getTime: function (e) {
    console.log(e);
    let time = util.formatTime(new Date());
    switch (e.currentTarget.dataset.index) {
      case 'lookStartTime':
        this.setData({ lookStartTime: time })
        break;
      case 'lookEndTime':
        this.setData({ lookEndTime: time })
        break;
    }
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
  uploadImages: function () {
    if (!this.data.id) {
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
        var tempImagesOfCage = res.tempFilePaths;
        if (that.data.status == 4) {
          let len1 = that.data.tempImagesOfCage.length;
          let len2 = res.tempFilePaths.length;
          let length = that.data.result.barCageCount > 2 ? that.data.result.barCageCount - 1 : 1;
          if (len2 > length - len1) {
            res.tempFilePaths.length = length - len1;
          }
          that.setData({
            tempImagesOfCage: that.data.tempImagesOfCage.concat(res.tempFilePaths)
          })
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            that.setData({
              barCageCountImg: that.data.barCageCountImg ? that.data.barCageCountImg.concat(imgs) : imgs,
              actualDeepImg: null
            })
          });
        }
        else if (that.data.status == 7) {
          that.setData({
            tempImagesOfHoleDepth: res.tempFilePaths.length > 1 ? res.tempFilePaths.splice(1) : res.tempFilePaths
          })
          res.tempFilePaths.length = 1;
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            that.setData({
              barCageCountImg: null,
              actualDeepImg: imgs
            })
          });
        }

      }
    })
  },

  updateImagesOrSave: function (e) {
    let that = this;

    if (that.data.status == 4) {
      if (that.data.tempImagesOfCage.length > 0) {
        that.updatePangzhan();
      } else {
        // Toptips("照片不能少于一张");
        wx.showToast({
          title: '照片不能少于一张',
        })
      }

    }
    else if (that.data.status == 7) {
      console.log(e);
      if (that.data.tempImagesOfHoleDepth.length == 0) {
        // Toptips("照片不能为空");
        wx.showToast({
          title: '照片不能为空',
        })
        return;
      }
      if (!(e.detail.value.actualDeep - 0 > 0)) {
        Toptips("孔深不能为空");
        wx.showToast({
          title: '孔深不能为空',
        })
        return;
      }
      this.setData({
        actualDeep: e.detail.value.actualDeep,
        status: that.data.status + 1
      })

      that.updatePangzhan();
    }

  },


  deletePic: function (e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let that = this;

    console.log(that.data.tempFilePaths);
    if (this.data.status == 4) {
      that.data.tempImagesOfCage.splice(index, 1);
      this.setData({
        tempImagesOfCage: that.data.tempImagesOfCage
      })
    } else if (this.data.status == 7) {//孔深
      that.data.tempImagesOfHoleDepth.splice(index, 1);
      this.setData({
        tempImagesOfHoleDepth: that.data.tempImagesOfHoleDepth
      })
    }

  },

  bindTimeChange: function (e) {
    console.log(e);
    let date;
    let time = util.formatTime(new Date());
    switch (e.currentTarget.dataset.index) {
      case 'finishPileStartTime':
        date = this.data.finishPileStartTime.split(' ')[0];
        this.setData({
          finishPileStartTime: date + " " + e.detail.value + ":00"
        })
        break;
      case 'finishPileEndTime':
        date = this.data.finishPileEndTime.split(' ')[0];
        this.setData({
          finishPileEndTime: date + " " + e.detail.value + ":00"
        })
        break;
    }

    this.updatePangzhan();

    console.log('picker发送选择改变，携带值为', e.detail.value);

  },

  // -----------------------------------------------------------------编辑框三个监听事件
  /**
   * 切换成可编辑状态
   */
  toEdit: function (e) {
    console.log(e);
    switch (e.currentTarget.dataset.index) {
      case 'building':
        this.setData({
          isBuildingEdit: true
        })
        break;
      case 'pzPart':
        this.setData({
          isPzPartEdit: true
        })
        break; 
      case 'problemContent':
        this.setData({
          isProblemContentEdit: true
        })
        break;
      case 'content':
        this.setData({
          isContentEdit: true
        })
        break;
    }
  },
  /**
   * 取消编辑状态
   */
  toDone: function (e) {
    switch (e.currentTarget.dataset.index) {
      case 'building':
        this.setData({
          isBuildingEdit: false
        })
        break;
      case 'pzPart':
        this.setData({
          isPzPartEdit: false
        })
        break;
      case 'problemContent':
        this.setData({
          isProblemContentEdit: false
        })
        break;
      case 'content':
        this.setData({
          isContentEdit: false
        })
        break;
    }
  },
  /**
   * 保存
   */
  onInputSave: function (e) {
    // if (e.currentTarget.dataset.index == "pileStartNum" || e.currentTarget.dataset.index == "pileEndNum") {

    // } else {
    //   if (!this.data.id) {
    //     wx.showToast({
    //       title: '旁站不存在',
    //     })
    //     return;
    //   }
    // }

    console.log(e);
    switch (e.currentTarget.dataset.index) {
      case 'building':
        this.setData({
          isBuildingEdit: false,
          building: e.detail.value.value
        })
        break;
      case 'pzPart':

        this.setData({
          isPzPartEdit: false,
          pzPart: e.detail.value.value
        })
        break;
      case 'problemContent':
        this.setData({
          isProblemContentEdit: false,
          problem: e.detail.value.value
        })
        break;
      case 'content':
        this.setData({
          isContentEdit: false,
          content: e.detail.value.value
        })
        break;
    }
    // if (e.currentTarget.dataset.index == "pileStartNum" || e.currentTarget.dataset.index == "pileEndNum") {

    // } else {
    //   this.updatePangzhan();
    // }
  },
  getPangzhan: function () {
    let that = this;
    util.getDataByAjax({
      url: `/commonPzjl/getCommonPzjl?id=${this.data.id}`,
      method: "Get",
      success: function (res) {
        let obj = res.data.result;
        that.setData({
          weather: obj.weather,//工程地址
          projectAddress: obj.projectAddress,//
          pzPart: obj.pzPart,//旁站部位
          building: obj.building,//楼栋号
          workProcedure: obj.workProcedure,//工序
          lookStartTime: obj.lookStartTime,//旁站监理开始时间
          lookEndTime: obj.lookEndTime,//旁站监理结束时间
          state: obj.state,//
          projectId: wx.getStorageSync("currentProjectId"),//
          content: obj.content,//施工内容
          problem: obj.problem,//发现及存在的问题
          rectification: obj.rectification,//整改意见
          dealResult: obj.updateTime,//处理结果
          remarks: obj.remarks,//备注
          projectManager: obj.projectManager,//项目经理
          projectManagerId: obj.projectManagerId,//项目经理Id
          qualityInspector: obj.qualityInspector,//质检员
          qualityInspectorId: obj.qualityInspectorId,//质检员id
          contractTime: obj.contractTime,//承包方时间
          supervisorTime: obj.supervisorTime,//承包方时间
          createTime: obj.createTime,//承包方时间
          updateTime: obj.updateTime,//承包方时间
        })
        
      }
    });

  },
  updatePangzhan: function () {
    let obj = this.data;
    let data = {
      id: obj.id,
      // projectId: wx.getStorageSync('currentProjectId'),//不需要才对
      weather: obj.weather,

    }
    let that = this;
    util.getDataByAjax({
      url: '/snJbjPzjl/update',
      method: "Post",
      data,
      success: function (res) {
        console.log(res);
        if (that.data.status == 1) {
          wx.showToast({
            title: '提交审核成功',
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 2000)

            }
          })
        } else {
          wx.showToast({
            title: '成功采集！',
            success: function () {
            }
          })
        }
      }
    });
  },
  // getShuiniTmpl: function () {
  //   let that = this;
  //   util.getDataByAjax({
  //     url: `/snJbjPzjlTemplate/list?pageIndex=1&pageSize=100`,
  //     method: "Post",
  //     data: {},
  //     success: function (res) {
  //       let tmpltNameList = ['请选择'];
  //       for (let i = 0; i < res.data.result.list.length; i++) {
  //         tmpltNameList.push(res.data.result.list[i].supplier);
  //       }
  //       that.setData({
  //         tmplList: res.data.result.list,
  //         tmpltNameList: tmpltNameList
  //       })
  //     }
  //   });
  // }, 
  getOrCreate: function () {
    let that = this;
    let obj = this.data;
    util.getDataByAjax({
      url: "/commonPzjl/add",
      method: "Post",
      data: {
        weather: obj.weather,//工程地址
        projectAddress: obj.projectAddress,//
        pzPart: obj.pzPart,//旁站部位
        building: obj.building,//楼栋号
        workProcedure: obj.workProcedure,//工序
        lookStartTime: obj.lookStartTime,//旁站监理开始时间
        lookEndTime: obj.lookEndTime,//旁站监理结束时间
        state: obj.state,//
        projectId: wx.getStorageSync("currentProjectId"),//
        content: obj.content,//施工内容
        problem: obj.problem,//发现及存在的问题
        rectification: obj.rectification,//整改意见
        dealResult: obj.updateTime,//处理结果
        remarks: obj.remarks,//备注
        projectManager: obj.projectManager,//项目经理
        projectManagerId: obj.projectManagerId,//项目经理Id
        qualityInspector: obj.qualityInspector,//质检员
        qualityInspectorId: obj.qualityInspectorId,//质检员id
        contractTime: obj.contractTime,//承包方时间
        supervisorTime: obj.supervisorTime,//承包方时间
        createTime: obj.createTime,//承包方时间
        updateTime: obj.updateTime,//承包方时间
      },
      success: function (res) {
          wx.showToast({
            title: '提交审核成功',
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 2000)

            }
          })
        
      },
      error: function () {
      }
    })
  },
  submitToCheck: function () {
    this.setData({
      status: 1
    })
    this.getOrCreate();
  }
})  