const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    selfCard:false,
    current: {},
    currentIndex:0,
    myCardList:[{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const user = util.checkUserId();
    if (user) {
      this.setData({
        userInfo: user
      })
    }
    that.getMyCardListFunction();
  },

  onPullDownRefresh:function(){
    this.getMyCardListFunction();
  },

  /**
   * 长按选择
   */
  chooseAction: function (event) {
    const cardId = event.currentTarget.dataset.cardid;
    const userId = this.data.userInfo.id;
    const that = this;
    if (cardId){
      wx.showActionSheet({
        itemList: ['设置默认', '删除名片'],
        success: function (e) {
          const tapIndex = e.tapIndex;
          if (tapIndex == 0) {
            util.request(api.setDefaultCardInfo + '?userId=' + userId + '&cardId=' + cardId, {}, 'POST').then(function (res) {
              util.showSuccessToast('设置默认名片成功');
              that.getMyCardListFunction();
            })
          } else if (tapIndex == 1) {
            wx.showModal({
              title: '删除名片',
              content: '点击确定删除该名片？',
              success: function (res) {
                if (res.confirm) {
                  util.request(api.deleteCardInfo + '?userId=' + userId + '&id=' + cardId).then(function (res) {
                    util.showSuccessToast('删除名片成功');
                    that.getMyCardListFunction();
                  })
                }
              }
            })
          }
        }
      })
    }
  },

  // 检测授权状态
  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用阅读记录功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                    }
                  });
                }
              }
            })
          }
        }
      }
    });
  },

  getMyCardListFunction:function(){
    const user = util.checkUserId();
    const that = this;
    if (user) {
      wx.showNavigationBarLoading();
      //获取个人名片列表
      util.request(api.getMyCardList + '?userId=' + user.id+'&pageNo=1&pageSize=10', {},'POST').then(function (res) {
        if (res && res.length) {
          let current;
          res.map(function(item,index){
            if (item.isDefault){
              current = item;
              that.setData({
                currentIndex: index
              })
              app.globalData.defaultImage = item.cardPhoto
            }
          })
          that.setData({
            myCardList: res,
            current: current,
            selfCard: true,
          })
        }else{
          that.setData({
            selfCard: false,
            current: {},
            currentIndex: 0,
            myCardList: [{}]
          })
        }
        util.stop();
      })
    }
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  /**
   * 进入到人气榜
   */
  hotPage:function(){
    wx.navigateTo({
      url: '/pages/hotPage/hotPage',
    })
  },

  /**
   * 进入到名片图片
   */
  toCardImage:function(){
    wx.navigateTo({
      url: '/pages/cardImage/cardImage',
    })
  },

  /**
   * 进入到名片码
   */
  toCardNumber:function(){
    wx.navigateTo({
      url: '/pages/cardNumber/cardNumber',
    })
  },

  createCardByNoLogin:function(){
    const user = util.checkUserId();
    wx.navigateTo({
      url: '/pages/createCard/createCard'
    })
  },

  swiperScrollChange: function (event){
    const currentIndex = event.detail.current;
    const myCardList = this.data.myCardList;
    this.setData({
      current: myCardList[currentIndex]
    })
  },

  makePhoneCall:function(e){
    const phone = e.currentTarget.dataset.phone;
    if(util.checkMobile(phone)){
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  },

  editCard:function(e){
    const cardId = e.currentTarget.dataset.cardid;
    const userId = e.currentTarget.dataset.userid;
    if (cardId){
      wx.navigateTo({
        url: '/pages/myCardEdit/myCardEdit?cardId=' + cardId + '&userId=' + userId
      })
    }
  },

  myCardDetail: function (e) {
    if (this.endTime - this.startTime < 350) {
      const cardId = e.currentTarget.dataset.cardid;
      const userId = util.checkUserId().id;
     if(cardId){
       wx.navigateTo({
         url: '/pages/myCardDetail/myCardDetail?cardId=' + cardId + '&userId=' + userId
       })
     }
    }
  },

  aboutMe: function (e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/aboutMe/aboutMe?type=' + type,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})