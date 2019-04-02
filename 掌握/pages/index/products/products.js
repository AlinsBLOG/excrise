const App = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
var scroll = 0;
Page({
  data: {
    fix: false,
    serchinput: '',
    moreList: [],
    pageNo: 1,
    loadMore: true,
    originName: '产品类型',
    categoryList:[],
    categoryName:'产品类型',
    categoryFirstIndex:0,
    categorySecondIndex: null,
    categoryThirdIndex: null,
    style: true,
    //产品类型
    productList: [{
        name: '全部',
        productType: null
      },
      {
        name: '产品',
        productType: 1
      },
      {
        name: '课程',
        productType: 2
      },
      {
        name: '顾问',
        productType: 4
      }
    ]
  },
  onLoad: function(options) {
    const serchinput = options.serchinput
    this.setData({
      serchinput: serchinput || ''
    })
    this.getGoodsList()
    this.getAllClass()
  },

  confirm(e) {
    const serchinput = e.detail.value
    this.setData({
      serchinput,
      moreList: [],
      loadMore: true,
      pageNo: 1
    })
    this.getGoodsList()
  },

  // 获取搜索商品列表
  getGoodsList() {
    let that = this
    let {
      serchinput,
      moreList,
      loadMore,
      pageNo,
      productType
    } = this.data
    let data = {
      pageNo
    }
    if (serchinput) data.nameLike = serchinput
    if (productType) data.productType = productType
    if (loadMore) {
      wx.showLoading({
        title: '正在加载...',
      })
      util.request(api.getProduct, data, 'POST').then(res => {
        console.log(res.data)
        if (pageNo >= res.pageCount) {
          this.setData({
            loadMore: false
          })
        }
        if (res.data) {
          let centerVal = res.data
          moreList = moreList.concat(centerVal)
        }
        this.setData({
          moreList,
          pageNo: pageNo + 1
        })
        wx.hideLoading()
      })
    }
  },

  //获取所有分类
  getAllClass() {
    util.request(api.getAllClass, {
      tenantId: App.globalData.tenantId,
      prodId: App.globalData.prodId
    }).then(res => {
      console.log(res.data)
      this.setData({
        categoryList:res.data
      })
    })
  },

  // 滑动屏幕
  scrollView: function(e) {
    if (e.detail.scrollTop > scroll) {
      if (!this.data.fix) {
        this.setData({
          fix: true
        })
      }
    } else if (e.detail.scrollTop < scroll) {
      if (this.data.fix) {
        this.setData({
          fix: false
        })
      }
    }
    scroll = e.detail.scrollTop
    this.setData({
      showReturn: e.detail.scrollTop > 640
    })
  },

  // 切换样式
  changeStyle: function() {
    this.setData({
      style: !this.data.style
    })
  },
  // 跳转到搜索
  toSearch: function() {
    if (this.data.serchinput != '') {
      wx.navigateBack({ //返回
        delta: 1
      })
    } else {
      var serchinput = this.data.serchinput
      var pages = getCurrentPages(); //当前页面
      var prevPage = pages[pages.length - 2]; //上一页面
      prevPage.setData({ //直接给上移页面赋值
        serchinput
      });
      wx.navigateTo({
        url: '/pages/index/search/search',
      })
    }
  },

  // 价格
  select: function() {
    this.setData({
      showMore: 0,
      page: 1,
      selectValue: (this.data.selectValue == 5 ? 4 : 5)
    })
    this.getGoodsList()
  },

  // 关闭蒙版
  closeMask: function() {
    this.setData({
      filValue: 0
    })
  },

  filtrate: function(e) {
    const filValue = e.target.dataset.value
    if (this.data.filValue != filValue) {
      this.setData({
        filValue
      })
    }
  },

  // 改变产品类型
  changeOrigin: function(e) {
    const item = e.target.dataset.item
    var index = e.target.dataset.index;
    this.setData({
      origin: index,
      moreList: [],
      loadMore: true,
      pageNo: 1,
      originName: item.name,
      productType: item.productType

    })
    this.getGoodsList()
  },

  // 获得下一级类型
  getNextType: function(e) {
    let that = this
    let categoryFirstIndex = e.target.dataset.index
    let item = e.target.dataset.item
    let name = e.target.dataset.name
    this.setData({
      [name]:categoryFirstIndex,
      categoryName: item.name,
      moreList: [],
      loadMore: true,
      pageNo: 1,
      categoryId:item.id
    })
    if (name == 'categoryFirstIndex'){
      this.setData({
        categorySecondIndex: null,
        categoryThirdIndex: null
      })
    }
    if (name == 'categorySecondIndex') {
      this.setData({
        categoryThirdIndex: null
      })
    }
    // this.closeMask()
    this.getGoodsList()
  },

  // 获取商品ID跳转到详情
  goDetails: function(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/index/details/details?prodId=' + item.id
    });
  }
})