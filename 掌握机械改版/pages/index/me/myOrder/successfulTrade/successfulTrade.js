// pages/index/me/myOrder/successfulTrade/successfulTrade.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeList: [],
    showMore4: 0,
    page4: 1,
    pageIndex: 0,
    showLoading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    var order_satatus = options.order_satatus;
    var much = options.much;
    console.log(id,order_satatus,much);
    this.setData({
      id,
      order_satatus,
      much,
    });
    this.getLikeList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getLikeList();
  },
  // 猜你喜欢
  getLikeList: function () {
    var that = this;
    this.setData({ showMore4: 1 });
    var page4 = this.data.page4
    var data = {
      page: page4,
      token_id:App.globalData.meData.token_id
    }
    App.request(
      'index/index_more',
      'POST',
      data,
      function (res) {
        var moreLike = res.data.data
        var likeList = that.data.likeList.concat(moreLike)
        page4++
        that.setData({
          likeList,
          page4,
          showMore4: moreLike.length == 20 ? 0 : 2,
          showLoading:false,
        })
      }
    );
  },
  // 立刻评价
  // 发表评论
  toComment: function () {
    var id = this.data.id;//订单id
    var order_satatus = this.data.order_satatus;//订单状态
    wx.redirectTo({
      url: `/pages/index/me/myOrder/evaluate/evaluate?id=${id}`,
    })
  },
  // 查看订单
  checkOrder: function () {
    var that = this;
    var id = that.data.id;//订单id  
    var order_satatus = Number(that.data.order_satatus);  
    var much = that.data.much;
    console.log(this, id, order_satatus,much);
    wx.navigateTo({
      url: `/pages/index/me/myOrder/pendingOrderDetail/pendingOrderDetail?id=${id}&order_status=${order_satatus}&much=${much}`,
    })
  },
})