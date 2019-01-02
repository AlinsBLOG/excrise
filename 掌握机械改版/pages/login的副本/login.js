const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    password:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  loginCertain: function () {
    try {
      wx.clearStorageSync()
    } catch (e) {
     
    }
    const mobile = this.data.mobile;
    const password = this.data.password;
    const that = this;
    if (!mobile) {
      util.showErrorToast('请输入手机号码')
      return
    } else {
      if (util.checkPhoneNum(mobile)) {
        if (!password) {
          util.showErrorToast('请输入密码')
          return
        }
        wx.showLoading({
          title: '登陆中...',
        })
        //请求登录
        util.request(api.login, {
          mobile,
          password
        }, 'POST').then(function (res1) {
          if (res1.success){
            let registerInfo = res1.data
            console.log(registerInfo)
            util.request(api.userInfo, { userId: registerInfo.id }, 'GET').then(info => {
              let userInfo = info.data
              util.request(api.userProvider, {
                userId: userInfo.userId,
                tenantId: App.globalData.tenantId
              }, 'GET').then(res => {
                if (res.success) {
                  console.log(res.data)
                  if (registerInfo && (typeof registerInfo) === 'object') {
                    if (res.data){
                      if (!res.data.token) {
                        registerInfo = {
                          ...res.data,
                          ...registerInfo
                        }
                      } else {
                        registerInfo = {
                          ...registerInfo,
                          ...res.data
                        }
                      }
                    }
                  } 
                  wx.setStorageSync('userInfo', JSON.stringify(userInfo))
                  wx.setStorageSync('registerInfo', JSON.stringify(registerInfo))
                }
              })
              util.reloadBfeorePage()
              wx.hideLoading()
            })
          }else{
            util.showErrorToast(res1.message)
          }
        })
      } else {
        return
      }
    }
  },

  inputChange:function(e){
    const name = e.target.dataset.name;
    const value = e.detail.value;
    this.setData({
      [name]:value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})