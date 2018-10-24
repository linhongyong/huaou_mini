var util = require('../../../utils/util.js')
const Dialog = require('../../../components/dialog/dialog');
const Toptips = require('../../../components/toptips/index.js');
var login = require('../../../utils/login.js');
let app = getApp();
Page({
  data: {
    projectList: [],
    currentProject: 0,
    pangzhanType:[
      '机械灌注桩',
      '水泥搅拌桩',
      '预应力管桩',
      '混泥土浇筑',
      '塔吊安装',
    ],
    pangzhanList: [],
    multiArray: [
      [],
      []
    ],
    multiIndex: [0, 0],
    jxgzzList: [],
    shuiniList: [],
    tongyongList: [],
    height:667
  },
  onLoad: function(options) {

    if (!util.isAuthorize()) {
      return; //弹出授权框
    } else {
      console.log("授权登录");
      login.getUserInfo();
    }
  },
  onShow: function() {
    this.setData({
      currentPzIndex: wx.getStorageSync("currentPzIndex")
    })

    //返回后刷新
    if (app.globalData.isFirst) {
      app.globalData.isFirst = false;
    } else {
      this.getPangzhanList();
    }
  },

  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},


  //------------------------------------------------------ff
  // 弹出/关闭菜单
  toggleLeftPopup() {
    this.setData({
      showLeftPopup: !this.data.showLeftPopup
    });
  },

  /**
   * 项目切换
   */
  // bindMultiPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     multiIndex: e.detail.value,
  //     currentBuildingIndex: e.detail.value[1]
  //   })
  //   wx.setStorageSync("currentBuildingId", this.data.buildingList.length && this.data.buildingList[e.detail.value[1]].id)
  //   wx.setStorageSync("currentBuildingCode", this.data.buildingList.length && this.data.buildingList[e.detail.value[1]].buildingCode)
  //   wx.setStorageSync("currentBuildingPileNum", this.data.buildingList.length && this.data.buildingList[e.detail.value[1]].pileNum)
  //   this.getPangzhanList();
  // },

  // bindMultiPickerColumnChange: function (e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   switch (e.detail.column) {
  //     case 0:
  //       wx.setStorageSync("currentProjectId", this.data.projectList[e.detail.value].id)
  //       wx.setStorageSync("currentProjectName", this.data.projectList[e.detail.value].projectName)
  //       this.getBuildingList();
  //       this.getProjectStaffs();
  //       this.getPangzhanList();

  //       break;
  //   }
  // },


  //切换项目 
  changeProject: function(e) {
    var index = e.detail.value;
    this.setData({
      currentProject: index
    })
    wx.setStorageSync("currentProjectId", this.data.projectList[index].id)
    wx.setStorageSync("currentProjectName", this.data.projectList[index].projectName)
    app.globalData.project = this.data.projectList[index];
    this.getBuildingList();
    this.getProjectStaffs();
    this.getPangzhanList();
  },
  // 切换楼栋
  changeBuilding: function(e) {
    var index = e.detail.value;
    this.setData({
      currentBuildingIndex: index,
    })
    wx.setStorageSync("currentBuildingId", this.data.buildingList[index].id)
    wx.setStorageSync("currentBuildingCode", this.data.buildingList[index].buildingCode)
    wx.setStorageSync("currentBuildingPileNum", this.data.buildingList[index].pileNum)
    this.getPangzhanList();
  },
  // 切换旁站
  changePangzhan: function(e) {
    var index = e.detail.value;
    var oldIndex = this.data.currentPzIndex;
    if (index>2) {
      this.setData({
        currentPzIndex: oldIndex
      })
      Toptips({
        duration: 2000,
        content: "该旁站类型尚未开放",
      });
      return;
    }
    wx.setStorageSync('currentPzIndex', index);
    this.setData({
      currentPzIndex: index
    })
    this.getPangzhanList();
  },


  onFormSubmit: function(e) {
    console.log(e);
    console.log("登录框");
    login.getUserInfo(e.detail.value);
  },
  toDetail: function(e) {
    let currentPzIndex = wx.getStorageSync("currentPzIndex");
    let pileCode = this.data.pangzhanList[e.currentTarget.dataset.index].pileCode;
    if (currentPzIndex == 0) {
      wx.navigateTo({
        url: `../pangzhan_jxgzz/pangzhan_jxgzz?pileCode=${pileCode}`,
      })
    } else if (currentPzIndex == 1) {
      wx.navigateTo({
        url: `../pangzhan_shuini/pangzhan_shuini?pileCode=${pileCode}`,
      })
    } else if (currentPzIndex == 2) {
      wx.navigateTo({
        url: `../pangzhan_yylgz/pangzhan_yylgz?pileCode=${pileCode}`,
      })
    }
  },
  /**
   * 显示新增菜单
   */
  // showAddMenu: function(){
  //   Dialog({
  //     title: '添加旁站',
  //     message: '选择旁站类型',
  //     selector: '#zan-vertical-dialog',
  //     buttonsShowVertical: true,
  //     buttons: [{
  //       text: '机械灌注桩',
  //       type: '1'
  //     }, {
  //         text: '水泥旁站',
  //       type: '2'
  //     },{
  //       text: '预应力管桩',
  //       type: '3',
  //     }, {
  //       text: '通用旁站',
  //       type: '4',
  //     }, {
  //       text: '取消',
  //       type: 'cancel'
  //     }]
  //   }).then(({ type }) => {
  //     console.log('=== dialog with vertical buttons ===', `type: ${type}`);
  //     if (type == 1){
  //       wx.navigateTo({
  //         url: '../pangzhan_jxgzz/pangzhan_jxgzz',
  //       })
  //     } else if (type == 2){
  //       wx.navigateTo({
  //         url: '../pangzhan_shuini/pangzhan_shuini',
  //       })
  //     } else if (type == 3){
  //       wx.navigateTo({
  //         url: '../pangzhan_yylgz/pangzhan_yylgz',
  //       })
  //     } else if (type == 4) {
  //       wx.navigateTo({
  //         url: '../pangzhan_tongyong/pangzhan_tongyong',
  //       })
  //     }
  //   });
  // },

  //------------------------------------------------------ff
  /**
   * 获得所属项目列表
   */
  getJoinedList: function() {
    let that = this;
    util.getDataByAjax({
      url: "/project/getJoinedList",
      method: "Get",
      success: function(res) {
        let projectNameList = [];
        for (let i = 0; i < res.data.result.length; i++) {
          projectNameList.push(res.data.result[i].projectName);
        }
        //初始化当前项目当前楼栋
        wx.setStorageSync("currentProjectId", res.data.result.length && res.data.result[0].id)
        wx.setStorageSync("currentProjectName", res.data.result.length && res.data.result[0].projectName)
        app.globalData.project = res.data.result[0];
        that.getProjectStaffs();
        that.setData({
          projectList: res.data.result,
          ['multiArray[0]']: projectNameList
        })
        that.getBuildingList();
      },
      error: function() {}
    });
  },
  /**
   * 获得项目人员信息
   */
  getProjectStaffs: function() {
    let that = this;
    util.getDataByAjax({
      url: "/project/getStaffs",
      method: "Get",
      data: {
        projectId: wx.getStorageSync('currentProjectId')
      },
      success: function(res) {
        // if (!res.data.result.length) {
        //   Toptips({
        //     duration: 2000,
        //     content: "该项目暂无人员信息",
        //   });
        //   return;
        // }
        that.setData({
          projectStaffs: res.data.result
        })
        let zongjian = [],
          shigongfang = [];
        for (let i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].roleName == "总监") {
            zongjian.push(res.data.result[i]);
          }
          if (res.data.result[i].roleName == "施工方") {
            shigongfang.push(res.data.result[i]);
          }
        }
        wx.setStorageSync('zongjian', zongjian);
        app.globalData.administrator = zongjian;
        console.log('globalData', app.globalData)
        wx.setStorageSync('shigongfang', shigongfang);
      },
      error: function() {}
    });
  },
  /**
   * 获得项目的楼栋列表信息
   */
  getBuildingList: function() {
    let that = this;
    util.getDataByAjax({ //--首页商品列表
      url: "/project/getBuildingList",
      method: "Get",
      data: {
        projectId: wx.getStorageSync('currentProjectId')
      },
      success: function(res) {
        if (!res.data.result.length) {
          Toptips({
            duration: 2000,
            content: "该项目暂无楼栋信息",
          });

          return;
        }
        let buildingCodeNameList = [];
        for (let i = 0; i < res.data.result.length; i++) {
          buildingCodeNameList.push(res.data.result[i].buildingCode);
        }
        that.setData({
          buildingList: res.data.result,
          ['multiArray[1]']: buildingCodeNameList,
          currentBuildingIndex: 0
        })
        wx.setStorageSync("currentBuildingId", res.data.result.length > 0 && res.data.result[0].id)
        wx.setStorageSync("currentBuildingCode", res.data.result.length > 0 && res.data.result[0].buildingCode)
        wx.setStorageSync("currentBuildingPileNum", res.data.result.length > 0 && res.data.result[0].pileNum)
        that.getPangzhanList();

      },
      error: function() {}
    });
  },
  getPangzhanList: function() {
    let that = this;
    let currentPzIndex = wx.getStorageSync("currentPzIndex");
    let url;
    if (currentPzIndex == 0) {
      url = "/building/jxgzzProgress";
    } else if (currentPzIndex == 1) {
      url = "/building/snjbzProgress";
    } else if (currentPzIndex == 2) {
      url = "/building/yylgzProgress";
    } else {
      Toptips({
        duration: 2000,
        content: "该旁站类型尚未开放",
      });
      return;
    }
    util.getDataByAjax({ //
      url,
      method: "Get",
      data: {
        buildingId: wx.getStorageSync('currentBuildingId')
      },
      success: function(res) {
        let pangzhanList = [];
        let pileCode;
        let pileNum = wx.getStorageSync("currentBuildingPileNum");
        for (pileCode = 1; pileCode <= pileNum; pileCode++) {
          let count = 0;
          let status;
          for (let j = 0; j < res.data.result.length; j++) {
            if (pileCode == res.data.result[j].pileCode) {
              status = res.data.result[j].status
              break;
            }
            count++;
          }
          pangzhanList.push({
            pileCode,
            status: count == res.data.result.length ? 0 : status
          })
        }
        that.setData({
          pangzhanList
        })
      },
      error: function() {}
    });
  },

  // 获得角色信息
  getRoles: function () {
    let that = this;
    util.getDataByAjax({ //
      url: '/user/getRoles',
      method: "Get",
      success: function (res) {
        console.log('角色',res)
        wx.setStorageSync("roles", res.data.result);
      },
      error: function () { }
    });
  },


  /**
   * 获得当前项目下的旁站
   */
  //------------------------------------------------------ff3
  getPageContentData: function() { //登录后才能获取的数据写在这里
    this.getJoinedList();
    this.getRoles()
  },
  // util调用
  showAuthorizeDialog: function() { //未授权点击其他调用
    var that = this;
    Dialog({
      logo: "../res/" + util.logo,
      title: util.appName,
      message: '授权登录后才能正常使用!',
      selector: '#zan-button-dialog',
      buttons: [{
          text: '以后再说',
          color: 'red',
          type: 'cancel'
        },
        {
          text: '授权登录',
          openType: "getUserInfo",
          color: '#3CC51F',
          type: 'confirm',

        }
      ]
    }).then(({
      type
    }) => {
      // console.log(type);
    });
  },
  getuserinfo: function(e) { //手动授权
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorageSync("isAuthorize", true);
      console.log("授权的登录")
      login.getUserInfo();
    } else {
      wx.setStorageSync("isAuthorize", false);
    }
  },
  onLogin: function(res) { //监听登录
    if (res.data.code == "Success") {
      console.log("登录成功");
      this.setData({
        isHasAccount: false
      })
      // Toptips({
      //   duration: 2000,
      //   content: "授权成功",
      //   backgroundColor: "#06A940"
      // });
      wx.setStorageSync("token", res.data.result);
      this.getPageContentData();
    } else {
      this.setData({
        isHasAccount: true
      })
      Toptips({
        duration: 2000,
        content: res.data.message,
      });
    }
  }
})