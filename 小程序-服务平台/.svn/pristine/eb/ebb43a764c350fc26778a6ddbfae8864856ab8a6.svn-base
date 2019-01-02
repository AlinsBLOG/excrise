var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    id: 5,
    pageNo: 1,
    pageSize: 10,
    pageCount:0,
    currentSortType:'default', //默认综合排序
    currentSortOrder:'asc',
    params:{
      orderBySeqNo: true, //综合
      orderBySalesCount: false, //人气
      orderByPrice: false, //价格
      orderAsc: false, //是否升序
    },
    serveList:[],
    scrollTop: 0,
    scrollHeight: 0,
    hidden:true,
  },
  //获取服务列表
  getServeList: function () {
    wx.showLoading({
      title: '正在加载...',
    });
    let that = this;
    //加载服务商下面的服务
    util.request(api.QueryServeListByProvider + that.data.id + '?pageNo=' + that.data.pageNo + "&pageSize=" + that.data.pageSize, that.data.params, 'POST').then(function (res) {
      if (res.success === true) {
        var list = that.data.serveList;
        if (res.data) {
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i]);
          }
          that.setData({
            serveList: list,
            pageNo: that.data.pageNo + 1,
            pageCount: res.pageCount
          });
        }
        if (that.data.pageNo == res.pageCount){
          that.setData({
            hidden: false
          });
        }
      }
    });
    wx.hideLoading();
  },
  onLoad: function (options) {
    this.setData({
      id: ( options.id ? options.id:5 )
    })
    this.getServeList();
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
  //综合 人气 价格排序
  openSortFilter: function (event) {
    this.setData({
      serveList:[],
      pageNo:1
    })
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter': //人气
        this.setData({
          currentSortType: 'category',
          params: {
            orderBySeqNo: false, //综合
            orderBySalesCount: true, //人气
            orderByPrice: false, //价格
            orderAsc: false, //是否升序
          },
        });

        this.getServeList();
        break;
      case 'priceSort':  //价格
        let tmpSortOrder = 'asc';
        let tmpOrderAsc = false;
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
          tmpOrderAsc = true;
        }
        this.setData({
          currentSortType: 'price',
          currentSortOrder: tmpSortOrder,
          params: {
            orderBySeqNo: false, //综合
            orderBySalesCount: false, //人气
            orderByPrice: true, //价格
            orderAsc: tmpOrderAsc, //是否升序
          },
        });

        this.getServeList();
        break;
      default:
        //综合排序
        this.setData({
          currentSortType: 'default',
          params: {
            orderBySeqNo: true, //综合
            orderBySalesCount: false, //人气
            orderByPrice: false, //价格
            orderAsc: false, //是否升序
          },
        });
        this.getServeList();
    }
  },

  selectCategory: function(event){
    let currentIndex = event.target.dataset.categoryIndex;
    this.setData({
      'categoryFilter': false,
      'categoryId': this.data.filterCategory[currentIndex].id
    });
    this.getServeList();
  },

  //到底部加载
  bindDownLoad: function () {
    let that = this;
    if (that.data.pageNo <= that.data.pageCount){
      this.getServeList();
    }
  },
  // scroll: function (event) {
  //   //该方法绑定了页面滚动时的事件，记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  //   this.setData({
  //     scrollTop: event.detail.scrollTop
  //   });
  // },
})