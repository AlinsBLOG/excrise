// pages/index/company/company.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:362,
    showLoading:true,
    name2:"产品类型",
    filValue:0,
    isScroll:true,
    isHidden:true,
    brandData:{},
    resData:{},
    cGoodsData:{},
    list:{},
    page:1,
    selectValue:1,
    showMore:null,
    scrollTop:0,
    showReturn:false,
    type:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      id: options.id || ''
    })
    var page = this.data.page;
    var data = {
      id:this.data.id,
      order: this.data.selectValue,
      page
    }
    App.request(
      'index/brandinfo',
      'POST',
      data,
      function (res) {
        that.setData({
          resData:res.data.data,
          brandData: res.data.data.brand,
          list: res.data.data,
          showLoading:false
        })
        console.log(res.data.data);
        wx.setNavigationBarTitle({
          title: that.data.brandData.name,
        })
        that.anima()
      })

    this.getGoodsList();
    // this.getTypeList()
  },
  anima:function () {
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
  
  // 获取商品列表
  getGoodsList: function () {
    var that = this
    var page = this.data.page;
    // 1
    var type = this.data.type;
    
    var data = {
      bid:this.data.id,
      order: this.data.selectValue,
      // 1
      type,
      token_id:App.globalData.meData.token_id,
      page
    }
    App.request(
      'index/brandlist',
      'POST',
      data,
      function (res) {
        console.log(res);
        
        that.setData({
          cGoodsData: res.data.data.goods
        })
        console.log(res.data.data);
        that.closeMask();
      })
  },
  //获取商品列表(点击完毕回到顶部)
  getGoodsList2: function () {
    var that = this
    var page = this.data.page;
    // 1
    var type = this.data.type;
    
    var data = {
      bid:this.data.id,
      order: this.data.selectValue,
      // 1
      type,
      token_id:App.globalData.meData.token_id,
      page
    }
    App.request(
      'index/brandlist',
      'POST',
      data,
      function (res) {
        console.log(res);
        
        that.setData({
          cGoodsData: res.data.data.goods
        })
        console.log(res.data.data);
        that.closeMask();
        that.setData({
          scrollTop:362
        })
      })
  },
  showText:function () {
    if (this.data.isHidden==true) {
      this.setData({
        isHidden:false
      })
    }else{
      this.setData({
        isHidden:true
      })
    }
  },
  // 获取更多商品
  getMoreList: function () {
    var that = this
    this.setData({ showMore: 1 });
    var page = this.data.page;
    page++;
    // 1
    var type = this.data.type;
    
    var data = {
      bid:this.data.id,
      page: page,
      order: this.data.selectValue,
      // 1
      type,
      token_id:App.globalData.meData.token_id,
    }
    App.request(
      'index/brandlist',
      'POST',
      data,
      function (res) {
        var list = res.data.data.goods
        var moreList = that.data.cGoodsData.concat(list)
        
        that.setData({
          cGoodsData: moreList,
          page,
          showMore: list.length == 20 ? 0 : 2
        });
      }
    )
  },
  // 获取商品ID跳转到详情
  goDetails:function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;
    
    wx.navigateTo({
      url: '/pages/index/details/details?id='+id+'&goods_id='+goods_id
    });
  },
  // 滑动屏幕
  containerScroll: function (e) {
    var that = this;
    var scrollTop = e.detail.scrollTop;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#mjltest').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        height:res[0].height + 10
      })
      
    })
    
    this.setData({
      // scrollTop:scrollTop,
      showReturn: scrollTop > 640,
      fix: scrollTop >= this.data.height
    });
  },

  // 人气
  select1: function () {
    if (this.data.selectValue != 1) {
      this.setData({
        showMore: 0,
        page: 1,
        selectValue: 1
      });
      this.getGoodsList();
    }
  },
  // 联系
  select2: function () {
    if (this.data.selectValue != 2) {
      this.setData({
        showMore: 0,
        page: 1,
        selectValue: 2
      });
      this.getGoodsList();
    }
  },
  // 新品
  select3: function () {
    if (this.data.selectValue != 3) {
      this.setData({
        showMore: 0,
        page: 1,
        selectValue: 3
      });
      this.getGoodsList();
    }
  },
  // 价格
  select45: function () {
    var selectValue = this.data.selectValue == 5 ? 4 : 5;
    this.setData({
      showMore: 0,
      page: 1,
      selectValue: selectValue
    });
    this.getGoodsList();
  },
  // 产品类型
  filtrate2:function () {
    
    if (this.data.filValue != 2) {
      if (!this.data.fix) {
        this.setData({
          scrollTop: this.data.height
        })
      }

      this.setData({
        isScroll:false,
        showMore: 0,
        page: 1,
        filValue:2,
      });
    }
  },
  
  // 改变类型
  changeType:function (e) {
    var lastType = e.target.id;
    this.setData({
      type:lastType
    })
    this.getGoodsList2();
    this.changeName2(e)
  },
  // 改变框内名字
  changeName2:function (e) {
    var name2 =e.target.dataset.text;
    if (name2.length > 4) {
      var word = name2.substring(0, 3) + "...";
      name2 = word;
    }
    this.setData({
      name2,
    })
  },
  // 关闭蒙版
  closeMask:function () {
    this.setData({
      filValue:0,
      isScroll:true
    })
  },
  // 跳转到消息页
  goMessage:function () {
    wx.switchTab({
      url: '/pages/index/message/message'
    });
  },
  // 返回顶部
  returnTop: function () {
    this.setData({ 
      scrollTop: 0,
      showReturn:false
     });
  },
  toBSearch:function () {
    var id = this.data.id
    wx.navigateTo({
      url: '/pages/index/brand/bSearch/bSearch?id='+id
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var id = this.data.brandData.id;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.brandData.name,
      // path: '/pages/index/brand/brand?id='+id,
      path: `/pages/index/index?id=${id}&share_query=brand`,
      imageUrl: this.data.brandData.img,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})