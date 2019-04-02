const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    rollingBanners: [],
    categories: [],
    marketingProviders: [],
    marketingProdBoards:[]
  },
  onShareAppMessage: function () {
    return {
      title: 'i51c.com',
      desc: '爱无忧创平台',
      path: '/pages/index/index'
    }
  },
  getIndexData: function () {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.success === true) {
        let arr = [];
        res.data.categories.map(function(item){
          return item.children.map(function (subItem){
            if (arr.length <= 8){
              arr.push(subItem)
            }
          })
        })
        arr.push(
          { children: null, id: 10, name: "全部分类", parentId: null, selectedFlag: 0 }
        )
        that.setData({
          categories: arr, //服务分类
        });
      }
      wx.hideLoading();
    });
    util.request(api.Advertisement, { adTypes:'banner'}).then(function (res) {
      if (res.success === true) {
        that.setData({
          rollingBanners: res.data.banner //顶部广告
        });
      }
      wx.hideLoading();
    });

    util.request(api.CommonServe).then(function (res) {
      if (res.success === true) {
        that.setData({
          marketingProdBoards: res.data //常用服务
        })
      }
      wx.hideLoading();
    });

    util.request(api.HotProvider).then(function (res) {
      if (res.success === true) {
        that.setData({
          marketingProviders: res.data, //热门服务商
        })
      }
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.getIndexData();
    // wx.switchTab({
    //   url: '/pages/ucenter/index/index',
    // })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  switchTab: function (event) {
    app.globalData.switchTabId = event.currentTarget.dataset;
    wx.switchTab({
      url: '/pages/catalog/catalog',
    })
  }
})
