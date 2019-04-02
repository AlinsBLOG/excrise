const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const App = getApp();
Page({
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(){
    let that = this 
    let userInfo = util.getStorageSync('userInfo');
    let registerInfo = util.getStorageSync('registerInfo');
    if (!userInfo) {
      wx.showModal({
        content: '您还没有登陆',
        success:function(e){
          if(e.confirm){
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/inqueryRoom/inqueryRoom'
            })
          }
        }
      })
    } else {
      const pages = getCurrentPages()

      util.request(api.userProvider, {
        userId: userInfo.userId,
        tenantId: App.globalData.tenantId
      }, 'GET').then(res => {
        if (res.success) {
          console.log(res)
          if (res.data !== null) {
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
            wx.setStorageSync('registerInfo', JSON.stringify(registerInfo))
            if (res.data && res.data.apply) {
              if (res.data.apply.state == 2) {
                let title = (res.data.apply.type == "MTS" ? 1 : 2)
                //认证不通过
                that.navigateTo(`/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authNoPast/authNoPast?title=${title}`)
              } else {
                //认证中
                that.navigateTo(`/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine`)
              }
            } else if (res.data.id) {
              that.navigateTo(`/pages/index/makeInquriy/makeInquriy`)
            }
          } else {
            that.navigateTo('/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/businessAuth')
          }
        }
      })
      if (pages[0].route == 'pages/inqueryTab/inqueryTab') {
        wx.switchTab({
          url: '/pages/index/inqueryRoom/inqueryRoom'
        })
      } else {
        wx.navigateTo({
          url: '/pages/index/makeInquriy/makeInquriy'
        })
      }
    }
  },
  navigateTo(url) {
    wx.navigateTo({
      url: url
    })
  }
})