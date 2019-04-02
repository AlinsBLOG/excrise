// pages/index/details/evaluate/evaluate.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading:true,
    goodsNull:false,
    isTieUp: false,
    disabled: false,
    time: '获取验证码',
    currentTime: 60,
    p1:1,
    p2:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isTied = App.globalData.isTied;
    this.setData({
      id: options.id || '',
      model_id: options.model_id || '',
      company_id: options.company_id || '',
      isTied,
    })
    this.getGoodsEva();
    this.getComEva();
  },
  // 获取商品评论
  getGoodsEva:function () {
    var that = this
    var data = {
      token_id: App.globalData.meData.token_id,
      id: this.data.id,
      model_id: this.data.model_id,
      company_id: 0,
      p:1
    }
    App.request(
      'index/evaluate',
      'POST',
      data,
      function (res) {
        console.log(res.data.data);
        var eva_goods = res.data.data
        that.setData({
          eva_goods
        })
        if (res.data.data.goods_count == 0) {
          that.setData({
            goodsNull: true,
          })
        }
      }
    )
  },
  // 获取更多商品评论
  getGoodsEvaMore:function () {
    var that = this
    var p1 = this.data.p1 + 1
    console.log(p1);
    var data = {
      token_id: App.globalData.meData.token_id,
      id: this.data.id,
      model_id: this.data.model_id,
      company_id: 0,
      p: p1
    }
    App.request(
      'index/evaluate',
      'POST',
      data,
      function (res) {
        console.log(res.data.data);
        var eva_goods = that.data.eva_goods
        var more_eva_goods = res.data.data.list;
        eva_goods.list = eva_goods.list.concat(more_eva_goods);

        that.setData({
          eva_goods,
          p1
        })
        console.log(that.data.eva_goods);
      }
    )
  },
  // 获取商家评论
  getComEva: function () {
    var that = this
    var data = {
      token_id: App.globalData.meData.token_id,
      id: this.data.id,
      model_id: this.data.model_id,
      company_id: this.data.company_id,
      p:1
    }
    App.request(
      'index/evaluate',
      'POST',
      data,
      function (res) {
        console.log(res.data.data);
        that.setData({
          eva_com: res.data.data,
          showLoading: false,
        })
        if (res.data.data.company_count == 0) {
          that.setData({
            comNull: true,
          })
        }
      }
    )
  },
  // 获取更多商家评论
  getComEvaMore: function () {
    var that = this
    var p2 = this.data.p2 + 1
    console.log(p2);
    var data = {
      token_id: App.globalData.meData.token_id,
      id: this.data.id,
      model_id: this.data.model_id,
      company_id: this.data.company_id,
      p: p2
    }
    App.request(
      'index/evaluate',
      'POST',
      data,
      function (res) {
        console.log(res.data.data);
        var eva_com = that.data.eva_com
        var more_eva_com = res.data.data.list;
        eva_com.list = eva_com.list.concat(more_eva_com);

        that.setData({
          eva_com,
          p2
        })
        console.log(that.data.eva_com);
      }
    )
  },
  // 切换siwper
  headerChange: function (e) {
    this.setData({ pageIndex: e.detail.current });
  },
  changePage: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      pageIndex: index
    });
  },
  // 点赞
  dianZan1: function (e) {
    var that = this;
    if (this.data.isTied == true) {
      var id = e.currentTarget.id
      console.log("id为"+id)
      var index = e.currentTarget.dataset.index
      var data = {
        token_id: App.globalData.meData.token_id,
        id
      }
      
      
      App.request(
        'user/evaluate_like',
        'POST',
        data,
        function (res) {
          var eva_goods = that.data.eva_goods
          if (eva_goods.list[index].eid == 0) {
            eva_goods.list[index].eid = 1;
            eva_goods.list[index].like_num++;
          }else{
            eva_goods.list[index].eid = 0
            eva_goods.list[index].like_num--;
          }
          that.setData({
            eva_goods
          })
          var eva_com = that.data.eva_com;
          for (let i = 0; i < eva_com.list.length; i++) {
            if (eva_com.list[i].id == id) {
              console.log(eva_com.list[i]);
              if (eva_com.list[i].eid == 0) {
                eva_com.list[i].eid = 1;
                eva_com.list[i].like_num++;
              } else {
                eva_com.list[i].eid = 0
                eva_com.list[i].like_num--;
              }
              that.setData({
                eva_com
              })
              return
            }

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
  dianZan2: function (e) {
    var that = this;
    if (this.data.isTied == true) {
      var id = e.currentTarget.id
      console.log("id为" + id);
      console.log(e);
      var index = e.currentTarget.dataset.index
      var data = {
        token_id: App.globalData.meData.token_id,
        id
      }
      App.request(
        'user/evaluate_like',
        'POST',
        data,
        function (res) {
          console.log(index);
          var eva_com = that.data.eva_com
          if (eva_com.list[index].eid == 0) {
            eva_com.list[index].eid = 1;
            eva_com.list[index].like_num++;
          } else {
            eva_com.list[index].eid = 0
            eva_com.list[index].like_num--;
          }
          that.setData({
            eva_com
          })
          var eva_goods = that.data.eva_goods;
          for (let i = 0; i < eva_goods.list.length; i++) {
            if (eva_goods.list[i].id == id) {
              console.log(eva_goods.list[i]);
              if (eva_goods.list[i].eid == 0) {
                eva_goods.list[i].eid = 1;
                eva_goods.list[i].like_num++;
              } else {
                eva_goods.list[i].eid = 0
                eva_goods.list[i].like_num--;
              }
              that.setData({
                eva_goods
              })
              return
            }

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
  // 获取验证码
  formSubmit: function () {

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
      function (res) {
        if (res.data.status == 1) {
          console.log("发送成功");
          that.setData({
            disabled: true
          })
          var currentTime = that.data.currentTime
          var time = setInterval(function () {
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
            image: '../../../../images/icons/me/fail.png',
          })
        }
      })
  },
  //  验证码验证并绑定手机
  verify: function () {
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
      function (res) {
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
            function (res) {
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
  inputPhoneNum: function (e) {

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
  checkPhoneNum: function (phoneNum) {
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
  inputCodeNum: function (e) {
    let codeNum = e.detail.value
    this.setData({
      codeNum
    })
  },
  goback: function () {
    this.setData({
      isTieUp: false
    })
  },

  //查看大图
  preEvaImg1: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    console.log(e);
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: that.data.eva_goods.list[index].img // 需要预览的图片http链接列表
    })
  },
  preEvaImg2: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.text;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: that.data.eva_com.list[index].img // 需要预览的图片http链接列表
    })
  },
  tieUp: function () {
    this.setData({
      isTieUp: true
    })
  },
})