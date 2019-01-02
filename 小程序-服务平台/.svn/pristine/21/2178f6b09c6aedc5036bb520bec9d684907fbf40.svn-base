var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    buyerInfo: {},
    dataList: {}
  },

  backIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    this.getData();
  },

  getData: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    const { orderId } = that.data;
    util.request(api.QueryServeList + user.checkLogin().id + "/detail/" + orderId).then(function (res) {
      console.log(res)
      if (res.success === true) {
        let data = res.data;
        data.countyName = user.getNameByCode(data.countyCode);
        that.setData({
          buyerInfo: data.buyerInfo,
          dataList: data
        })
        util.stop();
        wx.hideLoading();
      }
    });
  },

  /**
   * 调起微信支付
   */
  goToWechatPay: function () {
    const userId = user.checkLogin().id;
    const { dataList } = this.data;
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    util.request(api.ServeConfirm + userId + "/confirm/" + dataList.orderId + '?amount=' + dataList.bargainAmount, null, 'POST').then(function (res) {
      util.request(api.ApplyAuthen + userId + "/applyAuthen/forCallApi", null, 'POST').then(function (res) {
        if (res.success === true) {
          wx.setStorageSync('accessToken', res.data.accessToken)
          util.request(res.data.baseUrl + '/platform-pay/prepare4Pay/' + res.data.appCode + '/applyForWxTinyAppPay?orderId=' + dataList.orderId + '&orderNo=' + dataList.orderNo + '&amount=' + dataList.bargainAmount + '&openId=' + app.globalData.openId, null, 'POST').then(function (ressp) {
            if (ressp.success == true){
              const result = ressp.data;
              wx.requestPayment({
                'timeStamp': result.timeStamp + '',
                'nonceStr': result.nonceStr,
                'package': result.packageContent,
                'signType': result.signType,
                'paySign': result.signature,
                'success': function (respon) {
                  if (respon.errMsg === 'requestPayment:ok') {
                    that.setData({
                      dataList: {
                        ...dataList,
                        state: 10
                      }
                    })
                  }
                },
                'complete': function (respon) {
                  wx.hideLoading();
                }
              })
            }else{
              util.showErrorToast(ressp.message)
            }
          }, function (err) {
            console.log(err)
          })
        }
      })
    })
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let that = this;
    let ordId = e.target.dataset.orderid;
    wx.showModal({
      title: '确定取消该订单？',
      content: '',
      success: function (e) {
        if (e.confirm == true) {
          wx.showLoading({
            title: '请稍后...',
          })
          util.request(api.CancelOrder + user.checkLogin().id + '/cancel/' + ordId, null, 'POST').then(function (res) {
            if (res.success === true) {
              wx.hideLoading();
              that.setData({
                state: 9
              })
              wx.showToast({
                title: '订单取消成功!',
              })
            }
          });
        }
      }
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
    this.getData();
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