var app = getApp();
var util = require('../../../../utils/util.js')
const Toptips = require('../../../../components/toptips/index.js');

function makeColonGlint() {
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
}
/**
   * 获得时间
   * case index,表示顺序序号
   */
function getTime(e) {
  if (!this.isAllowEdit(this)) {
    return false
  };
  let prop = `pang.${e.currentTarget.dataset.index}`
  this.setData({
    [prop]: util.formatTime(new Date())
  })
  // return;
  this.updatePangzhan();
}

function bindTimeChange(e) {
  if (!this.isAllowEdit(this)) {
    return false
  };
  let whichTime = e.currentTarget.dataset.index
  console.log("whichTime", whichTime);
  if (!this.data.pang[whichTime]) {
    console.log("时间字段出错", this.data.pang[whichTime]);
    return;
  }
  let data = this.data.pang[whichTime].split(' ')[0] + " " + e.detail.value + ":00";
  this.setData({
    [`pang.${whichTime}`]: data
  })
  console.log('picker发送选择改变，携带值为', e.detail.value, this.data.pang[whichTime]);
  this.updatePangzhan();
}


module.exports = {
  makeColonGlint,
  getTime,
  bindTimeChange,
}
