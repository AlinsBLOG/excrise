var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollLeft: 0,
    //请求列表参数
    condCode:'ALL',
    pageNo: 1,
    pageSize: 10,
    pageCount: 0,

    orderList:[],
    navList:[{
      id:'ALL',
      name:'全部'
    }, {
      id: 'WTP',
      name: '待付款'
    }, {
      id: 'WTC',
      name: '待评价'
    }, {
      id: 'CLS',
      name: '已完成'
    }, {
      id: 'CNL',
      name: '已取消'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userOrderList();
  },

  /**
   * 获取订单列表
   */
  userOrderList: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    //加载指定用户订单列表
    util.request(api.QueryOrderList + user.checkLogin().id + "/list?condCode=" + that.data.condCode + '&pageNo=' + that.data.pageNo + '&pageSize=' + that.data.pageSize).then(function (res) {
      if (res.success === true) {
        if (res.data) {
          let centerList = res.data;
          centerList.map(function (item) {
            item.items.map(function (subItem) {
              subItem.countyName = user.getNameByCode(subItem.countyCode);
              return subItem;
            })
            return item;
          })
          let list = that.data.orderList.concat(centerList);
          that.setData({
            orderList: list,
            pageNo: that.data.pageNo + 1,
            pageCount: res.pageCount
          })
        }
      }
    });
    wx.hideLoading();
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    e.stop
    let that = this;
    let ordId = e.target.dataset.orderid;
    wx.showModal({
      title: '确定取消该订单？',
      content: '',
      success: function (e){
        if(e.confirm == true){
          wx.showLoading({
            title: '请稍后...',
          })
          util.request(api.CancelOrder + user.checkLogin().id + '/cancel/' + ordId,null,'POST').then(function (res) {
            if (res.success === true) {
              wx.hideLoading();
              let changeList = that.data.orderList.map(function (item) {
                if (item.orderId == ordId) {
                  item.state = 9;
                }
                return item;
              })
              that.setData({
                orderList: changeList
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
   * 滑到底部加载
   */
  bindDownLoad: function () {
    if (this.data.pageNo <= this.data.pageCount){
      this.userOrderList();
    }
  },

  queryOrderDetail: function (e) {
    let orderId = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + orderId,
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
  
  },
  switchCate: function (event) {
    if (this.data.condCode == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      condCode: event.currentTarget.dataset.id,
      pageNo: 1,
      orderList:[],
      scrollTop:0
    });
    this.userOrderList();
  }
})