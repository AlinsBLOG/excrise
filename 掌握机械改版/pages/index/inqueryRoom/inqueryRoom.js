const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();
Page({
  data: {
    navTab: [{
        name: '全部',
        state: 9
      },
      {
        name: '报价中',
        state: 1
      },
      {
        name: '已完成',
        state: 10
      }
    ],
    inqueryList: [],
    currentTab: 0, //预设当前项的值
    pageNo: 1,
    state: 9,
    loadMore: true,
    stateList: App.globalData.stateList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInqueryList()
  },
  getInqueryList() {
    let {
      loadMore,
      inqueryList,
      pageNo,
      state
    } = this.data
    let data = {
      tenantId: App.globalData.tenantId,
      pageNo
    }
    if (state) {
      data.state = state
    }
    if (loadMore) {
      wx.showLoading({
        title: '加载中...',
      })
      util.request(api.getInqueryList, data).then(res => {
        if (pageNo == res.pageCount) {
          this.setData({
            loadMore: false
          })
        }
        if (res.data) {
          let centerVal = res.data
          centerVal = centerVal.map(item => {
            item.createTime = util.formatTime(item.createTime)
            return item
          })
          inqueryList = inqueryList.concat(centerVal)
        }
        this.setData({
          inqueryList,
          pageNo: pageNo + 1
        })
        wx.hideLoading()
      })
    }
  },

  swichNav: function(e) {
    const cur = e.target.dataset.current
    const {
      navTab
    } = this.data
    if (this.data.currentTaB == cur) return
    this.setData({
      currentTab: cur,
      state: navTab[cur].state,
      inqueryList: [],
      pageNo: 1,
      loadMore: true
    })
    this.getInqueryList()
  },

  goInqueryDetail: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let userInfo = util.getStorageSync('userInfo')
    let registerInfo = util.getStorageSync('registerInfo')
    if (userInfo) {
      util.request(api.userProvider, {
        userId: userInfo.userId,
        tenantId: App.globalData.tenantId
      }, 'GET').then(res => {
        if (res.success) {
          console.log(res)
          if (res.data !== null) {
            if (!res.data.token) {
              registerInfo = {
                ...res.data,
                ...registerInfo
              }
            } else {
              registerInfo = {
                ...registerInfo,
                ...res.data
              }
            }
            wx.setStorageSync('registerInfo', JSON.stringify(registerInfo))
            if (res.data && res.data.apply) {
              if (res.data.apply.state == 2){
                let title = (res.data.apply.type=="MTS"?1:2)
                //认证不通过
                that.navigateTo(`/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authNoPast/authNoPast?title=${title}`)
              } else {
                //认证中
                that.navigateTo(`/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine`)
              }
            } else if (res.data.id){
              that.navigateTo(`/pages/index/inqueryRoom/inqueryOrderDetail/inqueryOrderDetail?id=${id}`)
            }
          } else {
            that.navigateTo('/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/businessAuth')
          }
        }
      })
    } else {
      that.navigateTo('/pages/login/login')
    }
  },
  onPullDownRefresh() {
    // wx.showNavigationBarLoading() //在标题栏中显示加载
  },
  navigateTo(url){
    wx.navigateTo({
      url: url
    })
  }
})