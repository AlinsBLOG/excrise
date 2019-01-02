var city = require("../../utils/city.js"),
  r = city.vsupa_get_district_path;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    code:{
      type:String,
      observer:function(code){
        if (!code) return
        let str = ''
        let obj = r(code)
        if (obj.provinceName) {
          str += obj.provinceName + ' '
        }

        if (obj.cityName) {
          str += obj.cityName + ' '
        }

        if (obj.countyName) {
          str += obj.countyName + ' '
        }
        this.setData({
          str
        })
      }
    },
    className:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    str:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },
  ready(){
    
  }
})
