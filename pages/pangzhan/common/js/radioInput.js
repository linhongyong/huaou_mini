var app = getApp();
var util = require('../../../../utils/util.js')
const Toptips = require('../../../../components/toptips/index.js');
/**
 * 天气选择
 */
function radioChangeOfWeather(e) {
  if (!this.isAllowEdit(this)) {
    return false
  };
  this.setData({
    ['pang.weather']: e.detail.value
  })
  this.updatePangzhan();
}

module.exports = {
  radioChangeOfWeather,

}
