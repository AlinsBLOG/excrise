const util = require('../../../../../../utils/util.js');
const api = require('../../../../../../utils/api.js');
const App = getApp()
Page({
  data: {
    apply:{},
    region:[],
    type:'MTS',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const identity = options.title || 2
    let name = ''
    let type = ''
    if (identity == 1){
      type = 'MTS'
      name = '修理厂'
    } else {
      name = '配件商'
      type = 'TPS'
    }
    var title = name + "认证"
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      identity,
      type
    })
    this.goInfo()
  },

  goInfo: function (e) {
    let that = this
    let userInfo = util.getStorageSync('userInfo')
    let registerInfo = util.getStorageSync('registerInfo')
    if (userInfo) {
      util.request(api.userProvider, {
        userId: userInfo.userId,
        tenantId: App.globalData.tenantId
      }, 'GET').then(res => {
        console.log(res)
        res = res.data.apply
        if (res){
          that.setData({
            apply: res
          })
        }
        wx.setStorageSync('applyInfo', JSON.stringify(res))
        console.log(res)
      })
    }
  },

  submit(){
    const { identity } = this.data 
    console.log(1)
    wx.navigateTo({
      url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/businessAuth'
    })
  }
})