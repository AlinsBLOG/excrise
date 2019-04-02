const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    myCardList:[],
    zan: {
      cancel: false,
      src: '../../static/images/zan.png',
      cancelZan:'',
    },
    cardInfo:{},
    globalImage: app.globalData.cardPhoto,
    modalVisible:false,
    current:0,
    tip:'申请发起名片交换',
    appriseState:false,
  },

  onLoad: function (option) {
    const id = option.cardId;
    this.setData({
      cardId: id
    })
    this.browseCardInfo(id);
  },

  /**
   * 查看名片
   */
  browseCardInfo:function(id){
    const user = util.checkUserId();
    const that = this;
    util.request(api.browseCardInfo, { userId: user.id, cardId:id }, 'GET').then(function (res) {
      that.setData({
        cardInfo:res
      })
    })
  },

  //打电话
  makePhoneCall:function(e){
    const phone = e.currentTarget.dataset.phone;
    if (util.checkMobile(phone)){
      wx.showActionSheet({
        itemList: [phone, '呼叫'],
        success: function (res) {
          wx.makePhoneCall({
            phoneNumber: phone
          })
        },
      })
    }
  },
  
  //获取位置
  makeLocation:function(e){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })  
  },
  //点赞
  zanFunction:function(e){
    let cancel = this.data.zan.cancel;
    let { cardInfo, cardId, appriseState } = this.data;
    const userId = util.checkUserId().id;
    const that = this;
    if (!appriseState){
      util.request(api.appraise, { userId, cardId }, 'GET').then(function (res) {
        console.log(res);
        that.setData({
          appriseState:true,
          cardInfo:{
            ...cardInfo,
            availableIdx: cardInfo.availableIdx+1
          }
        })
        util.showSuccessToast('点赞成功');
      })
    }
   
    return
    if (!cancel){
      this.setData({
        zan: {
          cancel: true,
          src: '../../static/images/cancelZan.png',
          cancelZan: 'cancelZan'
        }
      })
    }else{
      this.setData({
        zan: {
          cancel: false,
          number: 1,
          src: '../../static/images/zan.png',
          cancelZan: ''
        }
      })
    }
  },

  /**
   * 创建我的名片
   */
  createCard:function(){
    wx.navigateTo({
      url: '/pages/createCard/createCard',
    })
  },

  /**
 * 存入通讯录
 */
  saveCard: function () {
    wx.showActionSheet({
      itemList: ['创建新联系人', '添加到现有联系人'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.addPhoneContact({
            firstName: 'test',//联系人姓名  
            mobilePhoneNumber: '13527142146',//联系人手机号  
          })
        } else {

        }
      },
    })
  },

  /**
   * 发起名片交换
   */
  changeCard:function(){
    this.getMyCardListFunction();
  },

  /**
   * 关闭模态框
   */
  closeModal:function(){
    this.setData({
      modalVisible: false
    })
  },

  swiperScrollChange:function(e){
    const { myCardList } = this.data;
    const curr = e.detail.current;
    this.setData({
      current:curr
    })
  },

  certain:function(){
    const that = this;
    that.setData({
      modalVisible:false
    })
    wx.showLoading({
      title: '加载中...',
    })
    const { myCardList, current, cardInfo } = this.data;
    const applyCardId = myCardList[current].id;
    const destCardId = cardInfo.id;
    const userId = util.checkUserId().id;
    util.request(api.exchangeCardInfo, { applyCardId, destCardId, userId }, 'GET').then(function (res) {
      wx.hideLoading();
      that.setData({
        tip: '等待对方验证'
      })
      util.showSuccessToast('提交申请成功');
    })
  },

  /**
   * 获取我的名片列表
   */
  getMyCardListFunction: function () {
    wx.showLoading({
      title: '加载中...',
    })
    const that = this;
    const user = util.checkUserId();
    if (user) {
      //获取个人名片列表
      util.request(api.getMyCardList + '?userId=' + user.id + '&pageNo=1&pageSize=10', {}, 'POST').then(function (res) {
        wx.hideLoading();
        if (res) {
          that.setData({
            modalVisible:true,
            myCardList:res
          })
        }else{
          wx.showModal({
            title: '交换名片失败',
            content: '你还没有名片，点击确定去创建名片',
            success: function (e) {
              if (e.confirm === true) {
                wx.navigateTo({
                  url: '/pages/createCard/createCard',
                })
              }
            }
          })
        }
      })
    }
  },
})
