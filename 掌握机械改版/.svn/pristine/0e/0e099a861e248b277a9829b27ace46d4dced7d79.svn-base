const util = require('../../../../../utils/util.js');
const api = require('../../../../../utils/api.js');
const App = getApp();
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  comfirmAdd(e) {
    const self = this
    const phone = e.detail.value.phone
    let id = e.currentTarget.dataset.id
    
    let userInfo = util.getStorageSync('userInfo')
    let registerInfo = util.getStorageSync('registerInfo')
    
    if (!registerInfo.providerId){
      util.request(api.userProvider, {
        userId: userInfo.userId,
        tenantId: App.globalData.tenantId
      }, 'GET').then(res => {
        if (res.success) {
          if ((typeof res.data) === 'object') {
            registerInfo = {
              ...registerInfo,
              ...res.data
            }
          } else {
            registerInfo = {
              ...registerInfo
            }
          }
          wx.setStorageSync('registerInfo', JSON.stringify(registerInfo))
        }
      })
    }

    if (!util.checkPhoneNum(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: "none"
      })
      return
    }

    wx.showLoading({
      title: '正在添加...',
    })

    util.request(api.findUser,{
      username:phone
    }).then(res => {
      if(res.data){
        util.request(api.addUser,{
          providerId: registerInfo.providerId,
          targetUserId: res.data.userId
        },'POST').then(response => {
          wx.showModal({
            title: '添加成功',
            confirmColor: "#f05b29",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                util.reloadBfeorePage()
              }
            }
          })
        })
      } else {
        wx.showModal({
          title: '该手机暂未注册',
          confirmColor: "#f05b29",
          showCancel: false
        })
      }
      wx.hideLoading()
    })
  }
})