var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    mobile: '',
    code: '',
    password: '',
    passwordAgain: '',

    second: 60,
    selected: false,
  },
  getphone: function () {
    let that = this;
    let valueMobile = this.data.mobile;
    if (valueMobile) {
      if (util.checkMobile(valueMobile)) {
        util.request(api.IsAccountExists, { mobile: valueMobile}, "GET")
          .then(function (res) {
            if(res.success === true && res.data === true){
              util.showErrorToast('手机号已被注册')
            }else{
              util.request(api.RegisterCode + valueMobile, null, "POST")
                .then(function (data) {
                })
              that.setData({
                selected: true,
              })
              that.count(that);
            }
          });
      }
    } else {
      util.showErrorToast('请填写手机号码')
    }

  },
  count: function (that) {
    var second = that.data.second;
    if (second == 0) {
      that.setData({
        selected: false,
        second: 60,
      });
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      that.count(that);
    }, 1000)
  },
  /**
   * 点击确认注册
   */
  register: function () {
    let that = this;
    let valueMobile = this.data.mobile;
    let code = this.data.code;
    let password = this.data.password;
    let passwordAgain = this.data.passwordAgain;
    if (valueMobile) {
      if (!util.checkMobile(valueMobile)){
        return
      }
    } else {
      util.showErrorToast('请填写手机号码')
      return
    }
    if (!code) {
      util.showErrorToast('请输入验证码')
      return
    }
    if (!password) {
      util.showErrorToast('请输入密码')
      return
    } else {
      if (!passwordAgain) {
        util.showErrorToast('请再次输入密码')
        return
      } else {
        if (password != passwordAgain) {
          util.showErrorToast('输入密码不一致')
          return
        } else {
          util.request(api.Register, {
            mobile: valueMobile,
            password: password,
            checknum: code
          }, "POST")
            .then(function (res) {
              if (res.success == true) {
                wx.showToast({
                  title: '注册成功'
                });
               setTimeout(function(){
                 wx.reLaunch({
                   url: '/pages/login/login'
                 })
               },1500)
              }else{
                util.showErrorToast(res.message)
              }
            });
        }
      }
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '欢迎注册'
    })

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  startLogin: function () {
    var that = this;
  },

  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  bindPasswordAgainInput: function (e) {
    this.setData({
      passwordAgain: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-passwordAgain':
        this.setData({
          passwordAgain: ''
        });
        break;
    }
  }
})