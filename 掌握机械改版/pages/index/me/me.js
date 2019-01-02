const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad: function() {
    //用户信息
    this.getStart()
  },

  onShow(){
    this.getStart()
  },

  getStart(){
    const userInfo = util.getStorageSync('userInfo');
    const registerInfo = util.getStorageSync('registerInfo');
    const image = '../../../images/icons/me/logo.png';
    if (userInfo) {
      this.setData({
        userInfo,
        registerInfo,
        avatarImg: (userInfo.avatarImg ? userInfo.avatarImg : image),
        nickName: userInfo.nickName
      })
    } else {
      this.setData({
        avatarImg: image,
        nickName: '马上登陆',
        userInfo:null,
        registerInfo:{}
      })
    }
  },

  close(){
    const that = this
    wx.showModal({
      content: '你正在退出登陆，点击确认退出',
      success:function(e){
        if (e.confirm){
          wx.removeStorage({
            key: 'registerInfo',
            success: function (res) {
              wx.removeStorage({
                key: 'userInfo',
                success: function (res) {
                  that.getStart()
                }
              })
            }
          })
        }
      }
    })
  },

  callTelphone: function(e) {
    var data = e.currentTarget.dataset.text
    wx.makePhoneCall({
      phoneNumber: data
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '掌窝工程机械，找挖机配件上掌窝',
      path: '/pages/index/index',
      imageUrl: '/images/icons/index/500.png',
      success: function(res) {
        
      }
    }
  },

  toMyOrder: function(e) {
    var current = e.currentTarget.dataset.current;
    if (App.globalData.isLogin) {
      wx.navigateTo({
        url: `/pages/index/me/myOrder/myOrder?currentTab=${current}&flag=true`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 员工管理
  toEmplManage() {
    const userInfo = util.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '你还没有登陆',
        icon:'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/me/emplManage/emplManage',
      })
    }
  },
  // 我的询价
  goMyInquiry(e) {
    if (this.checkLogin()){
      const currentType = e.currentTarget.dataset.type
      wx.navigateTo({
        url: `/pages/index/me/myInquriy/myInquriy?type=${currentType}`,
      })
    }
  },
  login(){
    const userInfo = util.getStorageSync('userInfo')
    if (!userInfo){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/me/editMe/editMe',
      })
    }
  },
  checkLogin(){
    const userInfo = util.getStorageSync('userInfo')
    if (!userInfo){
      wx.showModal({
        content: '你还没有登陆',
        success:function(e){
          if(e.confirm){
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
      return false
    }
    return true
  }
})