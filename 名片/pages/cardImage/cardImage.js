// pages/cardImage/cardImage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  
  },

  /**
   * 保存图片到相册
   */
  saveImg:function(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.downloadFile({
      url: 'https://alpha-mall.7linkshop.com/mall-portal/static/images/login_head_03.png',
      success: function (res) {
        wx.hideLoading()
        let path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '保存成功',
            })
          },
          fail(res) {
            wx.getSetting({
              success:function(res){
                if (res.authSetting['scope.writePhotosAlbum'] !== true){
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                    }
                  });
                }
              }
            })
          }
        })
      }, fail: function (res) {
        console.log(res)
      }
    })
  }
})