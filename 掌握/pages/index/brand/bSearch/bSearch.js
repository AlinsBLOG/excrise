// pages/index/company/cSearch/cSearch.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cGoodsData:{},
    page:1,
    selectValue:1,
    showMore:null,
    title:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      title: options.title || '',
      id: options.id || ''
    })
    wx.setNavigationBarTitle({  
      title: that.data.title,  
    }) 
    this.getGoodsList();
  },
  bSearch:function () {
    console.log("123");
    
  },
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
        that.setData({
          cGoodsData: res.data.data.goods
        })
        console.log(res.data.data);
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
  // 跳转到消息页
  goMessage:function () {
    wx.switchTab({
      url: '/pages/index/message/message'
    });
  },
})