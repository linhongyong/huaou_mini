var app = getApp();
var util = require('../../../../utils/util.js')
const Toptips = require('../../../../components/toptips/index.js');

/**edit
  * 切换成可编辑状态
  */
function toEdit(e) {
  if (!this.isAllowEdit(this)) {
    return false
  };
  let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
  this.setData({
    [isEdit]: true
  })
  return;

}
/**
 * 取消编辑状态
 */
function toDone(e) {
  let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
  this.setData({
    [isEdit]: false
  })
}
/**
 * 保存
 */
function onInputSaveBefore(e) {
  let that = this;
  //为空时不设置
  let porp = `pang.${e.currentTarget.dataset.index}`
  let isEdit = `pang.is${e.currentTarget.dataset.index}Edit`
  if (!e.detail.value.value.trim()) {
    that.setData({
      [porp]: null,
      [isEdit]: false
    })
    return;
  } else {
    that.setData({
      [porp]: e.detail.value.value,
      [isEdit]: false
    })
  }
 
}


module.exports = {
  toEdit,
  toDone,
  onInputSaveBefore,
}
