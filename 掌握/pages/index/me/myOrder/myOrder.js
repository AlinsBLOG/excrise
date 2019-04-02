const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // currentTab: ,
    navTab: ["全部", "待付款", "待发货", "待收货", "待评价"],
    sliderOffset: 0,
    showLoading: true,
    page: 1, //订单请求的页码
    id: "",
    orderList: [
      [],
      [],
      [],
      [],
      []
    ], //订单数据
    //猜你喜欢
    likeList: [],
    isCancal: false,
    showMore4: 0,
    showMoreOrder: 0,
    page4: 1,
    isComfirmCancel: false, //关闭取消订单遮罩层即取消原因
  },
  onLoad: function(options) {
    let that = this
    let currentTab = options.currentTab;
    // this.getDataList()
  },
  onShow: function() {

  },
  // 切换导航栏
  swithNav: function(e) {
    let currentTab = e.target.dataset.current;
    this.setData({
      currentTab,
      sliderOffset: e.currentTarget.offsetLeft,
    });

  },
  // 根据swiper滑动设置currenTab
  swithTab: function(e) {
    let currentTab = Number(e.detail.current);
    console.log(this.data.orderList[currentTab].length);
    let showLoading = this.data.orderList[currentTab].length == 0 ? true : false;
    let sliderOffset = this.data.sliderWidth * currentTab;
    this.setData({
      currentTab: e.detail.current,
      sliderOffset,
      showLoading,
      page: 1,
      showMoreOrder: 0,
    });
    this.getOrderList();
  },
  // 加载更多订单
  getMoreOrderList: function() {
    if (this.data.showMoreOrder == 2) {
      return;
    }
    let that = this;
    let order_status;
    let page = that.data.page;
    let currentTab = that.data.currentTab;
    let orderList = that.data.orderList;
    let orderItem = orderList[currentTab];
    this.setData({
      showMoreOrder: 1,
    });
    // 订单状态，0交易关闭 1未付款 2已付款，代发货 3已发货，待收货 4已收货，待评价 5已评价，订单完成，6全部订单
    if (currentTab == 0) {
      order_status = 6 //
    } else if (currentTab == 1) {
      order_status = 1
    } else if (currentTab == 2) {
      order_status = 2
    } else if (currentTab == 3) {
      order_status = 3
    } else if (currentTab == 4) {
      order_status = 4
    }
    let data = {
      token_id,
      page,
      order_status,
    }
    App.request(
      'order/order_list',
      'POST',
      data,
      function(res) {
        if (res.data.status == 1 && res.data.message == "成功") {
          let moreOrderList = res.data.data;
          console.log(moreOrderList)
          orderItem = orderItem.concat(moreOrderList);
          orderList[currentTab] = orderItem;
          page++;
          that.setData({
            showLoading: false,
            orderList,
            showMoreOrder: moreOrderList.length != 0 ? 0 : 2,
            page,
          });
          // console.log(that.data.orderList);
        }
      }
    )
  },
  // 获取订单
  getOrderList: function() {
    let that = this;
    let token_id = App.globalData.meData.token_id;
    let order_status;
    let page = 1;
    let currentTab = that.data.currentTab;
    let orderList = that.data.orderList;
    let orderItem = orderList[currentTab];
    this.setData({
      showMoreOrder: 1,
      flag: false,
    });
    if (currentTab == 0) {
      order_status = 6 //
    } else if (currentTab == 1) {
      order_status = 1
    } else if (currentTab == 2) {
      order_status = 2
    } else if (currentTab == 3) {
      order_status = 3
    } else if (currentTab == 4) {
      order_status = 4
    }
    let data = {
      token_id,
      page,
      order_status,
    }
    App.request(
      'order/order_list',
      'POST',
      data,
      function(res) {
        if (res.data.status == 1 && res.data.message == "成功") {
          let moreOrderList = res.data.data;
          console.log(moreOrderList);
          orderItem = moreOrderList;
          orderList[currentTab] = orderItem;
          that.setData({
            showLoading: false,
            orderList,
            page: 2,
            showMoreOrder: moreOrderList.length != 0 ? 0 : 2,
          });
        }
      }
    )
  },
  // 点击商品跳转至订单详情
  goOrderDetail: function(e) {
    let orderId = e.currentTarget.dataset.id; //订单id(单商家)
    let parentid = e.currentTarget.dataset.parentid; //总订单id（多商家）
    let order_status = e.currentTarget.dataset.order_status; //订单状态
    let much = e.currentTarget.dataset.much; //判断商家，1位多商家
    let id = much == 0 ? orderId : parentid;
    wx.navigateTo({
      url: `/pages/index/me/myOrder/pendingOrderDetail/pendingOrderDetail?id=${id}&order_status=${order_status}&much=${much}&parentid=${parentid}&orderId=${orderId}`,
    })
  },
  // 取消订单
  cancalOrder: function() {
    this.setData({
      isCancal: true
    })
  },
  //显示弹框
  showModal: function(e) {
    let that = this;
    // 取消订单的对应的订单id
    let parentid = e.target.dataset.parentid; //	总订单ID
    let orderId = e.target.dataset.id; //订单id,用来跳转至订单详情
    let much = e.target.dataset.much //是否为多商家，1为多商家，0位单商家
    let order_status = e.target.dataset.order_status;
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
    })
    that.animation = animation
    animation.translateY(380).step()
    that.setData({
      animationData: animation.export(),
      showModalStatus: true,
      maskStatus: true,
      parentid,
      orderId,
      isComfirmCancel: true,
      much,
      order_status
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(this), 300)
  },
  //隐藏弹框
  hideModal: function() {
    let that = this;
    // 隐藏遮罩层
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(380).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: false,
        maskStatus: false,
      })
    }.bind(that), 300)
  },
  // 点击弹框内的取消原因后确定取消订单
  isCancel: function(e) {
    let that = this;
    let cancel_reason = e.target.dataset.cancel_reason;
    let orderId = that.data.orderId;
    let parentid = that.data.parentid;
    let order_status = that.data.order_status
    let much = that.data.much;
    let id = much == 0 ? orderId : parentid;
    wx.showModal({
      title: '取消订单',
      content: '你确定要取消订单吗？',
      confirmColor: "#f05b29",
      success: function(res) {
        that.setData({
          isComfirmCancel: false,
        });
        if (res.confirm) {
          let data = {
            token_id: App.globalData.meData.token_id,
            cancel_reason,
            id: parentid,
          };
          App.request(
            'order/cancel_order',
            'POST',
            data,
            function(res) {
              if (res.data.status == 1 && res.data.message == "成功") {
                that.getOrderList();
              } else {
                wx.showToast({
                  title: res.data.message,
                })
              }
            }
          )
        }
      }
    })
  },
  // 删除订单
  delOrder: function(e) {
    let that = this;
    let id = e.target.dataset.id;
    let token_id = App.globalData.meData.token_id;
    let data = {
      token_id,
      id
    }
    wx.showModal({
      title: '删除订单',
      content: '确定删除订单？',
      confirmColor: "#f05b29",
      success: function(res) {
        if (res.confirm) {
          App.request(
            'order/del_order',
            'POST',
            data,
            function(res) {
              if (res.data.status == 1 && res.data.message == "成功") {
                wx.showToast({
                  title: '删除成功',
                });
                that.getOrderList();

              }

            }
          )

        }
      }
    })
  },
  // 付款
  // 点击查看物流跳转至查看物流页面
  gologistics: function(e) {
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: `/pages/index/me/myOrder/checkWuLiu/checkWuLiu?id=${id}`,
    })
  },
  // 确认收货弹框
  confirmReceipt: function(e) {
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let order_status = Number(e.target.dataset.order_status) + 1;
    let much = e.target.dataset.much;
    let token_id = App.globalData.meData.token_id;
    let data = {
      id,
      token_id
    };
    let currentTab = this.data.currentTab;
    let back_count = Number(this.data.orderList[currentTab][index].back_count);
    // console.log(back_count);
    // let backStatus = false;
    // let orderDetailList = this.data.orderList[3][index].goods;
    // let data1 = {
    //     id,index,order_status,much
    // }
    // console.log(data1);
    // for (let i = 0; i < orderDetailList.length; i++) {
    //     if (orderDetailList[i].back_status==2) {
    //         backStatus = true;
    //         break;
    //     }
    // }
    if (back_count == 1) {
      wx.showModal({
        title: '确认收货？',
        content: '该订单有退款中产品，如果确认收货，将关闭退款申请，请确认',
        confirmColor: "#f05b29",
        success: function(res) {
          if (res.confirm) {
            wx.showModal({
              title: '',
              content: '确认收货？',
              confirmColor: "#f05b29",
              success: function(res) {
                if (res.confirm) {
                  App.request(
                    'order/income',
                    'POST',
                    data,
                    function(res) {
                      if (res.data.status == 1 && res.data.message == "成功") {
                        let id = res.data.data.id;
                        wx.navigateTo({
                          url: `/pages/index/me/myOrder/successfulTrade/successfulTrade?id=${id}&order_satatus=${order_status}&much=${much}`
                        })
                      } else {
                        wx.showToast({
                          title: res.data.message,
                        })
                      }
                    }
                  )
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '确认收货？',
        content: '请确认货物已经收到，确认收货后，货款将结算给商家！',
        confirmColor: "#f05b29",
        success: function(res) {
          if (res.confirm) {
            App.request(
              'order/income',
              'POST',
              data,
              function(res) {
                if (res.data.status == 1 && res.data.message == "成功") {
                  let id = res.data.data.id;
                  wx.navigateTo({
                    url: `/pages/index/me/myOrder/successfulTrade/successfulTrade?id=${id}&order_satatus=${order_status}&much=${much}`
                  })
                } else {
                  wx.showToast({
                    title: res.data.message,
                  })
                }
              }
            )
          }
        }
      })
    }

  },

  // 猜你喜欢部分
  // 获取商品ID跳转到详情
  goDetails: function(e) {
    let id = e.currentTarget.dataset.text.id;
    let goods_id = e.currentTarget.dataset.text.goods_id;

    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
    });
  },
  // 获取猜你喜欢列表
  getDataList: function() {
    if (this.data.showMore4 == 2) {
      return;
    }
    let that = this;
    this.setData({
      showMore4: 1
    });
    let page4 = this.data.page4
    let data = {
      page: page4,
      token_id: App.globalData.meData.token_id
    }
    App.request(
      'index/index_more',
      'POST',
      data,
      function(res) {
        let moreLike = res.data.data
        let likeList = that.data.likeList.concat(moreLike)
        page4++
        that.setData({
          likeList,
          page4,
          showMore4: moreLike.length == 20 ? 0 : 2
        })
      }
    );
  },
  // 评价
  toComment: function(e) {
    let orderId = e.target.dataset.id;
    wx.navigateTo({
      url: `/pages/index/me/myOrder/evaluate/evaluate?id=${orderId}`,
    })
  },
  // 查看评价
  viewCommit: function() {
    wx.showToast({
      title: '抱歉，小程序暂未开通此功能',
      icon: "none"
    })
  },
  goPay: function(e) {
    // 支付功能
    let order_id = e.currentTarget.dataset.parentid;
    let data = {
      order_id,
      openid: App.globalData.openid
    }
    App.request(
      'Wxxcxpay/orderPay',
      'POST',
      data,
      function(res) {
        // console.log(res);
        if (res.data.status == 1) {
          let payData = res.data.data
          // console.log(payData);
          let payinfo = {
            'timeStamp': payData.timeStamp + '',
            'nonceStr': payData.nonceStr,
            'package': payData.package,
            'signType': 'MD5',
            'paySign': payData.paySign,
            'success': function(res) {
              console.log('支付成功');
              let data = {
                order_id
              };
              App.request(
                'Wxxcxpay/checkOrderPay',
                'POST',
                data,
                function(res) {
                  // console.log(res);
                  if (res.data.status == 1) {
                    wx.redirectTo({
                      url: '/pages/index/me/myOrder/myOrder?currentTab=2&flag=true'
                    })
                  }

                }
              )
            },
            'fail': function(res) {
              console.log("================");
              console.log('支付失败');
              console.log(res);
              // let data = { order_id };
              // App.request(
              //     'Wxxcxpay/checkOrderPay',
              //     'POST',
              //     data,
              //     function (res) {
              //     }
              // )
            }
          }
          console.log(payinfo);
          wx.requestPayment(payinfo)
        }
      })
  },
  // 判断加载更多
  getList: function() {
    this.data.orderList[this.data.currentTab].length != 0 ? this.getMoreOrderList() : this.getLikeList();
  }
})