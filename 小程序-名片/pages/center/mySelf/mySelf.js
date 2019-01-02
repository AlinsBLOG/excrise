const app = getApp();
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    globalImage: app.globalData.cardPhoto,
    defaultImage: app.globalData.defaultImage
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = util.checkUserId();
    this.setData({
      userInfo: user,
      globalImage: app.globalData.cardPhoto,
      defaultImage: app.globalData.defaultImage
    })
  },

  toLogin:function(){
    const user = util.checkUserId();
    if (!user.id){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  changeAccount:function(){
    wx.showModal({
      title: '确定更改账户?',
      success:function(e){
        if(e.confirm){
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
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
    this.setData({
      globalImage: app.globalData.cardPhoto,
      defaultImage: app.globalData.defaultImage
    })
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
  
  },

  /**
   * 进入到某个页面
   */
  toPage:function(e){
    const type = e.currentTarget.dataset.type;
    let url = '';
    if(type === 'hot'){
      url = '/pages/hotPage/hotPage';
    } else if (type == 'message'){
      url = '/pages/message/message';
    }
    wx.navigateTo({
      url: url
    })
  }
})