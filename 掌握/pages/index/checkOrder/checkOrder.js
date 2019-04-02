// pages/index/checkOrder/checkOrder.js
const App = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLoading: true,
        cart_id: '',
        cart: [],
        monad: 0,
        disabled: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            cart_id: options.cart_id || '',
            income_people: options.income_people || false,
            phone: options.phone || false,
            province_name: options.province_name || false,
            city_name: options.city_name || false,
            county_name: options.county_name || false,
            details: options.details || false,
            site_id: options.site_id || false,
        })
        console.log(this.data.cart_id);
        this.getOrder();
    },
    // 获取订单
    getOrder: function() {
        var that = this;
        var data = {
            token_id: App.globalData.meData.token_id,
            cart_id: this.data.cart_id
        }
        App.request(
            'cart/verify_cart',
            'POST',
            data,
            function(res) {
                console.log(res.data);
                if (res.data.data.is_site == 0) {
                    var cart_id = that.data.cart_id
                    wx.redirectTo({
                        url: '/pages/index/me/addrManage/newAddr/newAddr?flag=checkOrder' + '&cart_id=' + cart_id,
                    })
                } else {
                    that.setData({
                        cart: res.data.data.cart,
                        site: res.data.data.site,
                        showLoading: false,
                    })
                    var cart = that.data.cart
                    for (let i = 0; i < cart.length; i++) {
                        cart[i].subtotal = cart[i].subtotal.toFixed(2);
                    }
                    var total_money = res.data.data.total_money.toFixed(2);
                    that.setData({
                        cart,
                        total_money
                    })
                }
            }
        )
    },
    // 提交订单
    submitOrder: function() {
        var disabled = this.data.disabled;
        if (disabled) {
            return;
        }
        this.setData({
            disabled: true
        })
        console.log(this.data.disabled);

        var that = this;
        var cart = this.data.cart
        var cart_goods = [];
        for (let i = 0; i < cart.length; i++) {
            var obj = new Object();
            obj.company_id = cart[i].company_id;
            obj.cart_id = '';
            for (let j = 0; j < cart[i].goods.length; j++) {
                obj.cart_id += cart[i].goods[j].cart_id + ',';
            }
            obj.cart_id = obj.cart_id.substring(0, obj.cart_id.lastIndexOf(','));
            obj.word = cart[i].word || '';
            cart_goods.push(obj)
        }
        var monad = this.data.monad;
        var site_id = this.data.site_id || this.data.site.id;
        var json = JSON.stringify({
            "cart_goods": cart_goods,
            "monad": monad,
            "site_id": site_id,
            "token_id": App.globalData.meData.token_id
        })
        var data = {
            token_id: App.globalData.meData.token_id,
            json
        }
        // console.log(data);
        App.request(
            'order/submit_order',
            'POST',
            data,
            function(res) {
                // console.log(res);
                if (res.data.status == 1) {
                    // 支付功能
                    var order_id = res.data.data.total_order_id;
                    var data = {
                        order_id,
                        openid: App.globalData.openid
                    }
                    //   console.log(data);

                    App.request(
                        'Wxxcxpay/orderPay',
                        'POST',
                        data,
                        function(res) {
                            //   console.log(res);
                            if (res.data.status == 1) {
                                var payData = res.data.data
                                // console.log(payData);
                                var payinfo = {
                                    'timeStamp': payData.timeStamp + '',
                                    'nonceStr': payData.nonceStr,
                                    'package': payData.package,
                                    'signType': 'MD5',
                                    'paySign': payData.paySign,
                                    'success': function(res) {
                                        console.log('支付成功');
                                        var data = {
                                            order_id
                                        };
                                        App.request(
                                            'Wxxcxpay/checkOrderPay',
                                            'POST',
                                            data,
                                            function(res) {
                                                console.log(res);
                                                if (res.data.status == 1) {
                                                    var orderData = res.data.data;
                                                    if (res.data.data.order_num > 1) {
                                                        wx.redirectTo({
                                                            url: '/pages/index/me/myOrder/myOrder?currentTab=2&flag=true'
                                                        })
                                                    } else if (res.data.data.order_num == 1) {
                                                        wx.redirectTo({
                                                            url: '/pages/index/me/myOrder/pendingOrderDetail/pendingOrderDetail?id=' + orderData.order_id + '&order_status=2' + '&much=0&orderId=' + orderData.order_id,
                                                        })
                                                    }
                                                }
                                            }
                                        )
                                    },
                                    'fail': function(res) {
                                        console.log('支付失败');
                                        //   跑拆分多商家订单接口，取消临时单
                                        var data = {
                                            "token_id": App.globalData.meData.token_id,
                                            "total_order_id": order_id,
                                            "client_side": 3,
                                        }
                                        App.request(
                                            "order/split_order",
                                            'POST',
                                            data,
                                            function(res) {
                                                if (res.data.status == 1) {
                                                    wx.redirectTo({
                                                        url: '/pages/index/me/myOrder/myOrder?currentTab=1&flag=true'
                                                    })
                                                }
                                            }
                                        )
                                    }
                                }
                                console.log(payinfo);
                                wx.requestPayment(payinfo)
                                try {
                                    wx.removeStorageSync('carList')
                                } catch (e) {
                                    console.log("没有清除");
                                }
                            }
                        }
                    )
                }
            }
        )
    },
    // 收货地址
    toAddrManage: function() {
        var cart_id = this.data.cart_id
        wx.navigateTo({
            url: '/pages/index/checkOrder/addrManage/addrManage?cart_id=' + cart_id
        })
    },
    //打印出货单
    switchChange: function(e) {
        if (e.detail.value) {
            this.setData({
                monad: 1
            })
        } else {
            this.setData({
                monad: 0
            })
        }
    },
    // 留言限制100&检查搜索框文字
    maxLength: function(e) {
        var index = e.currentTarget.dataset.index;
        var cart = this.data.cart
        cart[index].word = e.detail.value;
        this.setData({
            cart
        })
        if (e.detail.value.length == 100) {
            wx.showToast({
                title: '最多可输入100字',
                icon: "none"
            })
        }
    }
})