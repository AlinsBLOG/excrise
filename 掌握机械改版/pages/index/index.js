let col1H = 0;
let col2H = 0;
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const App = getApp();
Page({
  data: {
    showLoading: true,
    bannerUrl: [],
    
    isTied: true,
    isTieUp: false,
    // 登录    
    searchKey: '',
    bannerIndex: 0,
    promotion: {},
    goodstype: [],
    goodsmodel: [],
    refImg: [],
    recGoods: [],
    supplyImg: [],
    specialImg: [],
    page: 1,
    likeList: [],
    showMore: false,
    scrollTop: 0,
    returnHeight: 640,
    showReturn: false,
    showMask: true,
    moreLike: [],
    inquiry: [],
    // 询价播报
    // inqueryList: [],
    isScroll: true,
    pageNo: 1,
  },
  onLoad: function(options) {
    const that = this
    //banner
    util.request(api.getBanner, {
      prodCode: App.globalData.prodCode,
      tenantId: App.globalData.tenantId,
      page: 'HOME',
    }).then(res => {
      that.setData({
        showLoading: false,
        bannerUrl: (res.data || [])
      })
    })
    //分类
    util.request(api.getNavTop, {
      tenantId: App.globalData.tenantId,
      prodId: App.globalData.prodId
    }).then(res => {
      that.setData({
        goodstype: (res.data || [])
      })
    })
    //每周特选
    util.request(api.getCfgGroup, {
      tenantId: App.globalData.tenantId,
      prodCode: App.globalData.prodCode,
      code: 'week_select'
    }).then(res => {
      that.setData({
        refImg: res.data[0].itemList
      })
    })
    //人气推荐
    util.request(api.getProduct, {
      productType: 3,
      pageSize: 4
    }, 'POST').then(res => {
      that.setData({
        recGoods: res.data
      })
    })
    //精选品牌
    util.request(api.getCfgGroup, {
      tenantId: App.globalData.tenantId,
      prodCode: App.globalData.prodCode,
      code: 'hot_brand'
    }).then(res => {
      that.setData({
        goodsmodel: res.data[0].itemList
      })
    })
    //品牌代理
    util.request(api.getCfgGroup, {
      tenantId: App.globalData.tenantId,
      prodCode: App.globalData.prodCode,
      code: 'brand_agent'
    }).then(res => {
      that.setData({
        supplyImg: res.data[0].itemList
      })
    })
    //专题
    util.request(api.getCfgGroup, {
      tenantId: App.globalData.tenantId,
      prodCode: App.globalData.prodCode,
      code: 'prod_theme'
    }).then(res => {
      that.setData({
        specialImg: res.data[0].itemList
      })
    })
    //猜你喜欢
    util.request(api.getProduct, {
      productType: 3,
      pageNo: that.pageNo,
      pageSize: 10
    }, 'POST').then(res => {
      that.setData({
        likeList: res.data
      })
    })
  },
  inputSearch: function(e) {
    this.setData({
      searchKey: e.detail.value
    });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
   
  },

  // 轮播图变化
  bannerChange: function(e) {
    this.setData({
      bannerIndex: e.detail.current
    });
  },

  // 获取更多商品
  getLikeList: function() {
    const that = this.data
    if (!that.showMore) {
      util.request(api.getProduct, {
        productType: 3,
        pageNo: that.pageNo + 1,
        pageSize: 10
      }, 'POST').then(res => {
        if (res.data && res.flag === 0) {
          this.setData({
            likeList: that.likeList.concat(res.data),
            pageNo: that.pageNo + 1
          })
        } else {
          this.setData({
            showMore: true
          })
        }
      })
    }
  },

  onPageScroll: function(e) {
    var scrollTop = e.scrollTop;

    this.setData({
      showReturn: scrollTop > this.data.returnHeight
    });
  },
  // 返回顶部
  returnTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 跳转到搜索
  toSearch: function() {
    var that = this
    wx.navigateTo({
      url: '/pages/index/search/search'
    })
  },
  // 跳转到人气推荐
  toPopularity: function() {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        // 调用认证接口
        this.goAuthentication();
      } else {
        wx.navigateTo({
          url: '/pages/index/popularity/popularity'
        });
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }

  },
  // 跳转到专题
  toSpecial: function() {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        // 调用认证接口
        this.goAuthentication();
      } else {
        wx.navigateTo({
          url: '/pages/index/special/special'
        });
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }
  },
  // 跳转到品牌
  toSupply: function() {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        // 调用认证接口
        this.goAuthentication();
      } else {
        wx.navigateTo({
          url: '/pages/index/supply/supply'
        });
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }
  },
  // 获取类型并传回搜索
  changeType: function(e) {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        // 调用认证接口
        this.goAuthentication();
      } else {
        var lastType = e.currentTarget.id;
        var name2 = e.currentTarget.dataset.text;
        if (name2.length > 4) {
          var word = name2.substring(0, 3) + "...";
          name2 = word;
        }


        if (lastType == -1) {
          App.globalData.changeid = 0
          wx.switchTab({
            url: '/pages/index/class/class'
          });
        } else
          wx.navigateTo({
            url: '/pages/index/products/products?type=' + lastType + '&name2=' + name2
          })

      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }

  },
  // 获取三级ID并传回搜索
  getLastId: function(e) {
    var pid = e.currentTarget.id;
    var name1 = e.currentTarget.dataset.text;
    if (name1.length > 7) {
      var word = name1.substring(0, 6) + "...";
      name1 = word;
    }
    if (pid == -1) {
      App.globalData.changeid = 1
      wx.switchTab({
        url: '/pages/index/class/class'
      });
    } else
      wx.navigateTo({
        url: '/pages/index/products/products?model_id=' + pid + '&name1=' + name1
      })

  },
  // 获取商品ID跳转到详情
  goDetails: function(e) {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        this.goAuthentication();
      } else {
        var id = e.currentTarget.dataset.text.id;
        var goods_id = e.currentTarget.dataset.text.goods_id;
        wx.navigateTo({
          url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
        });
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }
  },
  // 跳转到商家店铺
  goCompany: function(e) {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    var id = e.currentTarget.id
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        this.goAuthentication();
      } else {
        wx.navigateTo({
          url: '/pages/index/company/company?id=' + id
        });
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }

  },
  //按需跳转
  goTo: function(e) {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        this.goAuthentication()
      } else {
        var id = e.currentTarget.id
        var title = e.currentTarget.dataset.text
        console.log(title, id);
        if (id == 2) {
          // 跳转商家店铺
          wx.navigateTo({
            url: '/pages/index/company/company?id=' + title
          });
        }
        if (id == 5) {
          // 跳转外链
          // ===============
          var reg = new RegExp('https://zw.palm-machinery.com/promotion/#/index?');
          if (reg.test(title)) {
            console.log(true);
            var tempArr = title.split("?");
            var rootUrl = tempArr[0];
            var promotion_id = tempArr[1].split("=")[1];
            wx.navigateTo({
              url: `/pages/webView/webView?webUrl=${rootUrl}&promotion_id=${promotion_id}`,
            })
          } else {
            wx.navigateTo({
              // url: '/pages/webView/webView?webUrl=' + title,

              url: '/pages/webView/webView?webUrl=' + title
            });
          }
        }
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: '掌窝工程机械，找挖机配件上掌窝',
      path: '/pages/index/index',
      //   imageUrl: '/images/icons/index/500.png',
    }
  },
  onReachBottom: function() {
    this.getLikeList()
  },
  // tabbar红点
  checkBadge: function() {
    var that = this;
    var data = {
      token_id: App.globalData.meData.token_id,
      reg_id: '',
    }
    App.request(
      'cart/cart_count',
      'POST',
      data,
      function(res) {
        var badge = res.data.data.count;
        if (badge <= 0) {
          wx.removeTabBarBadge({
            index: 3
          })
        } else {
          wx.setTabBarBadge({
            index: 3,
            text: badge + ''
          })
        }
      }
    );
  },
  //////////////////////////////
  // 交易动态-求购信息详情
  godetail: function() {
    wx.navigateTo({
      url: '/pages/index/qiugou/qiugou',
    })
  },
  // 交易动态
  // index/trade
  getTrade: function() {
    var that = this;
    var page = 1;
    App.request(
      'index/trade',
      'POST', {
        page
      },
      function(res) {
        if (res.data.message == "成功" && res.data.status == 1) {
          var moreTradeList = res.data.data.list;
          moreTradeList.forEach((i, v) => {
            i.createtime = App.formartTime(i.createtime);
          });
          that.setData({
            tradeList: moreTradeList
          });
        }
        console.log(that.data.tradeList);
      }
    );
  },
  //   818促销
  goPromotion() {
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        this.goAuthentication();
      } else {
        var url_type = Number(this.data.promotion.url_type);
        console.log(this.data.promotion, url_type);
        var promotion = this.data.promotion;
        console.log(url_type);
        switch (url_type) {
          case 0:
            break;
          case 1:
            var urls = JSON.parse(promotion.url);
            var id = urls.model_id;
            var goods_id = urls.goods_id;
            wx.navigateTo({
              url: `/pages/index/details/details?id=${id}&goods_id=${goods_id}`,
            })
            break;
          case 2:
            var id = Number(promotion.url)
            wx.navigateTo({
              url: `/pages/index/company/company?id=${id}`,
            })
            break;

          case 3:
            var url = promotion.url;
            var tempArr = url.split("?");
            var rootUrl = tempArr[0];
            var promotion_id = tempArr[1].split("=")[1];
            wx.navigateTo({
              url: `/pages/webView/webView?webUrl=${rootUrl}&promotion_id=${promotion_id}`,
              success: function() {
                var data = {
                  id: promotion.id,
                  type: 3,
                }
                App.request(
                  "promotion/increase_access",
                  'POST',
                  data,
                  function(res) {
                    console.log(res);
                  }

                );
              }
            })
            break;

        }
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }

  },
  // 2019/9/10 跳询价大厅
  goInqueryRoom() {
    var that = this;
    var is_audit = App.globalData.meData.is_audit;
    if (this.data.isTied == true) {
      if (is_audit != 2) {
        this.goAuthentication();
      } else {
        wx.navigateTo({
          url: '/pages/index/inqueryRoom/inqueryRoom',
        })
      }
    } else {
      wx.showToast({
        title: "请先绑定手机",
        icon: 'none',
        mask: true,
      })
      setTimeout(() => {
        that.tieUp()
      }, 600);
    }
  },
  // // 测试
  // loginout(){
  //     App.request(
  //         "config/del_bobo",
  //         {},
  //         function(res){
  //             console.log(res)
  //         }
  //     )
  // }
  // 登录模块
  // 获取验证码
  formSubmit: function() {

    var that = this;
    var phone = this.data.phoneNum;
    console.log(phone);
    var data = {
      mobile: phone
    }
    App.request(
      'config/sms',
      'POST',
      data,
      function(res) {
        if (res.data.status == 1) {
          console.log("发送成功");
          that.setData({
            disabled: true
          })
          var currentTime = that.data.currentTime
          var time = setInterval(function() {
            currentTime--;
            that.setData({
              time: '已发送(' + currentTime + 's)'
            })
            if (currentTime <= 0) {
              clearInterval(time)
              that.setData({
                time: '重新发送',
                currentTime: 60,
                disabled: false
              })
            }
          }, 1000)
        } else {
          console.log("发送失败");
          wx.showToast({
            title: '手机号不正确',
            image: '../../images/icons/me/fail.png',
          })
        }
      })
  },
  //  验证码验证并绑定手机
  verify: function(e) {
    console.log(e)
    var that = this;
    var mobile = this.data.phoneNum;
    var mobile_code = this.data.codeNum;
    var xcx_openid = App.globalData.openid;
    var wx_unionid = App.globalData.unionid;
    var nickname = '';
    // console.log(mobile, mobile_code, xcx_openid, nickname);
    var data = {
      mobile,
      mobile_code,
      xcx_openid,
      nickname,
      wx_unionid
    }
    App.request(
      'config/sms_login',
      'POST',
      data,
      function(res) {
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          mask: true,
        })
        if (res.data.status == 1) {
          // 快捷登录
          var data = {
            xcx: App.globalData.openid,
            wx_unionid: App.globalData.unionid,
          }
          App.request(
            'config/quick_login',
            'POST',
            data,
            function(res) {
              // console.log('______________');
              // console.log(res);
              if (res.data.status == -1) {
                App.globalData.isTied = false;
              } else if (res.data.status == 1) {
                // 更新用户状态值
                App.globalData.isTied = true;
                that.setData({
                  avatarUrl: res.data.data.img || '',
                  nickName: res.data.data.nickname || '',
                  days: res.data.data.days,
                  isTied: true,
                  authen_id: res.data.data.authen_id,
                  identity: res.data.data.identity, //identity
                })
              }
              App.globalData.meData = res.data.data;
              if (res.data.data.is_audit != 2) {
                that.goAuthentication();
                that.goback()
              } else {
                that.goback()
              }
            }
          );

        }
      })
  },
  tieUp: function() {
    this.setData({
      isTieUp: true
    })
  },
  // 登录模块
  // 求购系统认证等东西的认证转态更新
  get_refresh_info() {
    var that = this;
    var data = {
      token_id: App.globalData.meData.token_id
    }
    App.request(
      'inquiry/get_refresh_info',
      'POST',
      data,
      function(res) {
        var res = res.data;
        // console.log(App.globalData.meData);
        if (res.status == 1) {
          App.globalData.meData.id = res.data.id;
          App.globalData.meData.username = res.data.username;
          App.globalData.meData.member_id = res.data.member_id;
          App.globalData.meData.is_repair = res.data.is_repair;
          App.globalData.meData.is_admin = res.data.is_admin;
          App.globalData.meData.authen_id = res.data.authen_id;
          App.globalData.meData.identity = res.data.identity;
          App.globalData.meData.is_audit = res.data.is_audit;
          App.globalData.meData.member_level = res.data.member_level;
        }
        that.setData({
          identity: res.data.identity,
          is_audit: res.data.is_audit,
        });
      }
    );
  },
  // 去认证配件商、修理厂
  //   认证
  goAuthentication() {
    var is_audit = App.globalData.meData.is_audit;
    console.log(" goAuthentication的" + is_audit)
    if (is_audit == 0 || is_audit == 3) {
      wx.navigateTo({
        url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/businessAuth',
      })
    } else if (is_audit == 1) {
      wx.navigateTo({
        url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine',
      })
    }

  },
  getInqury() {
    var that = this;
    var data = {
      token_id: App.globalData.meData.token_id
    }
    App.request(
      'index/index',
      'POST',
      data,
      function(res) {
        if (res.status == 1) {
          var inquiry = res.data.inquiry;
          that.setData({
            inquiry
          });
        }
      }
    );
  },
  // promise封装的登录
  login() {
    const getToken = new Promise(function(resolve, reject) {
      var that = this;
      wx.login({
        success: res => {
          var data = {
            code: res.code
          }
          App.request(
            'config/xcxcode_get_openid',
            'POST',
            data,
            function(res) {
              App.globalData.openid = res.data.data.openid;
              App.globalData.session_key = res.data.data.session_key;
              App.globalData.unionid = res.data.data.unionid;
              var data = {
                xcx: res.data.data.openid,
                wx_unionid: res.data.data.unionid,
              }
              // 快捷登录
              App.request(
                'config/quick_login',
                'POST',
                data,
                function(res) {
                  resolve(res);
                  if (res.data.status == -1) {
                    App.globalData.isTied = false;
                    App.globalData.meData = "";

                  } else if (res.data.status == 1) {
                    App.globalData.isTied = true;
                    App.globalData.meData = res.data.data;
                  }


                }
              );
            }
          );

        }

      })
    });
    return getToken;
  },
  // 关于分享出去进来页面的跳转问题
  shareAbout(options) {
    console.log("options");
    // var is_audit = App.globalData.meData.is_audit;
    var isTied = App.globalData.isTied;

    if (isTied) {
      var is_audit = App.globalData.meData.is_audit;
    }
    if (options.share_query == 'details') {
      // is_audit != 2
      if (isTied == false) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      } else {
        if (is_audit != 2) {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {
          wx.navigateTo({
            url: `/pages/index/details/details?id=${options.id}&goods_id=${options.goods_id}`,
          })
        }
      }
      // return;
    } else if (options.share_query == 'company') {
      if (isTied == false) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      } else {
        if (is_audit != 2) {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {
          wx.navigateTo({
            url: `/pages/index/company/company?id=${options.id}`,
          })
        }
      }
      // return;
    } else if (options.share_query == 'brand') {
      if (isTied == false) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      } else {
        if (is_audit != 2) {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {
          wx.navigateTo({
            url: `/pages/index/brand/brand?id=${options.id}`,
          })
        }
      }
    } else if (options.share_query == 'webView') {
      wx.navigateTo({
        url: `/pages/webView/webView?webUrl=${options.webUrl}`,
      })
      // return;
    } else if (options.share_query == 'inquiry') {
      if (isTied == false) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      } else {
        if (is_audit != 2) {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {
          wx.navigateTo({
            url: `/pages/index/inqueryRoom/inqueryOrderDetail/inqueryOrderDetail?id=${options.id}`,
          })
        }
      }

    } else if (options.share_query == 'makeinquiry') {
      console.log("share_query==makeinquiry");
      if (isTied == false) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      } else {
        if (is_audit != 2) {
          console.log(is_audit);
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {
          console.log("跳转发布");
          wx.navigateTo({
            url: '/pages/index/inqueryRoom/inqueryOrderDetail/reInquery/reInquery',
          })
        }
      }

    }
  }

})