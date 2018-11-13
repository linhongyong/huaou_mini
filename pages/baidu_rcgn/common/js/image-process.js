
function chooseImage(sourceType) {
  return new Promise((resolve, reject) =>{
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [sourceType],
      success(res) {
        resolve(res.tempFilePaths)
        // const tempFilePaths = res.tempFilePaths
      }
    })
  })
}
// function compressImage(){
//   // chooseImage().then(tempFilePaths => {
//     wx.compressImage({
//       src: "https://csbucket.oss-cn-shanghai.aliyuncs.com/huaou/e129ab86-2bb5-4b04-be07-25f659016fc3.png", // 图片路径
//       quality: 5, // 压缩质量
//       success: function(){
//         console.log("压缩ok")
//       }
//     })
//   // })
// }
function image2base64(url) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        resolve(res.data)
      }
    })
  })
}
module.exports = {
  chooseImage,
  image2base64
}