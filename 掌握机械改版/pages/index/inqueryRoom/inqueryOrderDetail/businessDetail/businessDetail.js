const util = require('../../../../../utils/util.js');
const api = require('../../../../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authenticateInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_authenticate_info(options.id || 7)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //   获取数据
  get_authenticate_info(id) {
    var data = {
      id
    }
    util.request(api.providerInfo,data).then(res => {
      console.log(res)
      if(res.success){
        this.setData({
          authenticateInfo:res.data
        })
      }
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 打电话
  callPhone(e) {
    var phoneNumber = String(e.currentTarget.dataset.phonenumber)
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        that.increase_dial(id); //调用增加咨询次数
      }
    })
  },
  // 查看大图
  preImg: function(e) {
    var self = this;
    var current = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: self.data.authenticateInfo.doorhead_sign // 需要预览的图片http链接列表
    })
  },
  // 客服
  goChating(e) {
    var chatTo = e.currentTarget.dataset.chatto;
    var id = Number(e.currentTarget.dataset.id);
    this.increase_dial(id);
    wx.navigateTo({
      url: `/partials/chating/chating?chatTo=${chatTo}`,
    })
  },
  // 增加咨询次数
  increase_dial(id) {
    var data = {
      token_id: App.globalData.meData.token_id,
      id: id,
    }
    App.request(
      "authenticate/increase_dial",
      "POST",
      data,
      function(res) {
        if (res.data.status == 1) {} else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }

    );
  },
})