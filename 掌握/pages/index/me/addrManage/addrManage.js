// pages/index/me/addrManage/addrManage.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrDetail: [],
    showLoading: true,
    isAddr: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    this.getUserAddrList();
  },
  // 修改默认地址
  change: function (e) {
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
        console.log(res);
        if (res.data.data.length != 0) {
          that.setData({
            isAddr: true,
            addrDetail: res.data.data,
            showLoading: false,
          });
        } else {
          that.setData({
            isAddr: false,
            addrDetail: res.data.data,
            showLoading: false,
          });
        }
      })
  },
  // 删除地址modal
  delAddr: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该地址吗？',
      confirmColor: "#f05b29",
      success: function (res) {
        // 用户点击确定
        if (res.confirm) {
          that.delAddrForId(id)//调用删除接口
        }
      }
    })
  },
  // 根据id删除用户地址
  delAddrForId: function (id) {
    var that = this;
    var data = {
      token_id: App.globalData.meData.token_id,
      id: id
    };
    App.request(
      'site/del_site',
      'POST',
      data,
      function (res) {
        wx.showToast({
          title: '删除成功',
          duration: 500,
        })
        that.getUserAddrList()
      })
  },
  // 点击设置默认地址
  setDefault: function (e) {
    var that = this;
    var token_id = App.globalData.meData.token_id;
    var addrDetail = this.data.addrDetail
    var index = Number(e.currentTarget.dataset.index);
    var type = e.currentTarget.dataset.type;
    type = type == "0" ? 1 : 0;
    addrDetail.forEach((v, i) => {
      if (v.type == 1) {
        v.type = 0
      };
    })
    addrDetail[index].type = type;
    this.setData({
      addrDetail,
    });
    var { id, income_people, phone, province_name, city_name, county_name, details } = that.data.addrDetail[index];
    var data = {
      token_id,
      income_people,
      phone,
      province_name,
      city_name,
      county_name,
      details,
      type,
      id
    };
    App.request(
      "site/edit_site",
      "POST",
      data,
    );
  }

})
