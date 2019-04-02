const util = require('../../../../../utils/util.js');
const api = require('../../../../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function(options) {
    const userInfo = util.getStorageSync('userInfo')
    return
    util.request(api.userProvider, {
      userId: userInfo.userId,
      tenantId: App.globalData.tenantId
    }, 'GET').then(res => {
      console.log(res)
      if (res.data && res.data.apply){
        wx.navigateTo({
          url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine'
        })
      }
    })
  },
  goAuth(e) {
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/authForm?title=${title}`,
    })
  },
  callPhone() {
    wx.showModal({
      title: '提示',
      content: `是否拨打客服电话4008322818`,
      confirmColor: "#f05b29",
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4008322818',
          })
        }
      }
    })
  }
})