var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    mobile: '',
    code: '',
    password:'',
    passwordAgain:'',
    firstStep:true,

    second:5,
    selected:false,
  },
  getphone: function () {
    let that = this;
    let valueMobile = this.data.mobile;
    if (valueMobile){
      if (util.checkMobile(valueMobile)){
        util.request(api.ForgetPasswordGetCode + valueMobile, null, "POST")
        .then(function (res) {
        });
        that.setData({
          selected: true,
        })
        that.count(that);
      }
    }else{
      util.showErrorToast('请填写手机号码')
    }
   
  },
  count: function (that) {
    var second = that.data.second;

    if (second == 0) {
      that.setData({
        selected: false,
        second: 5,
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
   * 点击下一步
   */
  startNext: function () {
    let that = this;
    let valueMobile = this.data.mobile;
    let code = this.data.code;

    if (util.checkMobile(valueMobile)){
      if(code){
        util.request(api.ForgetPasswordNext + valueMobile + '/with/' + code, null, "GET")
          .then(function (res) {
            if (res.data == '验证码有效' && res.success == true ){
              that.setData({
                firstStep:false
              })
            }else{
              util.showErrorToast(res.data)
            }
          });
      }else{
        util.showErrorToast('请输入验证码')
      }
    }
  },
  /**
   * 点击确认修改密码
   */
  startNextNext: function () {
    let that = this;
    let valueMobile = this.data.mobile;
    let code = this.data.code;
    let password = this.data.password;
    let passwordAgain = this.data.passwordAgain;
    if (!password){
      util.showErrorToast('请输入密码')
    }else{
      if (!passwordAgain) {
        util.showErrorToast('请再次输入密码')
      }else{
        if (password != passwordAgain){
          util.showErrorToast('输入密码不一致')
        }else{
          util.request(api.ForgetPasswordCertion, {
            mobile: valueMobile,
            checknum: code,
            newPassword: password
          }, "POST")
            .then(function (res) {
              if (res.success == true) {
                wx.showToast({
                  title: '修改密码成功',
                });
                wx.removeStorageSync('lsuid');
                wx.removeStorageSync('uid');
                setTimeout(function(){
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                },1500)
              }
            });
        }
      }
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: '重置密码'
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
  startLogin: function(){
    var that = this;
  },

  bindMobileInput: function(e){
    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function(e){
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
  clearInput: function(e){
    switch (e.currentTarget.id){
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