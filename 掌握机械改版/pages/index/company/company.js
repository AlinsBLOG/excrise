// pages/index/company/company.js
const App = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {


        height: 596,
        disabled: false,
        time: '获取验证码',
        currentTime: 60,
        showLoading: true,
        isCollect: false,
        isTied: false,
        isTieUp: false,
        bannerIndex: 0,
        // name2:"产品类型",
        name2: "产品类型▼",
        filValue: 0,
        isScroll: true,
        isHidden: true,
        companyData: {},
        resData: {},
        cGoodsData: {},
        list: {},
        page: 1,
        selectValue: 1,
        showMore: null,
        scrollTop: 0,
        showReturn: false,
        type: 0,
        title: '',
        id: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //   console.log("onload");
        var that = this
        if (App.globalData.meData && App.globalData.meData != '') {
            var isTied = App.globalData.isTied;
            var identity = App.globalData.meData.identity;

            console.log(identity)
            this.setData({
                id: options.id || '',
                isTied,
                identity
            })
            this.getType();
            var page = this.data.page;
            var data = {
                token_id: App.globalData.meData.token_id,
                id: this.data.id,
                order: this.data.selectValue,
                page
            }
            App.request(
                'index/company',
                'POST',
                data,
                function(res) {
                    that.setData({
                        resData: res.data.data,
                        companyData: res.data.data.company,
                        list: res.data.data,
                        kfCount: res.data.data.kf.account,
                        showLoading: false
                    })
                    wx.setNavigationBarTitle({
                        title: that.data.companyData.title,
                    })
                    if (res.data.data.collect == 1) {
                        that.setData({
                            isCollect: true
                        })
                    } else {
                        that.setData({
                            isCollect: false
                        })
                    }
                    console.log(res.data.data);
                    that.anima();
                    //初始化滚动吸附的高度
                    that.initClientRect();
                })
            this.getGoodsList();
        } else {
            console.log(222);
            App.login().then((res) => {
                console.log(res);
                var isTied = App.globalData.isTied;
                var identity = App.globalData.meData.identity;
                this.setData({
                    id: options.id || '',
                    isTied,
                    identity
                })
                this.getType()
                var page = this.data.page;
                var data = {
                    token_id: App.globalData.meData.token_id,
                    id: this.data.id,
                    order: this.data.selectValue,
                    page
                }
                App.request(
                    'index/company',
                    'POST',
                    data,
                    function(res) {
                        that.setData({
                            resData: res.data.data,
                            companyData: res.data.data.company,
                            list: res.data.data,
                            showLoading: false
                        })
                        wx.setNavigationBarTitle({
                            title: that.data.companyData.title,
                        })
                        if (res.data.data.collect == 1) {
                            that.setData({
                                isCollect: true
                            })
                        } else {
                            that.setData({
                                isCollect: false
                            })
                        }
                        // console.log(res.data.data);
                        that.anima();
                        that.initClientRect();

                    })

                this.getGoodsList();
            });

        }
        // this.getTypeList()
    },
    onShow:function(){
        if (App.globalData.meData && App.globalData.meData != '') {
            // 更新登录、认证等信息
            this.get_refresh_info();
        }
    },
    anima: function() {
        var that = this;
        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'linear',
            delay: 100,
            success: function(res) {}
        })
        this.animation.opacity(1).step()
        this.setData({
            //输出动画
            animation: this.animation.export()
        })
        setTimeout(() => {
            that.animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'linear',
                delay: 100,
                success: function(res) {}
            })
            that.animation.opacity(0).step()
            that.setData({
                //输出动画
                animation: that.animation.export()
            })
        }, 3000);
    },
    // 轮播图变化
    bannerChange: function(e) {
        this.setData({
            bannerIndex: e.detail.current
        });
    },
    //按需跳转
    goTo: function(e) {
        var that = this;
        if (this.data.isTied) {
            var is_audit = App.globalData.meData.is_audit;
            if (is_audit != 2) {
                this.goAuthentication();
            } else {
                var id = e.currentTarget.id
                var title = e.currentTarget.dataset.text
                if (id == 2) {
                    wx.navigateTo({
                        url: '/pages/index/company/company?id=' + title
                    });
                }
                if (id == 5) {
                    wx.navigateTo({
                        url: '/pages/webView/webView?webUrl=' + title
                    });
                }
            }
        } else {
            wx.showToast({
                title: "请先绑定手机",
                icon: 'none',
                mask: true,
            })
            setTimeout(() => {
                that.tieUp()
            }, 600);
        }

    },

    // 获取商品列表
    getGoodsList: function() {
        var that = this
        var page = this.data.page;
        var type = this.data.type;

        var data = {
            id: this.data.id,
            order: this.data.selectValue,
            type,
            token_id: App.globalData.meData.token_id,
            page
        }
        App.request(
            'index/companylist',
            'POST',
            data,
            function(res) {
                that.setData({
                    cGoodsData: res.data.data.goods
                })
                // console.log(res.data.data);
                that.closeMask();
            })
    },
    // 获取商品列表(点击完毕回到顶部)
    getGoodsList2: function() {
        var that = this
        var page = this.data.page;
        // 1
        var type = this.data.type;

        var data = {
            id: this.data.id,
            order: this.data.selectValue,
            type,
            token_id: App.globalData.meData.token_id,
            page
        }
        App.request(
            'index/companylist',
            'POST',
            data,
            function(res) {
                that.setData({
                    cGoodsData: res.data.data.goods
                })
                // console.log(res.data.data);
                that.closeMask();
                that.setData({
                    scrollTop: 560
                })
            })
    },
    showText: function() {
        if (this.data.isHidden == true) {
            this.setData({
                isHidden: false
            })
        } else {
            this.setData({
                isHidden: true
            })
        }
    },
    // 获取更多商品
    getMoreList: function() {
        var that = this
        this.setData({
            showMore: 1
        });
        var page = this.data.page;
        page++;
        // 1
        var type = this.data.type;

        var data = {
            id: this.data.id,
            page: page,
            order: this.data.selectValue,
            type,
            token_id: App.globalData.meData.token_id
        }
        App.request(
            'index/companylist',
            'POST',
            data,
            function(res) {
                var list = res.data.data.goods
                var moreList = that.data.cGoodsData.concat(list)

                that.setData({
                    cGoodsData: moreList,
                    page,
                    showMore: list.length == 20 ? 0 : 2
                });
            }
        )
    },
    // 获取商品ID跳转到详情
    goDetails: function(e) {
        var that = this;
        if (this.data.isTied) {
            var is_audit = App.globalData.meData.is_audit;
            if (is_audit != 2) {
                this.goAuthentication();
            } else {
                var id = e.currentTarget.id
                var title = e.currentTarget.dataset.text
                if (id == 2) {
                    wx.navigateTo({
                        url: '/pages/index/company/company?id=' + title
                    });
                }
                if (id == 5) {
                    wx.navigateTo({
                        url: '/pages/webView/webView?webUrl=' + title
                    });
                }
                var id = e.currentTarget.dataset.text.id;
                var goods_id = e.currentTarget.dataset.text.goods_id;

                wx.navigateTo({
                    url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
                });
            }
        } else {
            wx.showToast({
                title: "请先绑定手机",
                icon: 'none',
                mask: true,
            })
            setTimeout(() => {
                that.tieUp()
            }, 600);
        }
        //   

    },
    //   初始化sticky 菜单的初始高度
    initClientRect: function() {
        var that = this;
        var query = wx.createSelectorQuery()
        query.select('#optionsBox').boundingClientRect()
        query.exec(function(res) {
            // console.log("距离顶部的初始值",res);
            that.setData({
                height: res[0].top - 45
            })
        })
    },
    // 滑动屏幕
    containerScroll: function(e) {
        var that = this;
        var scrollTop = e.detail.scrollTop;
        //   console.log(this.data.height);
        //   console.log(scrollTop)
        this.setData({
            showReturn: scrollTop > 640,
            fix: scrollTop >= this.data.height,

        });
        //   console.log(this.data.fix)
    },
    // 人气
    select1: function() {
        if (this.data.selectValue != 1) {
            this.setData({
                showMore: 0,
                page: 1,
                selectValue: 1
            });
            this.getGoodsList();
        }
    },

    // 联系
    select2: function() {
        if (this.data.selectValue != 2) {
            this.setData({
                showMore: 0,
                page: 1,
                selectValue: 2
            });
            this.getGoodsList();
        }
    },
    // 新品
    select3: function() {
        if (this.data.selectValue != 3) {
            this.setData({
                showMore: 0,
                page: 1,
                selectValue: 3
            });
            this.getGoodsList();
        }
    },
    // 价格
    select45: function() {
        var selectValue = this.data.selectValue == 5 ? 4 : 5;
        this.setData({
            showMore: 0,
            page: 1,
            selectValue: selectValue
        });
        this.getGoodsList();
    },
    // 产品类型
    toggleFiltrate: function() {
        // debugger;
        //   console.log(this.data.filValue, this.data.fix);
        if (this.data.filValue != 2) {
            if (!this.data.fix) {
                this.setData({
                    //   scrollTop: this.data.height
                })
            }
            this.setData({
                // isScroll:false,
                fix: true,
                showMore: 0,
                page: 1,
            });
        };
        let filValue = this.data.filValue == 0 ? 2 : 0;
        let name2 = this.data.name2;
        // let reg = new RegExp("产品类型");
        // console.log(reg);
        // name2 = reg.test(name2) ? "产品类型" :name2;
        // console.log(name2);
        this.setData({
            filValue,
            // isScroll:true,
        });

    },

    // 改变类型
    changeType: function(e) {
        var lastType = e.target.id;
        this.setData({
            type: lastType
        })
        this.getGoodsList2();
        this.changeName2(e)
    },
    // 改变框内名字
    changeName2: function(e) {
        var name2 = e.target.dataset.text + "▲"
        if (name2.length > 4) {
            var word = name2.substring(0, 3) + "...";
            name2 = word + "▲";
        }
        this.setData({
            name2
        })
    },
    // 关闭蒙版
    closeMask: function() {
        this.setData({
            filValue: 0,
            //   isScroll:true,
            fix: false
        })
    },
    // 返回顶部
    returnTop: function() {
        this.setData({
            scrollTop: 0,
            showReturn: false
        });
    },
    goCSearch: function() {
        var that = this;
        if (this.data.isTied) {
            var is_audit = App.globalData.meData.is_audit;
            if (is_audit != 2) {
                this.goAuthentication();
            } else {
                var id = this.data.id
                var title = this.data.companyData.title
                wx.navigateTo({
                    url: '/pages/index/company/cSearch/cSearch?id=' + id + '&title=' + title
                });
            }
        } else {
            wx.showToast({
                title: "请先绑定手机",
                icon: 'none',
                mask: true,
            })
            setTimeout(() => {
                that.tieUp()
            }, 600);
        }

    },
    // 收藏按钮
    collect: function() {
        var that = this;
        if (this.data.isTied == true) {
            if (this.data.isCollect == false) {

                this.colCompany();

            } else if (this.data.isCollect == true) {

                this.delCompany();
            }
        } else {
            wx.showToast({
                title: "请先绑定手机",
                icon: 'none',
                mask: true,
            })
            setTimeout(() => {
                that.tieUp()
            }, 600);
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        var id = this.data.companyData.id;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target)
        }
        return {
            title: this.data.companyData.title,
            path: '/pages/index/company/company?id=' + id,
            //   path: `/pages/index/index?id=${id}&share_query=company`,

            //   imageUrl: this.data.companyData.img_logo,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },



    // 获取验证码
    formSubmit: function() {

        var that = this;
        var phone = this.data.phoneNum;
        //   console.log(phone);
        var data = {
            mobile: phone
        }
        App.request(
            'config/sms',
            'POST',
            data,
            function(res) {
                if (res.data.status == 1) {
                    //   console.log("发送成功");
                    that.setData({
                        disabled: true
                    })
                    var currentTime = that.data.currentTime
                    var time = setInterval(function() {
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
                    //   console.log("发送失败");
                    wx.showToast({
                        title: '手机号不正确',
                        image: '../../../images/icons/me/fail.png',
                    })
                }
            })
    },
    //  验证码验证并绑定手机
    verify: function() {
        var that = this;
        var mobile = this.data.phoneNum;
        var mobile_code = this.data.codeNum;
        var xcx_openid = App.globalData.openid;
        var nickname = this.data.nickName;

        //   console.log(mobile,mobile_code,xcx_openid,nickname);
        var data = {
            mobile,
            mobile_code,
            xcx_openid,
            nickname
        }
        App.request(
            'config/sms_login',
            'POST',
            data,
            function(res) {
                //   console.log(res);

                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    mask: true,
                })
                if (res.data.status == 1) {
                    // 快捷登录
                    var data = {
                        xcx: App.globalData.openid
                    }
                    App.request(
                        'config/quick_login',
                        'POST',
                        data,
                        function(res) {
                            // console.log(res);
                            if (res.data.status == -1) {
                                App.globalData.isTied = false;
                            } else if (res.data.status == 1) {
                                App.globalData.isTied = true;
                            }
                            App.globalData.meData = res.data.data;
                            that.setData({
                                isTied: true
                            })
                            that.goback()
                        }
                    );

                }
            })
    },
    // 手机号部分
    inputPhoneNum: function(e) {

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
    checkPhoneNum: function(phoneNum) {
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
    inputCodeNum: function(e) {
        let codeNum = e.detail.value
        this.setData({
            codeNum
        })
    },
    goback: function() {
        this.setData({
            isTieUp: false
        })
    },

    // 收藏商品
    colCompany: function(e) {

        var meData = App.globalData.meData;
        var that = this
        //获取列表中的下标
        var id = this.data.id;
        var data = {
            token_id: meData.token_id,
            type: 2,
            id
        }
        App.request(
            'data/fun_collect',
            'POST',
            data,
            function(res) {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    // mask:true,
                })
                that.setData({
                    isCollect: true
                })
                wx.showToast({
                    title: "收藏成功",
                    icon: 'none',
                    data
                    // mask: true,
                })
            }
        )
    },

    // 取消收藏
    delCompany: function() {

        var meData = App.globalData.meData;
        var that = this
        //获取列表中要删除项的下标
        var id = this.data.id;
        var data = {
            token_id: meData.token_id,
            type: 2,
            id
        }
        App.request(
            'data/fun_collect_del',
            'POST',
            data,
            function(res) {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                })
                that.setData({
                    isCollect: false
                })
                wx.showToast({
                    title: "已取消收藏",
                    icon: 'none',
                })
            }
        )
    },
    tieUp: function() {
        this.setData({
            isTieUp: true
        })
    },
    //   获取分类
    getType() {
        // index / get_type_by_company
        var that = this;
        var cid = this.data.id;
        // console.log(cid);
        var data = {
            cid,
        };
        App.request(
            "index/get_type_by_company",
            "POST",
            data,
            function(res) {
                // console.log(res);
                that.setData({
                    typeList: res.data.data
                });
                // console.log(that.data.typeList);
            }
        );
    },
    // 点击切换二级分类
    toggleNextType(e) {
        // console.log(e.currentTarget.dataset.children);
        var nexTypeList = e.currentTarget.dataset.children || [];
        var nextType = e.currentTarget.dataset.id;
        this.setData({
            nexTypeList,
            nextType,
        });
        // console.log(this.data.nexTypeList);

    },
    // 云信im客服系统
    goContact(e) {
        var that = this;
        // console.log(e.currentTarget.dataset.title);
        // console.log(e.currentTarget.dataset.price);
        // console.log(e.currentTarget.dataset.img);
        // var title = e.currentTarget.dataset.title;
        // var price = e.currentTarget.dataset.price;
        // var shopImg = e.currentTarget.dataset.img;
        // var goods_id = that.data.goods_id;
        // var id = that.data.id;

        if (this.data.isTied == true) {
            wx.navigateTo({
                url: `/partials/chating/chating?chatTo=${this.data.kfCount}`,
            })
        } else {
            wx.showToast({
                title: "请先绑定手机",
                icon: 'none',
                mask: true,
            })
            setTimeout(() => {
                that.tieUp()
            }, 600);

        }

    },
    goAuthentication() {
        var is_audit = App.globalData.meData.is_audit;
        console.log(" goAuthentication的" + is_audit)
        if (is_audit == 0 || is_audit == 3) {
            wx.navigateTo({
                url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/businessAuth',
            })
        } else if (is_audit == 1) {
            wx.navigateTo({
                url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine',
            })
        }

    },
    get_refresh_info() {
        var that = this;
        var data = {
            token_id: App.globalData.meData.token_id
        }
        App.request(
            'inquiry/get_refresh_info',
            'POST',
            data,
            function (res) {
                var res = res.data;
                // console.log(App.globalData.meData);
                if (res.status == 1) {
                    var identity = res.data.identity;
                    App.globalData.meData.identity = identity;
                    that.setData({
                        identity: identity
                    })
                }
                that.setData({
                    identity: res.data.identity,
                    is_audit: res.data.is_audit,
                });
            }
        );
    },
})