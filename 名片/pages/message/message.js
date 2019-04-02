const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    cardFolder: [],
    globalImage: app.globalData.cardPhoto,
  },

  myApplyList: function () {
    const user = util.checkUserId();
    const that = this;
    util.request(api.queryApplyList, {
      userId: user.id,
      pageNo: 1,
      pageSize: 10,
    }, 'GET').then(function (res) {
      that.setData({
        cardFolder: res?res:[]
      })
      wx.setNavigationBarTitle({
        title: '申请列表'
      })
    })
  },

  applyAct:function(e){
    const that = this;
    const applyId = e.target.dataset.applyid;
    const userId = util.checkUserId().id;
    const type = e.target.dataset.type;
    let url = api.accept;
    let value = '同意交换名片';
    if(type == 'unaccept'){
      value = '拒绝交换名片';
      url = api.unaccept;
    }
    console.log(applyId,type)
    wx.showModal({
      title: value,
      success:function(ev){
        if (ev.confirm === true){
          util.request(url + '?userId=' + userId + '&applyId=' + applyId, {
            userId, 
            applyId
          }, 'POST').then(function (res) {
            if (res) {
              util.showSuccessToast('已处理')
              that.myApplyList();
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myApplyList();
  },

  toIndexPage: function () {
    wx.redirectTo({
      url: '/pages/myCard/myCard',
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
    const user = util.checkUserId();
    const that = this;
    if (user) {
      that.setData({
        user: user
      })
    }
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