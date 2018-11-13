function chooseImage() {
  let that = this;
  wx.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success(res) {
      if (res.tapIndex == 0) {
        that.compressImage("camera")
      } else if (res.tapIndex == 1) {
        that.compressImage("album")
      } else {
      }
    }
  })
}

module.exports = {
  chooseImage
}