// pages/index/me/myOrder/pendingOrderDetail/pendingOrderDetail.js
const App = getApp();
Page({
  data: {
    likeList: [],
    showMore4: 0,
    page4: 1,
    pageIndex: 0,
    showLoading: true,
    orderStatus: "",//根据订单状态渲染不同的页面；
    isComfirmCancel: false,//关闭取消订单遮罩层即取消原因
    IOSview: false,
  },
  onReachBottom: function () {
    this.getLikeList();
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      order_status: options.order_status,
      id: options.id,
      orderId: options.orderId || "",
      parentid: options.parentid || "",
      much: options.much,
    });
    console.log(this.data);
    this.getLikeList();
    this.getOrderDetail();
  },
  // 获取商品ID跳转到详情
  goDetails: function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;
    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
    });
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
    console.log(data);
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
          showMore4: moreLike.length == 20 ? 0 : 2
        })
      }
    );
  },
  // 联系卖家
  makePhoneCall: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.orderDetailList.c_phone
    })
  },
  // 复制订单编号信息
  copyOrderList: function (e) {
    var that = this;
    console.log(e);
    // var order_sn = orderDetailList.list? that.data.orderDetailList.order_sn;
    wx.setClipboardData({
      data: e.target.dataset.order_sn,
      success: function (res) {
        wx.showToast({
          duration: 500,
          title: '复制成功',
          icon: "none"
        })
      }
    })
  },
  // 订单详情-根据订单状态请求数据
  getOrderDetail: function () {
    var that = this;
    var token_id = App.globalData.meData.token_id;
    // var orderId = that.data.id;//订单id
    // var parentid = that.data.parentid;//多订
    var id = that.data.id;
    var much = that.data.much;
    console.log("订单id为", id, much)
    // var id = much == 0 ? orderId:parentid;
    var url = much == 0 ? 'order/one_order' : 'order/all_order';
    console.log(url);
    var data = {
      token_id,
      id
    }
    App.request(
      url,
      'POST',
      data,
      function (res) {
        if (res.data.status == 1 && res.data.message == "成功") {
          that.setData({
            orderDetailList: res.data.data,
            showLoading: false,
          });
          console.log("订单详情setData后的数据");
          console.log(2222222, that.data.orderDetailList);
        }
      }
    )
  },
  // 取消订单
  // cancalOrder: function () {
  //   this.setData({
  //     isCancal: true
  //   })
  // },
  //显示弹框
  showModal: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      isComfirmCancel: true,
    });
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      animationData: animation.export(),
      showModalStatus: true,
      maskStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏弹框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      // delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        maskStatus: false,
      })
    }.bind(this), 500)
  },
  // 点击弹框内的取消原因后确定取消订单
  isCancel: function (e) {
    var that = this;
    var cancel_reason = e.target.dataset.cancel_reason;
    var { orderId, orderId, parentid, order_status,much} = that.data;
    var id = much == 0 ? orderId : parentid;
    console.log("订单id:" + orderId + "总订单：" + parentid + "much" + much + "判断后的id" + id);
    wx.showModal({
      title: '取消订单',
      content: '你确定要取消订单吗？',
      confirmColor: "#f05b29",
      success: function (res) {
        that.setData({
          isComfirmCancel: false,
        });
        if (res.confirm) {
          var data = {
            token_id: App.globalData.meData.token_id,
            cancel_reason,
            id: parentid,
          };
          App.request(
            'order/cancel_order',
            'POST',
            data,
            function (res) {
              console.log(res);
              if (res.data.status == 1 && res.data.message == "成功") {
                if (much == 0) {
                  wx.redirectTo({
                    url: `/pages/index/me/myOrder/pendingOrderDetail/pendingOrderDetail?order_status=0&id=${id}&much=${much}&orderId=${orderId}&parentid=${parentid}`,
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/index/me/myOrder/myOrder?currentTab=0',
                  })
                }
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
  delOrder: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var token_id = App.globalData.meData.token_id;
    var data = {
      token_id,
      id
    }
    wx.showModal({
      title: '删除订单',
      content: '确定删除订单？',
      confirmColor: "#f05b29",
      success: function (res) {
        if (res.confirm) {
          App.request(
            'order/del_order',
            'POST',
            data,
            function (res) {
              if (res.data.status == 1 && res.data.message == "成功") {
                wx.showToast({
                  title: '删除成功',
                });
                wx.redirectTo({
                  url: '/pages/index/me/myOrder/myOrder?currentTab=0',
                })
              }

            }
          )

        }
      }
    })
  },
  // 点击查看物流跳转至查看物流页面
  gologistics: function (e) {
    console.log("1111111111");
    console.log(e);
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: `/pages/index/me/myOrder/checkWuLiu/checkWuLiu?id=${id}`,
    })
  },
  // 确认收货弹框
  confirmReceipt: function () {
    var id = this.data.id;
    var order_status = Number(this.data.order_status) + 1;
    var much = this.data.much;
    var token_id = App.globalData.meData.token_id;
    var data = { id, token_id };
    var backStatus = false;
    var orderDetailList = this.data.orderDetailList.goods;
    for (let i = 0; i < orderDetailList.length; i++) {
      if (orderDetailList[i].back_status==2) {
        backStatus = true;
        break;
      }
    }
    
    if (backStatus) {
      wx.showModal({
        title: '确认收货？',
        content: '该订单有退款中产品，如果确认收货，将关闭退款申请，请确认',
        confirmColor: "#f05b29",
        success: function (res) {
          if (res.confirm) {
            wx.showModal({
              title: '',
              content: '确认收货？',
              confirmColor: "#f05b29",
              success: function (res) {
                if (res.confirm) {
                  App.request(
                    'order/income',
                    'POST',
                    data,
                    function (res) {
                      if (res.data.status == 1 && res.data.message == "成功") {
                        var id = res.data.data.id;
                        console.log(id);
                        wx.redirectTo({
                          url: `/pages/index/me/myOrder/successfulTrade/successfulTrade?id=${id}&order_satatus=${order_status}&much=${much}`,
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
        success: function (res) {
          if (res.confirm) {
            App.request(
              'order/income',
              'POST',
              data,
              function (res) {
                if (res.data.status == 1 && res.data.message == "成功") {
                  var id = res.data.data.id;
                  console.log(id);
                  wx.redirectTo({
                    url: `/pages/index/me/myOrder/successfulTrade/successfulTrade?id=${id}&order_satatus=${order_status}&much=${much}`,
                  })
                }
              }
            )
          }
        }
      })
    }
    
  },
  // 评价
  toComment: function (e) {
    var orderId = e.target.dataset.id;
    wx.navigateTo({
      url: `/pages/index/me/myOrder/evaluate/evaluate?id=${orderId}`,
    })
  },
  // 预览凭证
  previewVoucher: function (e) {

    var voucher = e.target.dataset.voucher;
    console.log(voucher);
    wx.previewImage({
      current: voucher, // 当前显示图片的http链接
      urls: [voucher] // 需要预览的图片http链接列表
    })
  },
  // 售后-申请退款
  showAfterSaleModal: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: '请在掌窝工程机械APP内申请售后服务',
      confirmText:'下载App',
      confirmColor: '#fd5f2a',
      success: function (res) {
        if (res.confirm) {
          that.hideAfterSaleModal()
        } else if (res.cancel) {
          /////////
        }
      }
    })
  },
  hideAfterSaleModal: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.system.toLowerCase().indexOf('ios') >= 0) {
          that.openIOSView();
        } else{
          that.goDowloadApp();
        }
      }
    })
  },
  // 去下载app
  goDowloadApp:function(){
    wx.redirectTo({
      url: '/pages/index/dowload/dowload',
    })
  },
  // 查看评价
  viewCommit: function () {
    wx.showToast({
      title: '抱歉，小程序暂未开通此功能',
      icon: "none"
    })
  },
  goPay: function (e) {
    console.log(e);
    // 支付功能
    var order_id = e.currentTarget.dataset.parentid;
    var data = {
      order_id,
      openid: App.globalData.openid
    }
    console.log(data);
    App.request(
      'Wxxcxpay/orderPay',
      'POST',
      data,
      function (res) {
        console.log(res);
        if (res.data.status == 1) {
          var payData = res.data.data
          console.log(payData);
          var payinfo = {
            'timeStamp': payData.timeStamp + '',
            'nonceStr': payData.nonceStr,
            'package': payData.package,
            'signType': 'MD5',
            'paySign': payData.paySign,
            'success': function (res) {
              console.log('支付成功');
              var data = { order_id };
              App.request(
                'Wxxcxpay/checkOrderPay',
                'POST',
                data,
                function (res) {
                  console.log(res);
                  wx.redirectTo({
                    url: '/pages/index/me/myOrder/myOrder?currentTab=2&flag=true'
                  })
                }
              )
            },
            'fail': function (res) {
              console.log('支付失败');
              var data = { order_id };
              App.request(
                'Wxxcxpay/checkOrderPay',
                'POST',
                data,
                function (res) {
                }
              )
            }
          }
          console.log(payinfo);
          wx.requestPayment(payinfo)
        }
      })
  },
  openIOSView: function () {
    this.setData({
      IOSview: true
    })
  },
  closeView: function () {
    this.setData({
      IOSview: false
    })
  },
  copyVal: function (e) {
    var data = "https://itunes.apple.com/cn/app/id1075801122";
    wx.setClipboardData({
      data,
      success: function (res) {
        console.log(data);
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
})
