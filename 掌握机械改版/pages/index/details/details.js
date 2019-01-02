const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();
Page({
  data: {
    isCollect: false,
    isTied: false,
    showLoading: true,
    isScroll: true,
    telService: false,
    explain: false,
    bannerIndex: 0,
    id: '',
    goods_id: '',
    goodsData: {},
    companyData: {},
    moreData: {},
    badge: 0,
    imagePath: '',
    kfCount: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const prodId = options.prodId || 19
    this.setData({
      prodId
    })
    this.getDetails()
  },
  getDetails: function() {
    const that = this
    const { prodId } = this.data
    wx.showLoading({
      title: '正在加载...'
    })
    util.request(api.getProductDetail,{
      prodId
    }).then(res => {
      console.log(res.data)
      wx.hideLoading()
    })
    util.request(api.getProdSku,{
      prodId
    }).then(res => {
      console.log(res.data)
    })
  },
  anima: function() {
    var that = this;
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 100,
      success: function(res) {}
    })
    this.animation.opacity(1).step()
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
    setTimeout(() => {
      that.animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'linear',
        delay: 100,
        success: function(res) {}
      })
      that.animation.opacity(0).step()
      that.setData({
        //输出动画
        animation: that.animation.export()
      })
    }, 3000);
  },
  // 轮播图变化
  bannerChange: function(e) {
    this.setData({
      bannerIndex: e.detail.current
    });
  },

  // 获取商品ID跳转到详情
  goDetails: function(e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;

    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
    });
  },

  openExplain: function() {
    this.setData({
      explain: true,
      isScroll: false
    })
  },
  close: function() {
    this.setData({
      telService: false,
      explain: false,
      isScroll: true
    })
  },
  openTelService: function() {
    this.setData({
      telService: true,
      isScroll: false
    })
  },
  copyVal: function(e) {
    var data = e.currentTarget.dataset.text
    wx.setClipboardData({
      data,
      success: function(res) {
        console.log("1");
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  phoneCall: function(e) {
    var data = e.currentTarget.dataset.text
    wx.makePhoneCall({
      phoneNumber: data,

    })
  },
  goCompany: function() {
    var id = this.data.companyData.id
    wx.navigateTo({
      url: '/pages/index/company/company?id=' + id
    });
  },
  // 收藏按钮
  collect: function() {
    var that = this;
    if (this.data.isTied == true) {
      if (this.data.isCollect == false) {

        this.colItem();

      } else if (this.data.isCollect == true) {

        this.delItem();

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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    var id = this.data.goodsData.id;
    var goods_id = this.data.goodsData.goods_id;
    console.log(1);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.goodsData.title,
      // path: '/pages/index/details/details?id='+id+'&goods_id='+goods_id,
      path: `/pages/index/index?id=${id}&goods_id=${goods_id}&share_query=details`,
      // id=18801 & goods_id=10964
      // imageUrl: this.data.imagePath,
      imageUrl: this.data.goodsData.img_imgs[0],
      success: function(res) {
        // 转发成功
        // console.log(that.data.imagePath);
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },


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
            image: '../../../images/icons/me/fail.png',
          })
        }
      })
  },
  //  验证码验证并绑定手机
  verify: function() {
    var that = this;
    var mobile = this.data.phoneNum;
    var mobile_code = this.data.codeNum;
    var xcx_openid = App.globalData.openid;
    var nickname = this.data.nickName;

    console.log(mobile, mobile_code, xcx_openid, nickname);
    var data = {
      mobile,
      mobile_code,
      xcx_openid,
      nickname
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
            xcx: App.globalData.openid
          }
          App.request(
            'config/quick_login',
            'POST',
            data,
            function(res) {
              console.log(res);
              if (res.data.status == -1) {
                App.globalData.isTied = false;
              } else if (res.data.status == 1) {
                App.globalData.isTied = true;
              }
              App.globalData.meData = res.data.data;
              that.setData({
                isTied: true
              })
              that.goback()
            }
          );

        }
      })
  },
  // 手机号部分
  inputPhoneNum: function(e) {

    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
      }
    } else {
      this.setData({
        phoneNum: '手机号不正确'
      })

    }
  },
  checkPhoneNum: function(phoneNum) {
    let str = /^1[34578]\d{9}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: '../../../images/icons/me/fail.png',
      })
      return false
    }
  },
  //验证码部分
  inputCodeNum: function(e) {
    let codeNum = e.detail.value
    this.setData({
      codeNum
    })
  },
  goback: function() {
    this.setData({
      isTieUp: false
    })
  },
  // 收藏商品
  colItem: function(e) {

    var meData = App.globalData.meData;
    var that = this
    //获取列表中的下标
    var id = this.data.goods_id;
    var data = {
      token_id: meData.token_id,
      type: 0,
      id
    }
    App.request(
      'data/fun_collect',
      'POST',
      data,
      function(res) {

        if (res.data.status == 1) {
          that.setData({
            isCollect: true
          })
          wx.showToast({
            title: "收藏成功",
            icon: 'none',
            mask: true,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            // mask:true,
          })
        }

      }
    )
  },

  // 取消收藏
  delItem: function() {
    var meData = App.globalData.meData;
    var that = this
    //获取列表中要删除项的下标
    var id = this.data.goods_id;
    var data = {
      token_id: meData.token_id,
      type: 0,
      id
    }
    App.request(
      'data/fun_collect_del',
      'POST',
      data,
      function(res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          // mask:true,
        })
        that.setData({
          isCollect: false
        })
        wx.showToast({
          title: "已取消收藏",
          icon: 'none',
          mask: true,
        })
      }
    )
  },
  //查看大图
  preImg: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.text
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: that.data.moreData.detail // 需要预览的图片http链接列表
    })
  },
  test(e) {
    console.log(e.currentTarget.dataset);
    console.log(e.currentTarget.dataset.item);
  },
  preEvaImg: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.text
    var index = Number(e.currentTarget.dataset.index);
    console.log(current, index)
    console.log(that.data.evaData.list[0].img);
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: that.data.evaData.list[index].img, // 需要预览的图片http链接列表
    })
  },

  preSwiperImg: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.text
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: that.data.goodsData.img_imgs // 需要预览的图片http链接列表
    })
  },
  //跳转到购物车
  goGoodsCar: function() {
    console.log("跳转到购物车");
    wx.navigateTo({
      url: '/pages/index/details/goodsCar/goodsCar'
    });
  },
  //添加购物车
  addGoodsCat: function() {
    console.log(this.data.goodsData);
    var meData = App.globalData.meData;
    var data = {
      token_id: meData.token_id,
      goods_id: this.data.goodsData.goods_id,
      model_id: this.data.goodsData.id,
      goods_num: 1,
      type: 1
    }
    console.log(data);

    var that = this;
    if (this.data.isTied == true) {
      console.log("添加购物车");
      App.request(
        'cart/add_cart',
        'POST',
        data,
        function(res) {
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: "加入购物车成功",
              icon: 'none',
              mask: false,
            })
            that.checkBadge();
          }
        }
      )
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
  //立即购买
  buyBuyBuy: function() {
    var that = this;
    console.log(this.data.isTied);
    if (this.data.isTied == true) {
      console.log("立即购买");
      var goods_id = this.data.goodsData.goods_id;
      var model_id = this.data.goodsData.id;
      wx.navigateTo({
        url: '/pages/index/buyNow/buyNow?goods_id=' + goods_id + '&model_id=' + model_id
      });
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
  // 跳转到评价详情
  goEva: function() {
    var goods_id = this.data.goodsData.goods_id;
    var model_id = this.data.goodsData.id;
    var company_id = this.data.companyData.id;
    wx.navigateTo({
      url: '/pages/index/details/evaluate/evaluate?id=' + goods_id + '&model_id=' + model_id + '&company_id=' + company_id
    });
  },

  // 点赞
  dianZan: function(e) {
    var that = this;
    if (this.data.isTied == true) {
      var id = e.currentTarget.dataset.id
      var data = {
        token_id: App.globalData.meData.token_id,
        id
      }
      App.request(
        'user/evaluate_like',
        'POST',
        data,
        function(res) {
          // console.log(res);
          var data = {
            token_id: App.globalData.meData.token_id,
            goods_id: that.data.goods_id,
            id: that.data.id
          }
          App.request(
            'index/goods',
            'POST',
            data,
            function(res) {
              that.setData({
                evaData: res.data.data.evaluate
              })
            })
        }
      )
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
  tieUp: function() {
    this.setData({
      isTieUp: true
    })
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
        that.setData({
          badge,
        })
      }
    );
  },
  // 云信im客服系统
  goContact(e) {
    var that = this;
    console.log(e.currentTarget.dataset.title);
    console.log(e.currentTarget.dataset.price);
    console.log(e.currentTarget.dataset.img);
    var title = e.currentTarget.dataset.title;
    var price = e.currentTarget.dataset.price;
    var shopImg = e.currentTarget.dataset.img;
    var goods_id = that.data.goods_id;
    var id = that.data.id;

    if (this.data.isTied == true) {
      wx.navigateTo({
        url: `/partials/chating/chating?chatTo=${this.data.kfCount}&title=${title}&price=${price}&shopImg=${shopImg}&goods_id=${goods_id}&id=${id}`,
      })
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
    // =+++++++++++++

  }
})