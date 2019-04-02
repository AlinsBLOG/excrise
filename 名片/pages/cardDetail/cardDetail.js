const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    selfCard: false,
    myCardList: [{
      "userId": "123wew45",
      "availableIdx": 2,
      "photo": "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
      "wallPaper": "http://wewwww.aa.com/bb/cccs "
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const cardId = 1;
    // const visitId = 2;
    const user = util.checkUserId();
    util.request(api.getCardInfo, {
      visitId: user.userId,
      cardId:1
    }).then(function (res) {
      
    })
  },

  makePhoneCall: function (e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  /**
   * 删除名片
   */
  deleteCard:function(){
    const that = this;
    wx.showModal({
      title: '确定删除该名片?',
      success: function (res) {
        if (res.confirm) {
          util.request(api.updateCardFolder, {
            cardId: 1,
            folderId:1,
            action:2
          }).then(function (res) {
            wx.showToast({
              title: '删除成功',
            })
            wx.navigateBack({
              delta:1
            })
          })
        }
      }
    })
  },

  /**
   * 存入通讯录
   */
  saveCard:function(){
    wx.showActionSheet({
      itemList: ['创建新联系人','添加到现有联系人'],
      success: function(res) {
        if (res.tapIndex == 0){
          wx.addPhoneContact({
            firstName: 'test',//联系人姓名  
            mobilePhoneNumber: '13527142146',//联系人手机号  
          })  
        }else{

        }
      },
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