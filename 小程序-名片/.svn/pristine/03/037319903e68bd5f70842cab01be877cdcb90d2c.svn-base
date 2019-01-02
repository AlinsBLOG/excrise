const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginType:false,
    account:'',
    password:'',
    mobile:'',
    code:'',
    selected:false,
    second:60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '验证码登录',
    })
  },

  loginCertain:function(){
    const that = this;
    const loginType = this.data.loginType;
    const account = this.data.account;
    const password = this.data.password;
    const mobile = this.data.mobile;
    const code = this.data.code;
    if (loginType){
      if (account){
        if (util.checkMobile(account) || util.checkEmail(account)){
          if (!password){
            util.showErrorToast('请输入密码')
            return
          }
        }else{
          util.showErrorToast('账户格式不正确')
          return
        }
      }else{
        util.showErrorToast('请输入账户')
        return
      }
    }else{
      if(mobile){
        if (util.checkMobile(mobile)){
          if(!code){
            util.showErrorToast('请输入验证码')
            return
          }
        }else{
          util.showErrorToast('手机格式不正确')
          return
        }
      }else{
        util.showErrorToast('请填写手机号码')
        return
      }
    }

    wx.showLoading({
      title: '登陆中...',
    })
    //请求登录
    util.request(api.loginMobile + '?mobile=' + mobile + '&verifyCode=' + code, {},'POST').then(function (res) {
      wx.setStorageSync('user', JSON.stringify(res))
      wx.hideLoading();
      util.reloadBfeorePage();
    })
  },

  tapGetCode:function(){
    const mobile = this.data.mobile;
    const that = this;
    if(mobile){
      if (util.checkMobile(mobile)){
        wx.showLoading({
          title: '正在发送短信...',
        })
        that.setData({
          selected: true
        })
        that.count(that);
        util.request(api.getCheckCode+'/'+mobile,{},'POST').then(function(res){
          wx.hideLoading();
        })
      }else{
        util.showErrorToast('手机号码不正确')
        return
      }
    }else{
      util.showErrorToast('请输入手机号码')
      return
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

  loginTypeAction:function(){
    const loginType = this.data.loginType;
    let title = '';
    if (loginType){
      title = '验证码登录';
    }else{
      title = '账户登录';
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      loginType: !loginType
    })
  },

  inputChange:function(e){
    const name = e.target.dataset.name;
    const value = e.detail.value;
    this.setData({
      [name]:value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})