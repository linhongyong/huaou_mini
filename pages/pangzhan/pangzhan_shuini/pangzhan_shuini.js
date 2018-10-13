
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

    pang:{
      tryDataUrl:[]
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
      minute: minute
    })
    // this.getShuiniTmpl();
    
    this.makeColonGlint(); 
    if (options.pileStartNum) {
      this.setData({
        ['pang.pileStartNum']: options.pileStartNum,
      })
      this.getOrCreate();
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
 * 监听模板变化
 */
  onPickerChangeOfTmpl: function (e) {
    if (e.detail.value == 0){
      return;
    }
    this.setData({
      currentTmpl: e.detail.value,
      templateId: this.data.tmplList[e.detail.value].id
    })
    this.getOrCreate();
    // this.updatePangzhan();
  },
  /**
   * 水灰比
   */
  onPickerChangeOfHjshProp: function (e) {
    // if (!this.data.pang.id) {
    //   wx.showToast({
    //     title: '旁站不存在',
    //   })
    //   return;
    // }
    console.log(e);
    let that = this;
    this.setData({
      // slurryProp: that.data.procedureList[e.detail.value],
      currentHjshPropList: e.detail.value
    })
    if (e.detail.value[0] != 0 && e.detail.value[1] != 0 && e.detail.value[1] != 0 ){
        this.setData({
          ['pang.hjshProp']: `${e.detail.value[0]},${e.detail.value[1]},${e.detail.value[2]}`
        })
    }else{
      wx.showToast({
        title: '数据错误',
      })
      return;
    }
    that.updatePangzhan();
  },
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
    // if (!this.data.pang.id) {
    //   wx.showToast({
    //     title: '旁站不存在',
    //   })
    //   return;
    // }
    let that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (e.currentTarget.dataset.index == "tryDataUrl") {
          let len1 = that.data.pang.tryDataUrl.length;
          let len2 = res.tempFilePaths.length;
          if (len2 > 8 - len1) {
            res.tempFilePaths.length = 9 - len1;
          }
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {

            that.setData({
              ['pang.tryDataUrl']: that.data.pang.tryDataUrl ? that.data.pang.tryDataUrl.concat(imgs) : imgs,
              // actualDeepImg:null
            })
          });
        }
      }
    })
  },
  updateImagesOrSave: function (e) {
    let that = this;
    console.log(e);
    if (e.currentTarget.dataset.index == "tryDataUrl") {
      if (that.data.pang.tryDataUrl.length > 0) {
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
    if (stepindex == "tryDataUrl") {//下钢筋笼
      that.data.pang.tryDataUrl.splice(index, 1);
      this.setData({
        ['pang.tryDataUrl']: that.data.pang.tryDataUrl
      })
    }
  }, 

  bindTimeChange: function (e) {
    // if (!this.data.pang.id) {
    //   wx.showToast({
    //     title: '旁站不存在',
    //   })
    //   return;
    // }
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

  // -----------------------------------------------------------------编辑框三个监听事件
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
      [isEdit]: false
    })
  },
  /**
   * 保存
   */
  onInputSave: function (e) {
    if (e.currentTarget.dataset.index == "pileStartNum"){

    }else{
      // if (!this.data.pang.id) {
      //   wx.showToast({
      //     title: '旁站不存在',
      //   })
      //   return;
      // }
    }
    let porp = `pang.${e.currentTarget.dataset.index}`
    let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`

    //为空时不设置
    if (!e.detail.value.value.trim()) {
      this.setData({
        [porp]: null,
        [isEdit]: false
      })
    } else {
      this.setData({
        [porp]: e.detail.value.value,
        [isEdit]: false
      })
    }
    if (e.currentTarget.dataset.index == "pileStartNum"){
      this.getOrCreate();
    }else{
      this.updatePangzhan();
    }
  },

  updatePangzhan: function () {
    let data = this.data.pang;
    let that = this;
    util.getDataByAjax({
      url: '/snJbjPzjl/update',
      method: "Post",
      data,
      success: function (res) {
        Toptips({
          duration: 1000,
          content: "成功采集！",
          backgroundColor: "#06A940"
        });
      }
    });
  },
  getShuiniTmpl: function(){
    let that = this;
    util.getDataByAjax({
      url: `/snJbjPzjlTemplate/list?pageIndex=1&pageSize=100`,
      method: "Post",
      data: {},
      success: function (res) {
        let tmpltNameList = ['请选择'];
        for (let i = 0; i < res.data.result.list.length; i++) {
          tmpltNameList.push(res.data.result.list[i].supplier);
        }
        that.setData({
          tmplList: res.data.result.list,
          tmpltNameList: tmpltNameList
        })
      }
    });
  },
  getOrCreate: function () {
    if (!this.data.pang.pileStartNum) {
      return;
    }
    let that = this;
    util.getDataByAjax({//--首页商品列表
      url: "/snJbjPzjl/add",
      method: "Post",
      data: {
        pileStartNum: that.data.pang.pileStartNum,
        projectId: wx.getStorageSync('currentProjectId'),
      },
      success: function (res) {
        let obj = res.data.result;
        that.setData({
          pang: res.data.result,
          ['pang.tryDataUrl']: obj.tryDataUrl ? JSON.parse(obj.tryDataUrl) : [],
          // ['pang.barCageCountImg']: obj.barCageCountImg ? JSON.parse(obj.barCageCountImg) : [],
          // ['pang.deptRockUrl']: obj.deptRockUrl ? JSON.parse(obj.deptRockUrl) : [],
        })
      },
      error: function () {

      }
    });
  },
})  