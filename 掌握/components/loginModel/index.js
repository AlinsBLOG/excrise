// components/loginModel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time:String,
    isTieUp:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    phoneNum:'',
    codeNum:'',
    isTieUp:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit: function(e) {
      var that = this
      var phone = this.data.phoneNum
      var data = {
        mobile: phone
      }
      this.triggerEvent('getCode',data)
    },
    // 手机号部分
    inputPhoneNum: function (e) {
      let phoneNum = e.detail.value
      if (phoneNum.length === 11) {
        let checkedNum = this.checkPhoneNum(phoneNum)
        if (checkedNum) {
          this.setData({
            phoneNum: phoneNum
          })
        }
      } else {
        this.setData({
          phoneNum: '手机号不正确'
        })

      }
    },
    inputCodeNum: function (e) {
      let codeNum = e.detail.value
      this.setData({
        codeNum
      })
    },
    goback: function () {
      this.setData({
        isTieUp: false
      })
    },
    ready(){
      this.setData({
        isTieUp: this.properties.isTieUp
      })
    },
    verify(){
      var that = this
      var mobile = this.data.phoneNum
      var mobile_code = this.data.codeNum
      this.triggerEvent('verify', {
        mobile,
        mobile_code
      })
    }
  }
})
