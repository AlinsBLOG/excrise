var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:5,
    pageNo: 1,
    pageSize: 5,
    providerDetails:{},
    backgroundImgUrl:'',
    serveList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      id: (options.id ? options.id : '5')
    });
    wx.showLoading({
      title: '正在加载...',
    })
    //加载服务商信息
    util.request(api.ProviderDetails + that.data.id + "/detail").then(function (res) {
      if (res.success === true) {
        that.setData({
          providerDetails: res.data,
          backgroundImgUrl: (res.data.backgroundImgUrl ? res.data.backgroundImgUrl :'../../static/images/company-bg1.png')
        });
      }
    });
    //加载服务商下面的服务
    util.request(api.QueryServeListByProvider + that.data.id + '?pageNo=' + that.data.pageNo + "&pageSize=" + that.data.pageSize, {},'POST').then(function (res) {
      if (res.success === true) {
        that.setData({
          serveList:res.data
        })
      }
    });
    wx.hideLoading();
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