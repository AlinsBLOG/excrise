var city = require("../../utils/city.js"),
    r = city.vsupa_get_children_district;

Component({
  properties: {
    show: {
      type:Boolean,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.show()
        } else {
          this.hide()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData:null,
    show:false,
    cityData: [],
    value: [0, 0, 0]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    catchTouch: function () {
      return
    },
    showOrHide: function () {
      if (this.data.show) {
        this.animation.translateY(0).step()
      } else {
        this.animation.translateY('100%').step()
      }
      this.setData({
        animationData: this.animation.export()
      })
    },
    show:function () {
      this.setData({
        show:true
      })
      this.showOrHide()
    },
    hide:function () {
      this.setData({
        show: false
      })
      this.showOrHide()
    },
    open () {
      let data = []
      const cityData = this.data.cityData
      const value = this.data.value
      data.push({
        label: cityData[value[0]].label,
        value: cityData[value[0]].value
      })
      data.push({
        label: cityData[value[0]].children[value[1]].label,
        value: cityData[value[0]].children[value[1]].value
      })
      data.push({
        label: cityData[value[0]].children[value[1]].children[value[2]].label,
        value: cityData[value[0]].children[value[1]].children[value[2]].value
      })
      this.triggerEvent('certain', data)
    },
    cityPickerChange: function (event) {
      var e = this.data.cityData,
          t = this.data.value,
          i = event.detail.value;
      if (t[0] !== i[0]){
        e[i[0]].children = r(e[i[0]].value)
        e[i[0]].children[i[1]].children = r(e[i[0]].children[i[1]].value)
        this.setData({
          value: [i[0], 0, 0]
        })
      }
      if (t[1] !== i[1]){
        e[i[0]].children[i[1]].children = r(e[i[0]].children[i[1]].value)
        this.setData({
          value: [i[0], i[1], 0]
        })
      }
      if (t[2] !== i[2]){
        this.setData({
          value: [i[0], i[1], i[2]]
        })
      }
      this.setData({
        cityData: e
      })
    },
  },
  created: function () {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
  },
  ready:function () {
    const show = this.properties.show
    this.setData({
      show
    })
    var t = [], 
        o = r();
        o[0].children = r(o[0].value), 
        o[0].children[0].children = r(o[0].children[0].value),
        t = o;
    this.setData({
      cityData: t
    })
  }
})
