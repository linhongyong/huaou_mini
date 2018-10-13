Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    state: {
      type: String,
      value: "hidden",
      observer: "_stateChange"
    },
    height:{
      type:Number,
      value:800,
      observer: "_heightChange"
    }
  },
  data: {
    // 这里是一些组件内部数据
    maskVisual: 'hidden',
    height:800
  },
  methods: {
    _stateChange: function (newVal, oldVal){
      this.setData({
        maskVisual: newVal
      })
      var height = this.data.height;
      if (newVal == 'show'){
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease-in-out',
        });
        this.animation = animation;
        animation.translateY(-height).step();
        this.setData({
          animationData: this.animation.export(),
        });
      }else{
        this.animation.translateY(height).step();
        this.setData({
          animationData: this.animation.export(),
        });
      }
    },
    toggleDiv: function () {
      if (this.properties.state == 'hidden') {
        this.setData({
          maskVisual: 'show',
        })
      } else {
        this.setData({
          maskVisual: 'hidden',
        })
      }
      var height = this.data.height;
      this.animation.translateY(height).step();
      this.setData({
        animationData: this.animation.export(),
      });
    },
  },
  _heightChange(newVal){
    var height = Number.parseInt(newVal);
    this.setData({
      height
    })
  }
})