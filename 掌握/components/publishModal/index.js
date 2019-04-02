let center = null
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
      value: false,
      observer(newValue,oldValue){
        if (newValue){
          center = setInterval(()=>{
            let num = this.random()
            let { number } = this.data
            let count = this.properties.count
            if (number + num >= count){
              this.setData({
                number: count
              })
              clearInterval(center)
            } else {
              this.setData({
                number: number + num
              })
            }
          },200)
        } else {
          clearInterval(center)
          this.setData({
            number: 0
          })
        }
      }
    },
    count:{
      type:Number
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
    number:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    container() {
      this.triggerEvent('container', {})
    },
    back() {
      this.triggerEvent('back', {})
    },
    certain() {
      this.triggerEvent('certain', {})
    },
    random(){
      return Math.floor(Math.random() * 10)
    }
  },

})