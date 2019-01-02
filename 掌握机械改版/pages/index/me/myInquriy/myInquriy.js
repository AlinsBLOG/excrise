const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const App = getApp();
Page({
  data: {
    showLoading: false,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    inqueryList: [],
    pageNo: 1,
    state:null,
    stateList: {
      "0": "报价中",
      "1": "报价中",
      "2": "已完成",
      "3": "已成交",
      "8": "审核中",
      "-2": "审核不通过",
    },
    loadMore: true
  },

  swichNav: function(e) {
    const cur = e.target.dataset.current
    const { navTab } = this.data
    if (this.data.currentTaB == cur) return
    this.setData({
      currentTab: cur,
      state: navTab[cur].state,
      inqueryList: [],
      pageNo: 1,
      loadMore: true
    })
    this.getStatusList()
  },
  onLoad: function(options) {
    // type：1询价，2报价
    let title = '我的询价单'
    let type = 1
    if (options && options.type){
      title = options.type == 1 ? "我的询价单" : "我的报价单"
      type = options.type
    }

    if (type == 1){
      this.setData({
        navTab: [
          {
            name: '全部',
            state: null
          },
          {
            name: '报价中',
            state: '8'
          },
          {
            name: '已成交',
            state: '3'
          },
          {
            name: '已关闭',
            state: '2'
          }
         
        ],
      })
    } else if(type == 2){
      this.setData({
        navTab: [
          {
            name: '全部',
            state: null
          },
          {
            name: '报价中',
            state: '1'
          },
          {
            name: '已成交',
            state: '3'
          },
          {
            name: '已关闭',
            state: '2'
          }
        ],
      })
    }
  
    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      type
      // currentTab: options.currentTab
    });
    this.getStatusList();
  },
  getStatusList() {
    const userInfo = util.getStorageSync('userInfo')
    let { loadMore, inqueryList,pageNo, state, type, currentTab } = this.data
    let data = {
      tenantId: App.globalData.tenantId,
      pageNo
    }
    let url = ''
    if(type == 1){
      data.createUser = userInfo.userId
      url = api.getsearch
    } else {
      data.offerCreateUser = userInfo.userId
      url = api.getsearchOfferReq
    }
    if (state){
      data.state = state
    }
    if (loadMore){
      this.setData({
        showLoading:false
      })
      util.request(url, data).then(res => {
        // console.log(res.data)
        if (pageNo == res.pageCount) {
          this.setData({
            loadMore: false
          })
        }
        if (res.data){
          let centerVal = res.data
          centerVal = centerVal.map(item => {
            item.createTime = util.formatTime(item.createTime)
            return item
          })
          inqueryList = inqueryList.concat(centerVal)
        }
        this.setData({
          showLoading: true,
          inqueryList,
          pageNo: pageNo + 1
        })
      })
    }
  },
  goInqueryDetail(e){
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/index/inqueryRoom/inqueryOrderDetail/inqueryOrderDetail?id=${id}&type=${type}&from=list`
    })
  },
  // 获取我的询价单
  getMyInquiry() {
    // if (this.data.inqueryList[this.data.currentTab] != undefined){
    //     return;
    // }
    var requestPath = this.data.requestPath;
    // let requ
    let that = this;
    let currentTab = that.data.currentTab;
    let navTab = that.data.navTab;
    // console.log(that.data.navTab[currentTab].val);
    this.setData({
      showLoading: false,
    });
    let data = {
      token_id: App.globalData.meData.token_id,
      page: that.data.page,
      order_status: that.data.navTab[currentTab].val,
    }
    App.request(
      requestPath,
      'POST',
      data,
      function(res) {
        if (res.data.status == 1) {
          let inqueryList = that.data.inqueryList;
          inqueryList[currentTab] = res.data.data;

          //     if (inqueryList[currentTab] == undefined){
          //         inqueryList[currentTab] = res.data.data;

          //    }else{
          //         inqueryList[currentTab].concat(res.data.data);
          //    }
          that.setData({
            inqueryList,
            showLoading: true,
          });
          // console.log(that.data.inqueryList);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    )
  },
  // 加载更多
  loadMore() {
    this.getStatusList()
  }
})