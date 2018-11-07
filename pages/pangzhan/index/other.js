var app = getApp();
// var util = require('../../../../utils/util.js')
// const Toptips = require('../../../../components/toptips/index.js');

function getCurRange() {
  //如果桩没有分页就直接返回false
  if (!this.data.rangeColumnList.length){
    return false
  }
  if (this.data.curRange >= 0){
    return true;
  }else{
    let localCurRange = wx.getStorageSync("curRange") - 0;
    this.setData({
      curRange: localCurRange>=0 ? localCurRange : 0
    })
    
  }
  return true;
}
function setCurRange(value) {
  console.log(value)
  this.setData({
    curRange: value
  })
  wx.setStorageSync("curRange", value)
}
function getRangeColumnList(){
  this.setCurRange(-1);
  if (!this.data.currentBuilding.pileNum){
    console.log("当前楼栋下没有桩")
    this.setData({
      rangeColumnList: []
    })
    wx.removeStorageSync("curRange")
    return
  }
  let pileNum = this.data.currentBuilding.pileNum
  let rangeColumnList = [];
  if (pileNum>300){
    let len = parseInt(pileNum / 300);
    let i;
    for ( i= 0; i<len; i++){
      if(i==0){
        rangeColumnList.push(300)
      }else{
        rangeColumnList.push(rangeColumnList[i-1]+300)
      }
    }
    if (pileNum % 300 > 0){
      rangeColumnList.push((pileNum % 300) + rangeColumnList[i - 1])
    }
    this.setData({
      rangeColumnList
    })
  }else{
    this.setData({
      rangeColumnList: [pileNum]
    })
  }
  console.log(rangeColumnList)
 }

module.exports = {
  getCurRange,
  setCurRange,
  getRangeColumnList
}
