// pages/index/me/addrManage/addrManage.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrDetail: [],
    showLoading:true,
    // checked:false,//默认是未选中
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goods_id: options.goods_id || '',
      model_id: options.model_id || '',
    })
  },
  onShow: function () {
    this.getUserAddrList();
  },

  // 修改默认地址
  change:function(e){
  },
  // 编辑地址
  goEditAddr(e) {
    wx.navigateTo({
      url: `/pages/index/me/addrManage/editAddr/editAddr?id=${e.currentTarget.dataset.id}`
    })
  },
  // 跳转到新增地址
  goNewAddr() {
    wx.navigateTo({
      url: '/pages/index/me/addrManage/newAddr/newAddr',
    })
  },
  // 跳转到订单页
  goBuyNow(e) {
    var income_people = e.currentTarget.dataset.text.income_people;
    var phone = e.currentTarget.dataset.text.phone;
    var province_name = e.currentTarget.dataset.text.province_name;
    var city_name = e.currentTarget.dataset.text.city_name;
    var county_name = e.currentTarget.dataset.text.county_name;
    var details = e.currentTarget.dataset.text.details;
    var site_id = e.currentTarget.dataset.text.id;
    var pages = getCurrentPages();//当前页面
    var prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      income_people,
      phone,
      province_name,
      city_name,
      county_name,
      details,
      site_id
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
  // 获取用户地址列表
  getUserAddrList: function () {
    var that = this;
    var token_id = App.globalData.meData.token_id;
    console.log(token_id);
    var data = {
      token_id: token_id
    };
    App.request(
      'site/user_site',
      'POST',
      data,
      function (res) {
        if (res.data.data.length != 0) {
          that.setData({
            isAddr: true,
            addrDetail: res.data.data,
            showLoading:false,
          });
        }else{
          that.setData({
            isAddr: false,
            addrDetail: res.data.data,
            showLoading:false,
          });
        }
      })
  },
})
