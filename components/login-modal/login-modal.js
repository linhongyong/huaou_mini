var util = require('../../utils/util.js');
var login = require('../../utils/login.js');
var app = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    _stateChange: function (newVal, oldVal){
      
    },
    toggleModal: function () {
      console.log("toggleModal");
      let that = this;
      this.setData({
        isShow: !that.properties.isShow
      })
    },
    onGetUserInfo: function(){
      login.login();
    }
  }

  


})