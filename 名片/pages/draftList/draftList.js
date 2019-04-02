const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardFolder: [],
    pageNo: 1,
    pageSize: 10,
    globalImage: app.globalData.cardPhoto
  },

  /**
 * 获取我的名片夹
 */
  myDraftList: function () {
    const user = util.checkUserId();
    const that = this;
    const { pageNo, pageSize } = that.data;
    util.request(api.myDraftList, {
      userId: user.id,
      pageNo: pageNo,
      pageSize: pageSize,
    }, 'GET').then(function (res) {
      if (res) {
        that.setData({
          cardFolder: res
        })
      }
      wx.setNavigationBarTitle({
        title: '草稿箱(' + (res ? res.length : 0) + ')',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myDraftList();
  },

  toIndexPage: function () {
    wx.redirectTo({
      url: '/pages/myCard/myCard',
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