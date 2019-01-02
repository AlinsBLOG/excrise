const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenDetail:true,
    userInfo:{},
    selfCard:true,
    myCardList: [{
      "userId": "",
      'cardId': 1,
      "userName": "",
      "mobile": "",
      "companyName": "",
      "email": "",
      "cmpAddress": "",
      "popIdx": 1,
      "saveIdx": 2,
      "availableIdx": 2,
      "photo": "",
      "wallPaper": ""
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const cardId = options.cardId;
    const userId = options.userId;
    wx.showLoading({
      title: '加载中...',
    })
    wx.setNavigationBarTitle({
      title: '我的名片',
    })
    that.setData({
      userInfo: app.globalData.userInfo
    })
    util.request(api.getMyCardList, {
      userId: userId
    }).then(function (res) {
      if (res && res.length) {
        let result = res.filter(function (item) {
          return item.id == cardId
        })
        that.setData({
          myCardList: result
        })
        wx.hideLoading();
      }
    })
  },

  makePhoneCall: function (e) {
   
  },

  editCard: function (e) {
    const cardId = e.currentTarget.dataset.cardid;
    const userId = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '/pages/myCardEdit/myCardEdit?cardId=' + cardId + '&userId=' + userId
    })
  },

  hiddenDetailFun:function(){
    let hiddenDetail = this.data.hiddenDetail;
    this.setData({
      hiddenDetail: !hiddenDetail
    })
  },

  toCardDetail:function(){
    wx.navigateTo({
      url: '/pages/myCardEdit/myCardEdit',
    })
  },

  backIndex:function(){
    wx.navigateBack({})
  },

  aboutMe:function(e){
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/aboutMe/aboutMe?type='+type,
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