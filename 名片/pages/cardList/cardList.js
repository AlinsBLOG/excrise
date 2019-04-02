const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardFolder:[],
    globalImage: app.globalData.cardPhoto,
    userName: '',
    pageNo: 1,
    pageSize:10,
    request: true,
  },

  /**
 * 获取我的名片夹
 */
  myContactList: function () {
    const that = this;
    const userId = util.checkUserId().id;
    let { pageNo, pageSize, request, cardFolder, userName } = this.data;

    if (request){
      wx.showNavigationBarLoading();
      util.request(api.myContactList, {
        userId,
        pageNo,
        pageSize,
        userName,
      }, 'GET').then(function (res) {
        if (res) {
          res.map(function (item) {
            cardFolder.push(item)
          })
          that.setData({
            cardFolder: cardFolder,
            pageNo: pageNo + 1
          })
          if (res.length < 10) {
            that.setData({
              request: false
            })
          }
        }else{
          that.setData({
            cardFolder: cardFolder,
            request: false
          })
        }
        wx.setNavigationBarTitle({
          title: '名片夹(' + (res ? res.length : 0) + ')',
        })
        util.stop();
      })
    }
  },

  confirm: function (e) {
    const value = e.detail.value;
    this.setData({
      userName: value,
      pageNo: 1,
      cardFolder: [],
      request: true
    })
    this.myContactList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myContactList();
  },

  toIndexPage:function(){
    wx.redirectTo({
      url: '/pages/myCard/myCard',
    })
  },

  toLogin: function () {
    wx.redirectTo({
      url: '/pages/login/login',
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
    const user = util.checkUserId();
    const that = this;
    if(user){
      that.setData({
        user: user
      })
    }
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
    this.setData({
      cardFolder: [],
      pageNo: 1,
      pageSize: 10,
      request: true,
    })
    this.myContactList();
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