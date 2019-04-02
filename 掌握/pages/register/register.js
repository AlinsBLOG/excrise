const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    password:'',
    code:'',
    selected:false,
    second:60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  emptyStr(){
    this.setData({
      mobile:'',
      mobileTrue:false
    })
  },

  loginCertain:function(){
    const mobile = this.data.mobile;
    const password = this.data.password;
    const code = this.data.code;
    const that = this;
    if (!mobile) {
      util.showErrorToast('请输入手机号码')
      return
    } else {
      if (util.checkPhoneNum(mobile)) {
        if (!password) {
          util.showErrorToast('请输入密码')
          return
        }
        if (!code) {
          util.showErrorToast('请输入验证码')
          return
        }
        wx.showLoading({
          title: '正在注册...',
        })
        //请求登录
        util.request(api.register , {
          checkNum: code,
          mobile,
          password,
          tenantId: App.globalData.tenantId
        }, 'POST').then(function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          })
          setTimeout(function(){
            util.reloadBfeorePage()
          },800)
        })
      } else {
        return
      }
    }
  },

  tapGetCode:function(){
    const mobile = this.data.mobile;
    const password = this.data.password;
    const code = this.data.code;
    const that = this;
    if (!mobile){
      util.showErrorToast('请输入手机号码')
      return
    } else {
      if (util.checkPhoneNum(mobile)) {
        wx.showLoading({
          title: '正在发送短信...',
        })
        that.setData({
          selected: true
        })
        util.request(api.getCheckCode, { mobile },'GET').then(function(res){
          that.count(that);
          wx.hideLoading();
        })
      } else {
        return
      }
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

  inputChange:function(e){
    const name = e.target.dataset.name;
    const value = e.detail.value;
    if (name == 'mobile'){
      if (/^[1|9][3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
        this.setData({
          mobileTrue:true
        })
      } else {
        this.setData({
          mobileTrue: false
        })
      }
    }
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