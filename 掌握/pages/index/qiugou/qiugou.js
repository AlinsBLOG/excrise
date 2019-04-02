
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    showMore4: 0,
    page: 1,
    tradeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getTrade();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTrade()
  },
  // 交易动态
  // index/trade
  getTrade: function () {
    if (this.data.showMore4 == 2){
        return;
    }
    var that = this;
    this.setData({ showMore4: 1 });
    var page = this.data.page;
    App.request(
      'index/trade',
      'POST',
      {page},
      function (res) {
        if (res.data.message == "成功" && res.data.status == 1) {
          var moreTradeList = res.data.data.list;
          moreTradeList.forEach((i, v) => {
            i.createtime = App.formartTime(i.createtime);
          });
          var tradeList = that.data.tradeList.concat(moreTradeList)
          page++
          that.setData({
            imgurl:res.data.data.img.url,
            tradeList,
            showLoading: false,
            page,
            showMore4: moreTradeList.length == 10 ? 0 : 2
          });
        }
      }
    );
  },
  // 时间格式化
  formartTime: function (time) {
    var time = time * 1000;
    var h = new Date(time);
    var year = h.getFullYear();
    var month = h.getMonth() + 1;
    var day = h.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;    
    var date = year + "-" + month + '-' + day;
    console.log(date);
    return date;
  },

  // 复制
  copy: function (e) {
    var that = this;
    var title = e.currentTarget.dataset.title;
    var content = e.currentTarget.dataset.content;
    var data = content + title;
    wx.setClipboardData({
      data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: "none"
        })
      }
    })
  },

})