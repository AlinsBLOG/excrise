const util = require('./utils/util.js');
const api = require('./config/api.js');

App({
  globalData: {
    userInfo: null,
    sessionKey:'',
    /**
     * 用户创建名片后的默认头像
     */
    defaultImage:'' ,
    cardPhoto:"https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.webp",
    
  },
  onLaunch: function (ops) {
    console.log(ops)
    // 登录
    // wx.login({
    //   success: res => {
    //     const js_code = res.code;
    //     util.request(api.login+'?code=' + js_code, {
    //       code: js_code,
    //     },'POST').then(function (res) {
    //           console.log(res)
    //       //     that.globalData.sessionKey = res.data
    //       //     发送 res.code 到后台换取 openId, sessionKey, unionId
    //     })
    //   }
    // })
    const that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success(response) {
          //     wx.getUserInfo({
          //       success: res => {
          //         that.globalData.userInfo = res.userInfo 
          //         console.log(response)
          //         if (that.userInfoReadyCallback) {
          //           that.userInfoReadyCallback(res)
          //         }
          //       }
          //     })  
          //   },
          //   fail: function (response){
          //     that.noAutoModal();
          //   }
          // })
        }
      }
    })
  
    if (ops.scene == 1044) {
      //1044: 带 shareTicket 的小程序消息卡片
      wx.getShareInfo({
        shareTicket: ops.shareTicket,
        complete(res) {
          console.log(res)
          if (util.checkUserId()){

          }else{
            console.log('user no login')
          }
        }
      })
    }else if(ops.scene == 1001){
      //发现栏小程序主入口
      util.checkUserId(true);
    }
  },
  noAutoModal:function(){
    const that = this;
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用阅读记录功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function success(res) {
              if (res.authSetting['scope.userInfo'] === true) {
                wx.getUserInfo({
                  success: res => {
                    that.globalData.userInfo = res.userInfo
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(res)
                    }
                  }
                })
              }else{
                that.noAutoModal();
              }
            }
          });
        }
      }
    })
  }
})