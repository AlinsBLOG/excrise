// pages/index/class/class.js
const App = getApp();
Page({

    data: {
        showLoading: true,
        likeList: [],
        showMore1: 0,
        showMore2: 0,
        showMore3: 0,
        showMore4: 0,
        companyData: [],
        list: [],
        moreList: [],
        page1: 1,
        page2: 1,
        page3: 1,
        page4: 1,
        pageIndex: 0,
        delBtnWidth: 132//删除按钮宽度单位（rpx）
    },


    onLoad: function (options) {
        this.initEleWidth();
        this.getLikeList1();
        this.getLikeList2();
    },
    onShow: function () {
        this.getColList();
    },
    // 获取收藏商品数据
    getColList: function () {
        var meData = App.globalData.meData;
        this.setData({
            showMore1: 0,
            showMore2: 0,
        });
        var that = this;
        // 商品
        var data1 = {
            token_id: meData.token_id,
            type: 0,
            page: 1
        }
        App.request(
            'user/my_collect',
            'POST',
            data1,
            function (res) {
                console.log(res.data);
                that.setData({
                    list: res.data.data.goods,
                    showLoading: false,
                    showMore1: res.data.data.goods.length == 20 ? 0 : 2
                })

                if (!that.data.list.length == 0) {
                    that.setData({
                        searchNull: false
                    })
                } else {
                    that.setData({
                        searchNull: true
                    })
                }
            }
        );

        // 店铺
        var data2 = {
            token_id: meData.token_id,
            type: 2,
            page: 1
        }
        App.request(
            'user/my_collect',
            'POST',
            data2,
            function (res) {
                console.log(res.data);
                that.setData({
                    companyData: res.data.data.company,
                    showLoading: false,
                    showMore2: res.data.data.company.length == 5 ? 0 : 2
                })


                if (!that.data.companyData.length == 0) {
                    that.setData({
                        companyNull: false
                    })
                } else {
                    that.setData({
                        companyNull: true
                    })
                }
            }
        );
    },

    // 获取更多商品
    getMoreList: function () {
        console.log("1");

        var meData = App.globalData.meData;
        var that = this
        this.setData({ showMore1: 1 });
        var page1 = this.data.page1;
        page1++;
        var data = {
            token_id: meData.token_id,
            type: 0,
            page: page1
        }
        App.request(
            'user/my_collect',
            'POST',
            data,
            function (res) {

                var moreList = res.data.data.goods
                var list = that.data.list.concat(moreList)

                that.setData({
                    list,
                    page1,
                    showMore1: moreList.length == 20 ? 0 : 2
                });

            }
        )
    },

    // 获取更多商家
    getMoreCompany: function () {
        console.log("2");

        var meData = App.globalData.meData;
        var that = this
        this.setData({ showMore2: 1 });
        var page2 = this.data.page2;
        page2++;
        var data = {
            token_id: meData.token_id,
            type: 2,
            page: page2
        }
        App.request(
            'user/my_collect',
            'POST',
            data,
            function (res) {

                var moreCompany = res.data.data.company
                var companyData = that.data.companyData.concat(moreCompany)

                that.setData({
                    companyData,
                    page2,
                    showMore2: moreCompany.length == 5 ? 0 : 2
                });

            }
        )
    },



    changePage: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            pageIndex: index
        });
    },
    ////////////////////////////////

    touchS: function (e) {
        if (e.touches.length == 1) {
            this.setData({
                //设置触摸起始点水平方向位置
                startX: e.touches[0].clientX
            });

        }
    },
    touchM: function (e) {
        if (e.touches.length == 1) {
            //手指移动时水平方向位置
            var moveX = e.touches[0].clientX;
            //手指起始点位置与移动期间的差值
            var disX = this.data.startX - moveX;
            var delBtnWidth = this.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0px";
            } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.index;

            var list = this.data.list;
            list[index].txtStyle = txtStyle;

            //更新列表的状态
            this.setData({
                list: list
            });
        }
    },

    touchE: function (e) {
        if (e.changedTouches.length == 1) {
            //手指移动结束后水平位置
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = this.data.startX - endX;
            var delBtnWidth = this.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.index;
            var list = this.data.list;

            list[index].txtStyle = txtStyle;
            //更新列表的状态
            this.setData({
                list: list
            });

        }
    },
    //获取元素自适应后的实际宽度
    getEleWidth: function (w) {
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
            real = Math.floor(res / scale);
            return real;
        } catch (e) {
            return false;
            // Do something when catch error
        }
    },
    initEleWidth: function () {
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: delBtnWidth
        });
    },
    //点击删除按钮事件
    delItem: function (e) {

        var meData = App.globalData.meData;
        var that = this
        //获取列表中要删除项的下标
        var id = e.currentTarget.dataset.text.goods_id;
        var index = e.currentTarget.dataset.index;
        var data = {
            token_id: meData.token_id,
            type: 0,
            id
        }
        App.request(
            'data/fun_collect_del',
            'POST',
            data,
            function (res) {
                console.log(res.data.status);
                if (res.data.status == 1) {
                    var list = that.data.list;
                    list.splice(index, 1);
                    that.setData({
                        list
                    })
                    let searchNull = that.data.list.length == 0? true:false;
                    that.setData({
                        searchNull
                    })
                    wx.showToast({
                        title: "删除成功",
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                    })
                }
                
            }
        )
    },


    ////////////////////////////////

    // 取消收藏店铺
    delCompany: function (e) {

        var meData = App.globalData.meData;
        var that = this
        //获取列表中要删除项的下标
        var id = e.currentTarget.dataset.text.id;
        var index = e.currentTarget.dataset.index;
        var data = {
            token_id: meData.token_id,
            type: 2,
            id
        }
        App.request(
            'data/fun_collect_del',
            'POST',
            data,
            function (res) {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                })
                var companyData = that.data.companyData;
                companyData.splice(index, 1);
                that.setData({
                    companyData
                })
                if (that.data.companyData.length == 0) {
                    that.setData({
                        companyNull: true
                    })
                } else {
                    that.setData({
                        companyNull: false
                    })
                }
            }
        )
    },
    // 获取商品ID跳转到详情
    goDetails: function (e) {
        var id = e.currentTarget.dataset.text.id;
        var goods_id = e.currentTarget.dataset.text.goods_id;

        wx.navigateTo({
            url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
        });
    },
    // 跳转到商家店铺
    goCompany: function (e) {
        var id = e.currentTarget.id
        wx.navigateTo({
            url: '/pages/index/company/company?id=' + id
        });
    },
    // 猜你喜欢1
    getLikeList1: function () {
        console.log("3");

        var that = this;
        this.setData({ showMore3: 1 });
        var page3 = this.data.page3
        var data = {
            page: page3,
            token_id: App.globalData.meData.token_id
        }
        App.request(
            'index/index_more',
            'POST',
            data,
            function (res) {


                var moreLike = res.data.data
                var likeList = that.data.likeList.concat(moreLike)

                page3++
                that.setData({
                    likeList,
                    page3,
                    showMore3: moreLike.length == 20 ? 0 : 2
                })

            }
        );
    },
    // 猜你喜欢2
    getLikeList2: function () {
        console.log("4");

        var that = this;
        this.setData({ showMore4: 1 });
        var page4 = this.data.page4
        var data = {
            page: page4,
            token_id: App.globalData.meData.token_id
        }
        App.request(
            'index/index_more',
            'POST',
            data,
            function (res) {

                var moreLike = res.data.data
                var likeList = that.data.likeList.concat(moreLike)

                page4++
                that.setData({
                    likeList,
                    page4,
                    showMore4: moreLike.length == 20 ? 0 : 2
                })
            }
        );
    },

})
