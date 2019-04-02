var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
    const that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          util.request("https://api.weixin.qq.com/sns/jscode2session", {
            js_code: res.code,
            appid: 'wx7f6ca4924c61b2b1',
            grant_type: 'authorization_code',
            secret: '233b9ec51a8f841ca708e0a466bc1ece'
          }, 'GET').then(function (response) {
            console.log(response)
            that.globalData.openId = response.openid
          })
        }
      }
    });
  },
  
  globalData: {
    // userInfo: {
    //   nickName: '点击进去登录',
    //   username: '点击去登录',
    //   avatarImg: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    // },
    accessToken: '',
    openId:'',
    appCode:'',
    baseUrl:'',
    switchTabId:{
      
    },
  }

})