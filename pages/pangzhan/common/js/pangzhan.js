var app = getApp();
var util = require('../../../../utils/util.js')
const Toptips = require('../../../../components/toptips/index.js');

/**
 * 记录用户对旁站数据采集的操作
 */
function savaOperationLog (){
  let that = this;
  let data = {
    pangzhanId: that.data.pang.id,
    type: `000${app.globalData.currentPzIndex - 0 + 1}`,
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
    error: function () { console.log("记录用户对旁站数据采集的操作---失败"); }
  });
}
/**
 * 判断用户是否有修改权限
 */
function isAllowEdit() {
  let that = this;
  if (that.data.pang.status >= 3) {//3已完成状态
    if (app.globalData.isCanWriteAfterCheck) {
      Toptips("请到PC端修改");
    } else {
      Toptips("此旁站已确认无法修改");
    }
    return false;
  }
  if (app.globalData.isCanWrite) {
    return true;
  } else {
    Toptips("无修改权限");
    return false
  }
}

/**
 * 修改消息的状态
 */
function  setMsgStatus(id) {
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
}

/**
   * 确认完成
   */
function submitToCheck() {
  let that = this;
  let status;
  //1.确定更新内容
  if (that.data.pang.status == 1) {
    that.setData({
      ['pang.endTime']: new Date,
    })
    status = 2;
  } else if (that.data.pang.status == 2) {
    if (app.globalData.isCanCheck) {//有权验收
      status = 3;
    }
    if (app.globalData.isCanConfirm) {//有权确认
      status = 4;
    }
    if (app.globalData.isCanCheck && app.globalData.isCanConfirm) {
      status = 5;
    }
  } else if (that.data.pang.status == 3) {
    if (app.globalData.isCanConfirm) {//有权确认
      status = 5;
    }
  }
  else if (that.data.pang.status == 4) {
    if (app.globalData.isCanCheck) {//有权验收
      status = 5;
    }
  }
  that.setData({
    ['pang.superName']: app.globalData.roles[0].userName,
    ['pang.status']: status
  })
  //2.更新旁站
  that.updatePangzhan();

  //3.记录操作行为
  this.savaOperationLog();

  //4.返回上一页
  setTimeout(function () {
    wx.navigateBack({
      delta: -1
    })
  }, 2000)
}

function getOrCreate (url, okfn) {
  let that = this;
  if (!that.data.pang.pileCode) {
    return;
  }
  util.getDataByAjax({//--首页商品列表
    url,
    method: "Post",
    data: {
      projectId: app.globalData.project.id,
      buildingId: app.globalData.building.id - 0,
      pileCode: that.data.pang.pileCode - 0,
    },
    success: function (res) {
      let obj = res.data.result ? res.data.result : {};
      okfn && okfn(obj);
    },
    error: function () {

    }
  });
}
function updatePangzhan(url) {
  let that = this;
  if (!that.data.pang.status) {
    that.setData({
      ['pang.status']: 1,
      ['pang.startTime']: new Date,
      ['pang.projectName']: app.globalData.project.projectName
    })
  }
  let obj = that.data;
  let data = that.data.pang;
  // data.openTime = data.startTime;
  // data.stopTime = data.endTime;
  util.getDataByAjax({
    url,
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




// getPangzhanById: function(){
  //   let that = this;
  //   util.getDataByAjax({//--首页商品列表
  //     url: "/jxZkGzzPzjl/getJxZkGzzPzjl",
  //     method: "Get",
  //     data: {
  //       id: this.data.pangzhanId
  //     },
  //     success: function (res) {
  //       let obj = res.data.result ? res.data.result : {};
  //       that.setData({
  //         pang: obj,
  //         abc1: math.accSub(math.accAdd(obj.platformElevation, obj.designPileLength), (obj.pileTopHeight)),
  //         abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
  //         ecd: math.accSub(math.accAdd(obj.actualDeep, obj.pileTopHeight), (obj.platformElevation)),
  //         ['pang.actualDeepImg']: obj.actualDeepImg ? JSON.parse(obj.actualDeepImg) : [],
  //         ['pang.barCageCountImg']: obj.barCageCountImg ? JSON.parse(obj.barCageCountImg) : [],
  //         ['pang.deptRockUrl']: obj.deptRockUrl ? JSON.parse(obj.deptRockUrl) : [],
  //         // ['pang.mainBarNum']: obj.mainBar ? obj.mainBar.split('φ')[0] : null,
  //         // ['pang.mainBarType']: obj.mainBar ? obj.mainBar.split('φ')[1] : null,
  //         ['pang.fe']: math.accDiv(obj.actualVolume, obj.theoryVolume, 2)
  //       })

  //     },
  //     error: function () {

  //     }
  //   });
  // },












module.exports = {
  savaOperationLog,
  isAllowEdit,
  submitToCheck,
  getOrCreate,
  updatePangzhan
}
