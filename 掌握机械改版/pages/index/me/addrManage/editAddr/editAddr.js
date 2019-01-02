// pages/addrManage/editAddr/editAddr.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    region: "",
    isPicker: false,
    showLoading: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getAddrForId(this.data.id)
  },
  // 定位
  chooseLocation: function () {
    App.chooseLocation(this);
  },
  // 根据id获取用户地址渲染
  getAddrForId: function (id) {
    var that = this;
    var token_id = App.globalData.meData.token_id;
    var id = id;
    var data = {
      token_id,
      id
    };
    App.request(
      'site/one_site',
      'POST',
      data,
      function (res) {
        if (res.data.status == 1 && res.data.message == "成功") {
          that.setData({
            addrDetail: res.data.data,
            region: [res.data.data.province_name, res.data.data.city_name, res.data.data.county_name],
            showLoading: false,
          });
        }
      })

  },
  // 表单提交
  formSubmit: (that, formData) => {
    var token_id = App.globalData.meData.token_id;
    var income_people = formData.income_people;
    var phone = formData.phone;
    var province_name = that.data.region[0];
    var city_name = that.data.region[1];
    var county_name = that.data.region[2];
    var details = formData.details;
    var id = that.data.id;
    var type = that.data.addrDetail.type;
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
      function (res) {
        if (res.data.status == 1 && res.data.message == "成功") {
          wx.showToast({
            title: '操作成功',
            icon: "none",
            success: function () {
              // 跳转至地址详情页
              that.goAddrManage()
            }
          });
        }
      }
    );
  },
  // 表单验证
  formValidate: function (e) {
    var that = this;
    App.formValidate(e, that)
  },
  // picker
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      isPicker: true,
    })
    // ==================重复待提取优化============================
  },
  // 编辑成功跳转到地址管理页
  goAddrManage() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 设为默认地址
  setDefault: function (e) {
    var d_type = "addrDetail.type";
    var type = this.data.addrDetail.type;
    type = type == "0" ? 1 : 0;
    this.setData({
      [d_type]: type
    });
  }
})