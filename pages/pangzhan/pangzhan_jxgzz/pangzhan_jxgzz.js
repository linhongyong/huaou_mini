
var util = require('../../../utils/util.js')
var math = require('../../../utils/math.js')
const Toptips = require('../../../components/toptips/index.js');
const pangzhan = require('../common/js/pangzhan.js')
const uploadImages = require('../common/js/uploadImages.js')
const textInput = require('../common/js/textInput.js')
const time = require('../common/js/time.js')
const radio = require('../common/js/radioInput.js')
var app = getApp();
Page({
  data: {
    
    isColonShow : false,
    currentSedimentHeight: 0,
    sedimentHeightList: ['请选择', 40, 45, 50, 80, 90, 100, 280, 290, 300],

    currentSlurryProp: 0,
    slurryPropList: ['请选择', 1.1, 1.2,1.3],

    currentActualSlump:0,
    actualSlumpList: ['请选择', 180, 190, 200, 210, 220],
    pang:{
    },
    tempImagesOfCage: [],
    tempImagesOfHoleDepth: [],
    result:{
      barCageCount: 2,
    },
    updatePangzhanUrl: '/jxZkGzzPzjl/update'
  },
  onLoad: function (options) {
    Object.assign(this, pangzhan, uploadImages, textInput, time, radio)
    this.pangzhanOnLoad();
    
    if (options.pileCode){
      this.setData({
        ['pang.pileCode']: options.pileCode,
      })
      this.getOrCreate("/jxZkGzzPzjl/add", this.afterGetOrCreate);
    }
    
  },
  onShow: function () {

  },

  onReady: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },


  /**
   * 保存
   */
  onInputSave: function (e) {
    this.onInputSaveBefore(e);

    //负号检测是否正确,平台标高，桩顶标高
    if (e.currentTarget.dataset.index == 'platformElevation' || e.currentTarget.dataset.index == 'pileTopHeight') {
      if (isNaN(e.detail.value.value)) {
        Toptips("符号错误");
        return;
      }
    }
    let obj = this.data.pang;
    // 公式计算1
    if (e.currentTarget.dataset.index == 'platformElevation' || e.currentTarget.dataset.index == 'designPileLength' || e.currentTarget.dataset.index == 'pileTopHeight' ){
      this.setData({
        abc1: math.accSub(math.accAdd(obj.platformElevation, obj.designPileLength), obj.pileTopHeight),
        abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
      })
    }
    // 公式计算2
    if (e.currentTarget.dataset.index == 'actualDeep' || e.currentTarget.dataset.index == 'pileTopHeight' || e.currentTarget.dataset.index == 'platformElevation' ){
      this.setData({
        ecd: math.accSub(math.accAdd(obj.actualDeep, obj.pileTopHeight), (obj.platformElevation)),
      })
    }
    // 充盈系数
    if (e.currentTarget.dataset.index == 'actualVolume' || e.currentTarget.dataset.index == 'theoryVolume') {
      this.setData({
        ['pang.fe']: math.accDiv(obj.actualVolume, obj.theoryVolume, 2)
      })
    } 
    // 成渣厚度
    if (e.currentTarget.dataset.index == 'actualDeep' || e.currentTarget.dataset.index == 'secondActualDeep') {
      this.setData({
        chengZhaHouDu: math.accSub(obj.actualDeep, obj.secondActualDeep) * 1000
      })
    } 
    this.savaOperationLog(e.currentTarget.dataset.index);
    this.updatePangzhan();
  },

  afterGetOrCreate: function (obj) {
      this.setData({
        pang: obj,
        abc1: math.accSub(math.accAdd(obj.platformElevation, obj.designPileLength), (obj.pileTopHeight)),
        abc2: math.accSub(math.accSub(obj.platformElevation, obj.pileTopHeight), 0.5),
        ecd: math.accSub(math.accAdd(obj.actualDeep, obj.pileTopHeight), (obj.platformElevation)),
        ['pang.actualDeepImg']: obj.actualDeepImg ? JSON.parse(obj.actualDeepImg) : [],
        ['pang.barCageCountImg']: obj.barCageCountImg ? JSON.parse(obj.barCageCountImg) : [],
        ['pang.deptRockUrl']: obj.deptRockUrl ? JSON.parse(obj.deptRockUrl) : [],
        ['pang.fe']: math.accDiv(obj.actualVolume, obj.theoryVolume, 2),
        chengZhaHouDu: math.accSub(obj.actualDeep, obj.secondActualDeep) * 1000
      })
    // })
  }
  
})  
  
  