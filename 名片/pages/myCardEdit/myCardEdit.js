const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardPhoto: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    cardDetail:{},
    cardId:'',
    region: [],
    radioG: [
      { name: '0', value: '任何人可看' },
      { name: '1', value: '联系人可看' }
    ]
  },

  /**
   * 选择图片
   */
  chooseImg: function () {
    const that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: function (e) {
        let type = ['camera'];
        if (e.tapIndex == 1) {
          type = ['album'];
        }
        wx.chooseImage({
          sourceType: type,
          success: function (res) {
            that.setData({
              cardPhoto: res.tempFilePaths[0]
            })
          },
        })
      }
    })
  },

  formSubmit: function (e){
    const that = this;
    let value = e.detail.value;
    const { cardPhoto, cardId } = that.data;
    const user = util.checkUserId();
    value = { ...value, id:cardId,cmpAddress: value.cmpAddress.join(' '), cardPhoto, isDefault: (value.isDefault ? 1 : 0) };
    console.log(value)
    if (!util.checkMobile(value.mobile)) {
      util.showErrorToast('手机格式不正确')
      return
    }
    if (value.email) {
      if (!util.checkEmail(value.email)) {
        util.showErrorToast('邮箱格式不正确')
        return
      }
    }
    if (user) {
      wx.showLoading({
        title: '加载中...',
      })
      util.request(api.modifyCardInfo + '?userId=' + user.id, value, 'POST').then(function (res) {
        wx.hideLoading()
        util.showSuccessToast('修改成功');
        util.reloadBfeorePage();
      })
    }
  },

  /**
   * 删除卡片
   */
  deleteCard:function(){
    const { cardId } = this.data;
    const user = util.checkUserId();
    wx.showModal({
      title: '删除名片',
      content: '点击确定删除该名片？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.deleteCardInfo + '?userId=' + user.id + '&id=' + cardId).then(function (res) {
            util.showSuccessToast('删除名片成功');
            util.reloadBfeorePage();
          })
        } 
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const cardId = options.cardId;
    const userId = options.userId;
    wx.showLoading({
      title: '加载中...',
    })
    util.request(api.getMyCardDetail + '?id=' + cardId).then(function (res) {
      that.setData({
        cardId: cardId,
        cardDetail: res,
        cardPhoto: res.cardPhoto,
        region: (res.cmpAddress ? res.cmpAddress.split(' '):[])
      })
      wx.hideLoading();
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 是选择打开相机还是直接选择相册
   */
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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