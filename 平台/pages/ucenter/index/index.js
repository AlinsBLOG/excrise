var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    name: '点击进去登录',
    avatarImg: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png',
    type: 'logout',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {

  },
  onShow: function () {
    // let userInfo = wx.getStorageSync('userInfo');
    // let token = wx.getStorageSync('token');
    // 页面显示
    // if (userInfo && token) {
    //   app.globalData.userInfo = userInfo;
    //   app.globalData.token = token;
    // }
    user.checkLoginWithJson(this);

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  //用户登录
  goLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
    return;
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
        image: '../../../static/images/zan.png',
        duration: 1500,
        mask: true,
      })
    });
  },
  exitLogin: function () {
    const that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('lsuid');
          wx.removeStorageSync('uid');
          that.setData({
            name: '点击进去登录',
            avatarImg: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png',
            type: 'logout',
          })
          // wx.switchTab({
          //   url: '/pages/index/index'
          // });
        }
      }
    })
  },
  goToMyOrder: function (e) {
    const value = e.target.dataset.value;
    if (user.checkLogin()){
      const id = user.checkLogin().id;
      let url = '';
      if (value == "myorder"){
        url = '/pages/orderCenter/orderCenter?id=' + id;
     }else{
        url = '/pages/serveCenter/serveCenter?id=' + id;
     }
      wx.navigateTo({
        url: url
      })
    }
  }
})