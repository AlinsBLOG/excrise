var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var tcity = require("../template/city.js");
let vsupa_get_children_district = tcity.vsupa_get_children_district;

var app = getApp();

Page({
  data: {
    id: '',
    brand: {},
    goodsList: [],
    pageNo: 1,
    pageSize: 8,
    pageCount:0,

    cityCode:null,
    scrollTop: 0,
    scrollHeight: '818r',
    alreadyGetAll:false,

    cityData:[],
    value: [0, 0, 0],
    values:[0, 0, 0],
    condition: false
  },
  onLoad: function (options) {
    const that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.showLoading({
      title: '加载中...',
    })

    let allPro = vsupa_get_children_district();
    allPro[0].children = vsupa_get_children_district(allPro[0].value);
    that.setData({
      id: options.id ? options.id:12,
      cityData: allPro
    });

    this.getBrand();
    this.getGoodsList(); //查询归类目录下的服务商品
  },
  getBrand: function () {
    let that = this;
    util.request(api.BrandDetail + this.data.id +'/detail').then(function (res) {
      if (res.success === true) {
        that.setData({
          brand: res.data //指定商品归类的详细信息
        });
      }
    });
  },
  getGoodsList() {
    var that = this;
    util.request(api.GoodsList + this.data.id + '?pageNo=' + this.data.pageNo + '&pageSize=' + this.data.pageSize, {
      cityCode: that.data.cityCode
    }, 'POST')
      .then(function (res) {
        if (res.success === true) {
          if (res.data) {
            let list = that.data.goodsList.concat(res.data);
            that.setData({
              goodsList: list,
              pageNo: that.data.pageNo + 1,
              pageCount: res.pageCount,
            });
          } else {
            that.setData({
              alreadyGetAll: true,
            });
          }
        }
        wx.hideLoading()
      });
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
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
  //到底部加载
  bindDownLoad: function () {
    if (this.data.pageNo <= this.data.pageCount){
      this.getGoodsList();
    }
  },
  // scroll: function (event) {
  // //该方法绑定了页面滚动时的事件，记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  //   this.setData({
  //     scrollTop: event.detail.scrollTop
  //   });
  // },

  cityPickerChange: function (e) {
    let cityData = this.data.cityData;
    let value = this.data.value;
    let val = e.detail.value;
    
    if (value[0] !== val[0]){
      cityData[val[0]].children = vsupa_get_children_district(cityData[val[0]].value);
    }
    this.setData({
      value: val,
      cityData: cityData
    })

  },
  open: function (e) {
    const type = e.target.dataset.click;
    const that = this;
    this.setData({
      condition: !this.data.condition,
      values: that.data.value,
    })
    if (type == 'certion'){
      that.setData({
        cityCode: that.data.cityData[that.data.value[0]].children[that.data.value[1]].value,
        pageNo: 1,
        goodsList:[]
      });
      that.getGoodsList();
    }
  },
})