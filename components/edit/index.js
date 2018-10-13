
var util = require('../../utils/util.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  data: {
    nodes: [{ type: "view", value: "" }],
    activeNodeIndex: 0,
    imgs: []
  },
  methods:{
    onfocus: function (e) {
      this.setData({
        activeNodeIndex: e.currentTarget.dataset.index
      })
    },
    oninput: function (e) {
      let temp = `nodes[${this.data.activeNodeIndex}].value`;
      this.setData({
        [temp]: e.detail.value
      })
    },  
    onlinechange: function (e) {
    },
    deletePic: function (e) {
      let index = e.currentTarget.dataset.index;
      let that = this;
      that.data.nodes.splice(index, 1);
      this.setData({
        nodes: that.data.nodes
      })
    },
    uploadImg: function () {
      let that = this;
      wx.chooseImage({
        count: 6, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          util.uploadImgPromises(res.tempFilePaths, function (imgs) {
            for (let i = 0, len = imgs.length; i < len; i++) {
              that.data.imgs.push(imgs[i]);
              that.data.nodes.push({
                type: "img",
                value: imgs[i]
              })
            }
            that.data.nodes.push({
              type: "view",
              value: ""
            })
            that.setData({
              nodes: that.data.nodes,
              imgs: that.data.imgs,
              activeNodeIndex: that.data.nodes.length - 1
            })
          });

        }
      })
    },
    formSubmit:function(e){
    }
  }
});
