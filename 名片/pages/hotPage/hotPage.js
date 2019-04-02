const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList:[],
    pageNo:1,
    pageSize:10,
    request:true,
    globalImage: ''
  },

  /**
   * 滑到底部加载更多
   */
  searchScrollLower:function(){
    this.getAllCardListFunction();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllCardListFunction();
    this.setData({
      globalImage: app.globalData.cardPhoto,
    })
  },

  /**
   * 搜索点击确认
   */
  confirm:function(e){
    const value = e.detail.value;
    this.setData({
      userName:value,
      pageNo:1,
      cardList:[],
      request:true
    })
    this.getAllCardListFunction();
  },

  getAllCardListFunction: function () {
    const user = util.checkUserId();
    let { pageNo,pageSize, request, cardList, userName} = this.data;
    const that = this;
    //获取人气榜名片列表
    if (request){
      wx.showNavigationBarLoading();
      wx.showLoading({
        title: '加载中...',
      })
      util.request(api.getAllCardList, { userName: userName, userId: user.id, pageNo: pageNo, pageSize: pageSize}, 'POST').then(function (res) {
        if (res) {
          res.map(function (item) {
            cardList.push(item)
          })
          that.setData({
            cardList: cardList,
            pageNo: pageNo + 1
          })
          if(res.length < 10){
            that.setData({
              request: false
            })
          }
        }else{
          that.setData({
            cardList: cardList,
            request:false
          })
        }
        util.stop();
        wx.hideLoading();
      })
    }
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
    this.setData({
      cardList: [],
      pageNo: 1,
      pageSize: 10,
      request: true,
    })
    this.getAllCardListFunction();
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