// pages/index/me/addrManage/newAddr/newAddr.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    region: "",
    isPicker: false,
    checked:false,
    type:0,
    focus: "false",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cart_id: options.cart_id || '',
      model_id: options.model_id || '',
      goods_id: options.goods_id || '',
      flag: options.flag || false,
    })
    console.log(this.data);
    
  },
  // 获取当前位置填充input框
  chooseLocation: function () {
    App.chooseLocation(this);
  },
  // 跳转到地址管理页
  // goAddrManage() {
  //   wx.redirectTo({
  //     url: '/pages/index/me/addrManage/addrManage',
  //   })
  // },
  // picker
  bindRegionChange: function (e) {
    // console.log(e);
    var that = this;
    that.setData({
      region: e.detail.value,
      isPicker: true,
    })
    // console.log(that.data.isPicker);
  },
  // 设置默认地址
  setDefaultAddr:function(){
    var that = this;
    that.setData({
      checked:!that.data.checked
    });
    console.log(that.data.checked);
    if (that.data.checked){
      that.setData({
        type: 1
      });
    }else{
      that.setData({
        type: 0
      });
    }
  },
  // 表单提交
  formSubmit: function(that, formData){
    var this_ = this;
    var token_id = App.globalData.meData.token_id;
    var income_people = formData.income_people;
    var phone = formData.phone;
    var province_name = that.data.region[0];
    var city_name = that.data.region[1];
    var county_name = that.data.region[2];
    var details = formData.details;
    var type = that.data.type
    var data = {
      token_id,
      income_people,
      phone,
      province_name,
      city_name,
      county_name,
      details,
      type
    };
    App.request(
      "site/add_site",
      "POST",
      data,
      function (res) {
        console.log(res);
        if (res.data.status == 1 && res.data.message == "成功") {
          wx.showToast({
            title: '新增成功',
            icon: "none",
            success:function(){
              // 跳转至地址详情页
              console.log(this_.data.flag);
              
              if (this_.data.flag == 'buyNow') {
                var goods_id = this_.data.goods_id;
                var model_id = this_.data.model_id;
                wx.redirectTo({
                  url: '/pages/index/buyNow/buyNow?goods_id=' + goods_id + '&model_id=' + model_id
                });
              } else if (this_.data.flag == 'checkOrder') {
                var cart_id = this_.data.cart_id;
                wx.redirectTo({
                  url: '/pages/index/checkOrder/checkOrder?cart_id=' + cart_id
                });
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        }else{
          wx.showToast({
            title: res.data.message,
            icon: "none"
          });
        }
      }
    );
  },
  // 表单验证
  formValidate: function (e) {
    var that = this;
    App.formValidate(e,that)
  },
})