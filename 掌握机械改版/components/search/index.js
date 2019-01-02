Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    images: Array,
    value:{
      type:String,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.setData({
            value: newVal
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value:''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindconfirm(e){
      const value = e.detail.value
      this.triggerEvent('confirm', { value })
    },
    //清空value
    emptyStr(){
      this.setData({
        value: ''
      })
      this.triggerEvent('empty')
    },
    bindinput(e){
      const value = e.detail.value
      this.setData({
        value
      })
    }
  }
})
