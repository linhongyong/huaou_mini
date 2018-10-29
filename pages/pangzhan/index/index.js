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
    // jxgzzList: [],
    // shuiniList: [],
    // tongyongList: [],
    // multiArray: [
    //   [],
    //   []
    // ],
    // multiIndex: [0, 0],
    pangzhanList: [],
    isShowLoading: true

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
    app.globalData.currentPzIndex = this.data.currentPzIndex;
    //返回后刷新//第一次的时候顺序问题不能调用
    if (app.globalData.isFirst) {
      app.globalData.isFirst = false;
    } else {
      this.getPangzhanList();
    }
    this.getUnreadNum();
  },

  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {
    // Toptips({
    //   duration: 2000,
    //   content: "刷新成功",
    //   backgroundColor: "#06A940"
    // });
    this.getRoles(this.getJoinedList)
  },
  onReachBottom: function() {
    console.log("eee");
  },
  onShareAppMessage: function() {},


  //------------------------------------------------------ff
  // 弹出/关闭菜单
  toggleLeftPopup() {
    this.setData({
      showLeftPopup: !this.data.showLeftPopup
    });
  },

  


  //切换项目 
  changeProject: function(e) {
    var index = e.detail.value;
    this.setData({
      currentProject: index
    })
    wx.setStorageSync("currentProject", this.data.projectList[index])
    wx.setStorageSync("currentProjectName", this.data.projectList[index].projectName)
    app.globalData.project = this.data.projectList[index];
    this.getRightsUnderProject();
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
    app.globalData.building = this.data.buildingList[index];
    wx.setStorageSync("currentBuildingId", this.data.buildingList[index].id)
    wx.setStorageSync("currentBuildingCode", this.data.buildingList[index].buildingCode)
    wx.setStorageSync("currentBuildingPileNum", this.data.buildingList[index].pileNum)
    this.getPangzhanList();
  },
  // 切换旁站
  changePangzhan: function(e) {
    var index = e.detail.value;
    //1.
    if (index>2) {
      Toptips({
        duration: 2000,
        content: "该旁站类型尚未开放",
      });
      return;
    }
    //2.
    wx.setStorageSync('currentPzIndex', index);
    this.setData({
      currentPzIndex: index
    })
    app.globalData.currentPzIndex = index;
    //3
    this.getPangzhanList();
  },


  onFormSubmit: function(e) {
    console.log(e);
    console.log("登录框");
    login.getUserInfo(e.detail.value);
  },
  toDetail: function(e) {
    let currentPzIndex = app.globalData.currentPzIndex;
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
  

  //------------------------------------------------------ff
  /**
   * 获得所属项目列表
   */
  getJoinedList: function() {
    let that = this;
    let url;
    if (app.globalData.isCanSeeAllProject){
      url = "/project/list"
    }else{
      url = "/project/getJoinedList"
    }
    util.getDataByAjax({
      url,
      method: "get",
      success: function(res) {
        // let projectNameList = [];
        // for (let i = 0; i < res.data.result.length; i++) {
        //   projectNameList.push(res.data.result[i].projectName);
        // }
        //初始化当前项目当前楼栋
        let storageProject = wx.getStorageSync("currentProject");
        // let storageProject = JSON.parse(temp ? temp : null);
        if (storageProject && storageProject.id && util.isExistPropOfObjInArray(res.data.result, "id", storageProject.id)){
          app.globalData.project = storageProject;
        }else{
          wx.setStorageSync("currentProject", res.data.result.length && res.data.result[0])
          wx.setStorageSync("currentProjectName", res.data.result.length && res.data.result[0].projectName)
          app.globalData.project = res.data.result[0];
        }
        
        that.getRightsUnderProject();
        that.getProjectStaffs();
        that.setData({
          projectList: res.data.result,
          // ['multiArray[0]']: projectNameList
        })
        if (!app.globalData.project.id) {
          this.setData({
            noProjects: true,
            isShowLoading: false
          })
          return;
        }
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
        projectId: app.globalData.project.id
      },
      success: function(res) {
        if (!res.data.result.length) {
          console.log("此项目没有人员信息")
        }
        that.setData({
          projectStaffs: res.data.result
        })
        let zhuanjian = [];
        for (let i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].roleName == "专监") {
            zhuanjian.push(res.data.result[i]);
          }
          if (res.data.result[i].roleName == "施工方") {
            zhuanjian.push(res.data.result[i]);//先放一起
          }
        }
        app.globalData.administrator = zhuanjian;
        console.log('globalData', app.globalData)
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
        projectId: app.globalData.project.id
      },
      success: function(res) {
        if (!res.data.result.length) {
          this.setData({
            nobuildings: true,
            isShowLoading: false
          })
          return;
        }
        let buildingCodeNameList = [];
        for (let i = 0; i < res.data.result.length; i++) {
          buildingCodeNameList.push(res.data.result[i].buildingCode);
        }
        that.setData({
          buildingList: res.data.result,
          // ['multiArray[1]']: buildingCodeNameList,
          currentBuildingIndex: 0
        })
        app.globalData.building = res.data.result[0];
        if (!app.globalData.building.pileNum){
          that.setData({
            noPiles: true,
            isShowLoading: false
          })
        }
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
    let currentPzIndex = app.globalData.currentPzIndex;
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
        let pangzhanList = [];//
        let pileCode;
        let pileNum = wx.getStorageSync("currentBuildingPileNum");
        //将所有桩和已创建的旁站数组进行二重循环，以此角色显示的颜色
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
            status: count == res.data.result.length ? 0 : status//
          })
        }
        //获得一键确认与验收的参数
        let idStatusForCheckByOneClick = [];
        let idStatusForConfirmByOneClick = [];
        res.data.result.forEach(function(item){
          if(item.status == 2){
            idStatusForCheckByOneClick.push({pangzhanId: item.id, status: 3})
            idStatusForConfirmByOneClick.push({ pangzhanId: item.id, status: 4 })
          }
          if (item.status == 3) {
            idStatusForConfirmByOneClick.push({ pangzhanId: item.id, status: 5 })
          }
          if (item.status == 4){
            idStatusForCheckByOneClick.push({ pangzhanId: item.id, status: 5 })
          }
        })
        console.log("获得一键确认与验收的参数");
        console.log(idStatusForCheckByOneClick);
        console.log(idStatusForConfirmByOneClick);
        that.setData({
          pangzhanList,
          idStatusForCheckByOneClick,
          idStatusForConfirmByOneClick,
          isShowLoading: false
        })
        
        if (app.globalData.isCanCheck && idStatusForCheckByOneClick.length > 0){//弹出一键验收按钮
          setTimeout(function(){
            Dialog({
              title: '一键验收',
              message: `你有${idStatusForCheckByOneClick.length}条旁站需要验收\n是否一键完成验收`,
              selector: '#zan-base-dialog',
              showCancelButton: true
            }).then(() => {
              console.log('=== dialog resolve ===', 'type: 一键验收');
              that.checkOrConfirmByOneClick("check");
            }).catch(() => {
              console.log('=== dialog reject ===', 'type: cancel');
            });
          },2000)
          
        }
        if (app.globalData.isCanConfirm && idStatusForConfirmByOneClick.length > 0) {//弹出一键确认按钮
          setTimeout(function () {
            Dialog({
              title: '一键确认',
              message: `你有${idStatusForConfirmByOneClick.length}条旁站需要确认\n是否一键完成确认`,
              selector: '#zan-base-dialog2',
              showCancelButton: true
            }).then(() => {
              console.log('=== dialog resolve ===', 'type: 一键确认');
              that.checkOrConfirmByOneClick("confirm");
            }).catch(() => {
              console.log('=== dialog reject ===', 'type: cancel');
            });
          }, 2000)
        }
      },
      error: function() {}
    });
  },
  checkOrConfirmByOneClick: function(type){
    console.log("一键类型", type)
    let that = this;
    let pangZhanStatusParams = [];
    if (type == "confirm") pangZhanStatusParams = that.data.idStatusForConfirmByOneClick;
    if (type == "check") pangZhanStatusParams = that.data.idStatusForCheckByOneClick;
    util.getDataByAjax({
      url: '/pangzhan/changeStatusByOneClick',
      method: "post",
      data: {
        pzType: `000${app.globalData.currentPzIndex-0+1}`,
        pangZhanStatusParams,
      },
      success: function (res) {
        Toptips({
          duration: 2000,
          content: "操作成功",
          backgroundColor: "#06A940"
        });
        that.getPangzhanList();//更新旁站
      },
      error: function (error) {
        console.log(error);
      },
    });
  },
  // 获得用户拥有的角色信息
  getRoles: function (okfn) {
    let that = this;
    util.getDataByAjax({ //
      url: '/user/getRoles',
      method: "Get",
      success: function (res) {
        console.log('角色',res)
        // wx.setStorageSync("roles", res.data.result);
        app.globalData.roles = res.data.result;
        app.globalData.roles.forEach(function(elem){
          if (elem.roleName == '老板' || elem.roleName == '贵宾') {
            app.globalData.isCanSeeAllProject = true
          }
        })
        okfn && okfn();
      },
      error: function () { }
    });
  },
  getRightsUnderProject: function () {//项目角色在这里设置，非项目角色不是
    if (!app.globalData.project || !app.globalData.project.id){
      return false;
    }
    app.globalData.projectRoleNames = [];
    for (let i = 0; i < app.globalData.roles.length; i++){
      if (app.globalData.roles[i].projectId == app.globalData.project.id){
        app.globalData.projectRoleNames.push(app.globalData.roles[i].roleName) 
      }
    }
    console.log("app.globalData.projectRoleNames----- ");
    console.log(app.globalData.projectRoleNames);
    if (util.isExistInArray(app.globalData.projectRoleNames, "专监")){
      app.globalData.isCanCheck = true; 
      app.globalData.isCanWrite = true;
    }
    if (util.isExistInArray(app.globalData.projectRoleNames, "监理员")) {
      app.globalData.isCanWrite = true;
    }
    if (util.isExistInArray(app.globalData.projectRoleNames, "总监")) {
      app.globalData.isCanWriteAfterCheck = true; 
    }
    if (util.isExistInArray(app.globalData.projectRoleNames, "施工方")) {
      app.globalData.isCanConfirm = true;
    }
  },

  /**
   * 获得当前项目下的旁站
   */
  //------------------------------------------------------ff3
  getPageContentData: function() { //登录后才能获取的数据写在这里
    this.getRoles(this.getJoinedList)
    this.getUserInfo();
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
  },
  toMsg: function(){
    wx.switchTab({
      url: '../../mine/msg/msg',
    })
  },
  getUnreadNum: function () {
    let that = this;
    util.getDataByAjax({
      url: '/message/getUnreadNum',
      method: "get",
      data: {},
      success: function (res) {
        that.setData({
          unreadNum: res.data.result
        })
        console.log(res)
      },
      error: function (error) {
        console.log(error);
      },
    });
  },
  getUserInfo() {//获得用户数据库信息
    let that = this;
    util.getDataByAjax({
      url: '/user/getUserLogin',
      method: "get",
      success: function (res) {
        app.globalData.userInfo = res.data.result
      },
      error: function (error) {
        console.log(error);
      },
    });
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

})