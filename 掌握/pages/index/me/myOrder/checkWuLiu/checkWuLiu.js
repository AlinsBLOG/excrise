// pages/index/me/myOrder/myOrder/checkWuLiu.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;//订单id
    this.setData({
      id,
    });
    this.Shipping();

  },
  // 物流追踪
  Shipping: function () {
    var that = this;
    var id = that.data.id;//订单id
    var token_id = App.globalData.meData.token_id;
    var data = { id, token_id };
    // var contexts = that.data.contexts;    
    App.request(
      'order/shipping',
      'POST',
      data,
      function (res) {
        if (res.data.status == 1 && res.data.message == "成功") {
          console.log(res);
          var Shipping = res.data.data;
          var shippingList = Shipping.data||[];
          if (shippingList.length==0){
              that.setData({
                  showLoading:false
              });
                wx.showToast({
                    title: '暂无物流信息',
                    icon:"none"
                })
                return;
          }
          console.log("=============       ")
          console.log(shippingList);          
          shippingList.forEach((i,v)=>{
            //   console.log(i.context)
              var context = that.formart(i.context);
            //   console.log(context);
              i.context = context;
          })
          that.setData({
            Shipping,
            showLoading: false,
            // contexts,
          });
        //   console.log(that.data.Shipping);
          
        }

      }
    )
  },
  // 复制物流单号
  copy: function () {
    var that = this;
    wx.setClipboardData({
      data: that.data.Shipping.nu,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: "none"
        })
      }
    })
  },
  click(e) {
      var dataset = e.currentTarget.dataset;
      var text = dataset.text;
      var click = dataset.click;
      console.log(text);
      // console.log(click);
      if (click == true) {
          wx.makePhoneCall({
              phoneNumber: text,
          })
      }
  },
  formart(str) {
    //   var reg = /\d{11}/g;//手机
      var reg = /\d{11}|0\d{1,4}-\d{7,9}|\d{7,9}/g;
      var phones = str.match(reg);
      var arr = str.split(reg);
    //   console.log(arr);
      var element = [];
      for (var i = 0; i < arr.length; i++) {
          var item = {
              text: arr[i],
              click: false
          }
          element.push(item);
          if (i == arr.length - 1) {
              break;
          }
          var item2 = {
              text: phones[i],
              click: true
          }

          element.push(item2);
      }

      return element;
  },

})