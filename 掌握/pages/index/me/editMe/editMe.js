const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageChange:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // avatarImg: null
    // mobile: "13527142146"
    // nickName: "13527142146"
    // realName: "13527142146"
    // userId: 19
    let userInfo = util.getStorageSync('userInfo')
    console.log(userInfo)
    this.setData({
      ...userInfo
    })
  },
  change(e){
    console.log(e)
    const value = e.detail.value
  },

  comfirmAdd(e){
    console.log(e)
    const obj = e.detail.value
    const { userId, imageChange, avatarImg } = this.data
    if (!util.checkPhoneNum(obj.mobile)) return
    if (imageChange){
      util.uploadFileGroup([avatarImg])
    }
    wx.showLoading({
      title: '正在修改...',
    })
    util.request(api.modifyUser,{
      ...obj,
      userId,
      avatarImg
    },'POST').then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '修改成功'
      })
      util.request(api.userInfo, { userId }, 'GET').then(info => {
        wx.setStorageSync('userInfo', JSON.stringify(info.data))
      })
      setTimeout(function(){
        util.reloadBfeorePage()
      },700)
    })

  },
  changeImg(){
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          avatarImg: tempFilePaths[0],
          imageChange:true
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