Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    imgSrc: {
      type: String,
      value: './images/kaixin@3x.png'
    },
    titleText: {
      type: String,
      value: ''
    },
    contentText: {
      type: String,
      value: ''
    },
    cancelBtn: {
      type: Boolean,
      value: true
    },
    cancelBtnText: {
      type: String,
      value: '取消'
    },
    certainBtn: {
      type: Boolean,
      value: true
    },
    certainBtnText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click() {
      this.triggerEvent('click', {})
    },
    cancel() {
      this.triggerEvent('cancel', {})
    },
    certain() {
      this.triggerEvent('certain', {})
    }
  },

})