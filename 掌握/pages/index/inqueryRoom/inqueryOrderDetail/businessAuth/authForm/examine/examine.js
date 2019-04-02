Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  backT: function() {
    wx.switchTab({
      url: '/pages/index/inqueryRoom/inqueryRoom'
    })
  },
  callPhone() {
    // wx.showModal({
    //   title: '提示',
    //   content: `是否拨打客服电话4008322818`,
    //   confirmColor: "#f05b29",
    //   success: function(res) {
    //     if (res.confirm) {
          
    //     }
    //   }
    // })
    wx.makePhoneCall({
      phoneNumber: '4008322818'
    })
  }
})