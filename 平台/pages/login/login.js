// pages/login/login.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    tips:'帐号或者密码错误'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /**
   * 点击登录进行表单验证
   */
  formSubmit: function (e) {
    let that =this;
    let OBJ = e.detail.value;
    if (!OBJ.username){
      that.setData({
        hidden: false,
        tips: '帐号不能为空'
      })
      return;
    };
    if (!OBJ.password){
      that.setData({
        hidden: false,
        tips: '密码不能为空'
      })
      return;
    };
    if (OBJ.username && OBJ.password){
      wx.showLoading({
        title: '请稍后...',
      })
      util.request(api.Login, OBJ, "POST").then(function (res) {
        if (res.success === true) {
          wx.showLoading({
            title: '正在登陆...',
          })
          that.setData({
            hidden: true
          })
          try {
            let uid = res.header["Set-Cookie"].split(';')[2].split(',')[1];

            wx.setStorageSync('lsuid', JSON.stringify(res.data));
            wx.setStorageSync('uid', uid);
          } catch (e) {}
          wx.reLaunch({
            url: '/pages/index/index',
          })
          wx.showToast({
            title: '登录成功',
          })
        }else{
          that.setData({
            hidden: false,
            tips: res.message
          })
          wx,wx.hideLoading();
        }
      });
    }
  },
  /**
   * 一键微信登录
   */
  loginByWeixin: function () {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      // console.log(err)
      wx.showToast({
        title: '自动登录失败',
        image: '../../static/images/icon_error.png',
        duration: 1500,
        mask: true,
      })
    });
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