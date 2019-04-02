const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();

Page({
  data: {
    serviceList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function (res) {
        if(res.success === true){
          that.setData({
            serviceList: res.data, //第一级服务分类
            currentCategory: res.data[0],
            categoryList: res.data[0],
          });
          that.getCurrent();
        }else{
          wx.showToast({
            title: '请求出错！请稍后重试！',
          })
        }
        wx.hideLoading();
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let that = this;
    // 页面显示
    this.getCurrent();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    app.globalData.switchTabId = event.currentTarget.dataset;
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    } else {
      that.data.serviceList.forEach(function(item){
        if (item.id == event.currentTarget.dataset.id){
          that.setData({
            categoryList: item,
            currentCategory:item
          });
          console.log(that.data.categoryList)
        }
      })
    }
    // this.getCurrentCategory(event.currentTarget.dataset.id);
  },
  getCurrent: function () {
    let that = this;
    let obj = app.globalData.switchTabId;
    if(obj.id){
      that.switch(obj)
    }
  },
  switch: function (obj) {
    var that = this;
    that.data.serviceList.forEach(function (item) {
      if (item.id == obj.parentid) {
        that.setData({
          categoryList: item,
          currentCategory: item
        });
      }
    })
  },
})