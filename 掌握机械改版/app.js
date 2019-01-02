// 请求腾讯地图
var requestLocation = function(res, obj) {
  console.log(res);
  var name = res.name;
  var latitude = res.latitude;
  var longitude = res.longitude;
  var locationString = res.latitude + ',' + res.longitude
  wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      "key": "MFRBZ-UH33G-77YQQ-I7RPX-O5525-EMBIW",
      "location": locationString
    },
    method: 'GET',
    success: function(res) {
      //输出一下位置信息  
      console.log('用户位置信息', res.data);
      var addr = res.data.result.address_component
      var code = res.data.result.ad_info
      var region = [];
      region[0] = addr.province;
      region[1] = addr.city;
      region[2] = addr.district;
      obj.setData({
        region,
        address: res.data.result.formatted_addresses.recommend,
        latitude,
        longitude,
        isPicker: true,
        area: code.adcode
      });
    }
  });
}
App({
globalData: {
    tenantId: 5,
    prodId: 2,
    prodCode: 'Product',
    stateList: {
      "0": "待审核",
      "1": "报价中",
      "2": "已完成", //已报满
      "3": "已成交",
      "8": "审核中",
      "-2": "审核不通过",
    },
    isLogin: true
  },
  page: {
    //调试专用
  },
  onLaunch: function() {

  },

  //获取用户不允许打开地理位置权限
  chooseLocation: function(obj) {
    wx.chooseLocation({
      success: (res) => {
        requestLocation(res, obj)
      },
      fail: function() {
        wx.getSetting({
          success: function(res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function(res) {
                        if (res.authSetting["scope.userLocation"] === true) {
                          wx.chooseLocation({
                            success: (res) => {
                              requestLocation(res, obj)
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
        })
      }
    })
  }
})