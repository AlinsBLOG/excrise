// pages/webView/webView.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      if(options.promotion_id){
          var webUrl = options.webUrl + "?id=" + options.promotion_id;
          
          console.log(webUrl);
      }else{
          var webUrl = options.webUrl || "";
      }
      
    this.setData({
        webUrl: webUrl,
    })
  },
    onShareAppMessage: function (res) {
        return {
            title: '掌窝工程机械，找挖机配件上掌窝',
            path: 'pages/index/index',
            success: function (res) {
            },
        }
    }

})