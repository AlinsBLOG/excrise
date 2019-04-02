// pages/inqueryTab/inqueryTab.js
const App = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag: false,
        // 登录
        time: '获取验证码',
        currentTime: 60,
        isTied: false,
        isTieUp: false,
        // 登录    
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
        var meData = App.globalData.meData;
        // console.log(App.globalData.meData);
        if (meData && meData != '') {
            // console.log(111);
            var isTied = App.globalData.isTied;
            var is_audit = meData.is_audit;
            console.log(isTied, is_audit);
            this.setData({
                isTied,
                is_audit
            });
        } else {
            App.getTokenCallback = meData => {
                if (meData != '') {
                    var isTied = App.globalData.isTied;
                    var is_audit = meData.is_audit;
                    this.setData({
                        isTied,
                        is_audit
                    });
                }
            }
        }
        if (this.data.flag) {
            wx.switchTab({
                url: '/pages/index/index',
            })
            this.setData({
                flag: false,
            });
        } else {
            //   已登录
            if (this.data.isTied == true) {
                //   判断是否认证过
                if (this.data.is_audit != 2) {
                    // 跳到认证界面
                    console.log('跳到认证界面');
                    this.goAuthentication();
                    // 初始化，否则回不到首页
                    this.setData({
                        flag: true,
                    });
                } else {
                    wx.navigateTo({
                        url: '/pages/index/class/class',
                    })
                    this.setData({
                        flag: true,
                    });
                    console.log(this.data.flag);
                }
            } else {
                var that = this;
                // 弹出登录
                wx.showToast({
                    title: "请先绑定手机",
                    icon: 'none',
                    mask: true,
                })
                setTimeout(() => {
                    that.tieUp()
                }, 600);
            }

        }

    },
    //   认证
    goAuthentication() {
        console.log("=================",this.data.is_audit);
        if (this.data.is_audit == 0 || this.data.is_audit == 3) {
            wx.navigateTo({
                url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/businessAuth',
            })
        } else if (this.data.is_audit == 1) {
            wx.navigateTo({
                url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine',
            })
        }

    },
    // 登录模块
    // 获取验证码
    formSubmit: function () {

        var that = this;
        var phone = this.data.phoneNum;
        console.log(phone);
        var data = {
            mobile: phone
        }
        App.request(
            'config/sms',
            'POST',
            data,
            function (res) {
                if (res.data.status == 1) {
                    console.log("发送成功");
                    that.setData({
                        disabled: true
                    })
                    var currentTime = that.data.currentTime
                    var time = setInterval(function () {
                        currentTime--;
                        that.setData({
                            time: '已发送(' + currentTime + 's)'
                        })
                        if (currentTime <= 0) {
                            clearInterval(time)
                            that.setData({
                                time: '重新发送',
                                currentTime: 60,
                                disabled: false
                            })
                        }
                    }, 1000)
                } else {
                    console.log("发送失败");
                    wx.showToast({
                        title: '手机号不正确',
                        image: '../../images/icons/me/fail.png',
                    })
                }
            })
    },
    //  验证码验证并绑定手机
    verify: function () {
        var that = this;
        var mobile = this.data.phoneNum;
        var mobile_code = this.data.codeNum;
        var xcx_openid = App.globalData.openid;
        var wx_unionid =  App.globalData.unionid;     
        var nickname = this.data.nickName;
        console.log(mobile, mobile_code, xcx_openid, nickname);
        var data = {
            mobile,
            mobile_code,
            xcx_openid,
            nickname,
            wx_unionid
        }
        App.request(
            'config/sms_login',
            'POST',
            data,
            function (res) {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    mask: true,
                })
                if (res.data.status == 1) {
                    // 快捷登录
                    var data = {
                        xcx: App.globalData.openid,
                        wx_unionid: App.globalData.unionid,          
                    }
                    App.request(
                        'config/quick_login',
                        'POST',
                        data,
                        function (res) {
                            console.log(res);
                            if (res.data.status == -1) {
                                App.globalData.isTied = false;
                            } else if (res.data.status == 1) {
                                App.globalData.isTied = true;
                            }
                            App.globalData.meData = res.data.data;
                            that.setData({
                                isTied: true
                            })
                            if (res.data.data.is_audit != 2) {
                                that.goAuthentication();
                                that.goback()
                            } else {
                                that.goback()
                            }
                        }
                    );

                }
            })
    },
    // 手机号部分
    inputPhoneNum: function (e) {

        let phoneNum = e.detail.value
        if (phoneNum.length === 11) {
            let checkedNum = this.checkPhoneNum(phoneNum)
            if (checkedNum) {
                this.setData({
                    phoneNum: phoneNum
                })
            }
        } else {
            this.setData({
                phoneNum: '手机号不正确'
            })

        }
    },
    checkPhoneNum: function (phoneNum) {
        let str = /^1[34578]\d{9}$/
        if (str.test(phoneNum)) {
            return true
        } else {
            wx.showToast({
                title: '手机号不正确',
                image: '../../../images/icons/me/fail.png',
            })
            return false
        }
    },
    //验证码部分
    inputCodeNum: function (e) {
        let codeNum = e.detail.value
        this.setData({
            codeNum
        })
    },
    goback: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
        this.setData({
            isTieUp: false,
            flag: false,
        })
    },
    tieUp: function () {
        this.setData({
            isTieUp: true
        })
    },
    // 登录模块
    // get_refresh_info() {
    //     var that = this;
    //     var data = {
    //         token_id: App.globalData.meData.token_id
    //     }
    //     App.request(
    //         'inquiry/get_refresh_info',
    //         'POST',
    //         data,
    //         function (res) {
    //             var res = res.data;
    //             if (res.status == 1) {
                    
    //                 App.globalData.meData.is_audit = res.data.is_audit;
    //                 that.setData({
    //                     is_audit: res.data.is_audit,
    //                 });
    //                 // console.log(that.data.is_audit);
    //             }
                
    //         }
    //     );
    // }


})