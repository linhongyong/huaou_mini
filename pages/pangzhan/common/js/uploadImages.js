var app = getApp();
var util = require('../../../../utils/util.js')
const Toptips = require('../../../../components/toptips/index.js');
/**
  * 上传照片
  */
function uploadImages (e) {
  let that = this;
  if (!this.isAllowEdit(this)) {
    return false
  };
  wx.chooseImage({
    count: 6, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      let index = e.currentTarget.dataset.index;
      let len1;
      if (that.data.pang[index] && that.data.pang[index].length){
        len1 = that.data.pang[index].length;
      }else{
        len1 =0;
      }
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
}
function updateImagesOrSave( e) {
  let that = this;
  if (!this.isAllowEdit(that)) {
    return false
  };
  let index = e.currentTarget.dataset.index;
  if (that.data.pang[index].length > 0) {
    that.updatePangzhan();
  } else {
    // Toptips("照片不能为空");
    that.updatePangzhan();
  }
}
function deletePic(e) {
  let that = this;
  if (!this.isAllowEdit(that)) {
    return false
  };
  console.log(e);
  let index = e.currentTarget.dataset.index;
  let stepindex = e.currentTarget.dataset.stepindex;
  that.data.pang[stepindex].splice(index, 1);
  that.setData({
    ['pang.' + stepindex]: that.data.pang[stepindex]
  })
}
function preview (e) {
  let that = this;
  console.log(e);
  let index = e.currentTarget.dataset.index;
  wx.previewImage({
    current: that.data.tempFilePaths[index], // 当前显示图片的http链接
    urls: that.data.tempFilePaths // 需要预览的图片http链接列表
  })
}

module.exports = {
  uploadImages,
  updateImagesOrSave,
  deletePic,
  preview
}
