const Storage_Key = 'recordList';
const Component_Id_Selector = '#cpt-record-list';

Component({
  externalClasses: ['icon-delete'],
  data:{
    recordList:null,
  },
  properties: {
  },
  attached: function () {//组件生命周期函数，在组件实例进入页面节点树时执行
    var recordList = wx.getStorageSync(Storage_Key).split(";");
    (recordList[0] == "") && (recordList = []); //防止没有记录的时候有一个""记录
    this.setData({
      recordList
    })
  },
  methods: {
    deleteRecordList: function(){
      wx.removeStorageSync(Storage_Key);
      this.setData({
        recordList:[]
      })
    },
    getItem: function(e) {
      console.log(e);
      this.triggerEvent("eSearchByRecord", { value: e.target.dataset.keyword });
    }
  }
});
function updateRecordList(word) {
  console.log(word);
  const pages = getCurrentPages();
  const ctx = pages[pages.length - 1];
  const $recordList = ctx.selectComponent(Component_Id_Selector);
  console.log($recordList);

  let recordList = wx.getStorageSync(Storage_Key)
  if (recordList) {
    let recordListArray = recordList.split(";");
    for (var i = 0; i < recordListArray.length; i++) {
      if (recordListArray[i] == word) {
        return;
      }
    }
    recordList += ";" + word
  } else {
    recordList = word
  }
  wx.setStorageSync(Storage_Key, recordList)

  let recordListArray2 = getRecordListArrayFromStorage();

  $recordList.setData({
    recordList: recordListArray2
  });
}

function getRecordListArrayFromStorage(){
  let array = wx.getStorageSync(Storage_Key).split(";");
  (array[0] == "") && (array = []); 
  return array;
}

// function excludeRepetition(word){
//   let array = getRecordListArrayFromStorage()
//   if (array.length) {
//     for (var i = 0; i < array.length; i++) {
//       if (array[i] == word) {
//         return false;
//       }
//     }
//     recordList += ";" + word
//   } else {
//     recordList = word
//   }

//   wx.setStorageSync(Storage_Key, recordList)
// }
module.exports = updateRecordList;
