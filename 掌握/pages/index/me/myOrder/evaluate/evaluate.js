// pages/index/me/myOrder/evaluate/evaluate.js
const App = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fw_scoure: 0,
        wl_scoure: 0,
        nameless: false,
        scoure_text: ['无', '非常差', '差', '一般', '好', '非常好'],
        showLoading: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var goodsList = this.data.goodsList;
        this.setData({
            id: options.id,
        });
        var that = this;
        var data = {
            id: this.data.id,
            token_id: App.globalData.meData.token_id
        }
        App.request(
            'order/order_goods',
            'POST',
            data,
            function(res) {
                var goodsList = res.data.data;
                var data2 = {
                    token_id: App.globalData.meData.token_id
                }
                App.request(
                    'order/label',
                    'POST',
                    data2,
                    function(res) {
                        that.setData({
                            label: res.data.data,
                            showLoading: false,
                        })
                        var label = that.data.label;
                        // 组装初始化数据
                        for (let i = 0; i < goodsList.length; i++) {
                            goodsList[i].scoure = '5'; //初始化
                            goodsList[i].label = JSON.parse(JSON.stringify(label.five)); //初始化标签
                            goodsList[i].photoList = []; //初始化图片列表
                            goodsList[i].img = [];
                            goodsList[i].word = ''; //初始化留言
                        }
                        that.setData({
                            goodsList
                        })
                        console.log(that.data.goodsList);

                    }
                )
            }
        )
    },
    // 获取商品索引
    setGindex: function(e) {
        var Gindex = e.currentTarget.dataset.index; //获取一组商品的索引
        this.setData({
            Gindex
        })
    },
    // 评星级
    setScoure: function(e) {
        var index = e.currentTarget.dataset.index;
        var Gindex = this.data.Gindex;
        var goodsList = this.data.goodsList;
        if (goodsList[Gindex].scoure != index) {
            goodsList[Gindex].scoure = index;
            this.setData({
                goodsList
            })
            this.changeLabel() //根据星评切换label标签
        }
    },
    setFWScoure: function(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            fw_scoure: index
        })
    },
    setWLScoure: function(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            wl_scoure: index
        })
    },
    // 改变标签
    changeLabel: function() {
        var Gindex = this.data.Gindex;
        var goodsList = this.data.goodsList;
        var scoure = goodsList[Gindex].scoure;
        var label = this.data.label;
        if (scoure == 1) {
            goodsList[Gindex].label = label.one;
        } else if (scoure == 2) {
            goodsList[Gindex].label = label.two;
        } else if (scoure == 3) {
            goodsList[Gindex].label = label.three;
        } else if (scoure == 4) {
            goodsList[Gindex].label = label.four;
        } else if (scoure == 5) {
            goodsList[Gindex].label = label.five;
        }
        this.setData({
            goodsList
        })
    },
    // 选择标签
    selectLabel: function(e) {
        // var Gindex = e.currentTarget.dataset.i;
        // var index = e.currentTarget.dataset.j;
        var Gindex = this.data.Gindex;
        var index = e.currentTarget.dataset.index;
        var goodsList = this.data.goodsList;
        if (!goodsList[Gindex].label[index].select) {
            goodsList[Gindex].label[index].select = true;
        } else {
            goodsList[Gindex].label[index].select = false;
        }
        this.setData({
            goodsList
        })

    },
    // 检查搜索框文字、留言评论
    checkSearch: function(e) {
        var Gindex = this.data.Gindex;
        var goodsList = this.data.goodsList;
        goodsList[Gindex].word = e.detail.value;
        this.setData({
            goodsList
        })
    },
    // 删除照片
    del: function(e) {
        var Gindex = this.data.Gindex;
        var goodsList = this.data.goodsList;
        var index = e.currentTarget.dataset.index;
        goodsList[Gindex].photoList.splice(index, 1);
        goodsList[Gindex].img.splice(index, 1);
        this.setData({
            goodsList
        })
    },
    // 添加照片
    add: function() {
        var that = this;
        var Gindex = this.data.Gindex;
        var goodsList = this.data.goodsList;
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                for (let i = 0; i < tempFilePaths.length && goodsList[Gindex].photoList.length < 9; i++) {
                    goodsList[Gindex].photoList.push(tempFilePaths[i]);
                }
                // goodsList[Gindex].photoList.push(tempFilePaths[0]);
                that.setData({
                    goodsList
                });
            }
        })
    },
    // 匿名
    setName: function() {
        var nameless = this.data.nameless
        nameless = !nameless;
        this.setData({
            nameless
        })
    },
    // 提交评价
    submit: function() {
        var flag = true;
        var goodsList = this.data.goodsList;
        // 判断有无没选标签的商品
        for (let i = 0; i < goodsList.length; i++) {
            if (!flag) {
                break;
            } else {
                for (let j = 0; j < goodsList[i].label.length; j++) {
                    if (!goodsList[i].label[j].select) {
                        flag = false;
                    } else {
                        flag = true;
                        break;
                    }
                }
            }
        }

        // 提交
        if (!flag) {
            wx.showModal({
                title: '请填写完整信息',
                content: '产品标签不能为空',
                showCancel: false,
                confirmColor: '#007aff'
            })
        } else {
            var goodsList = this.data.goodsList;
            console.log(this.data.goodsList[0].photoList);
            var imageArr = [];
            var send = 0;
            for (let i = 0; i < goodsList.length; i++) {
                imageArr.push(goodsList[i].photoList);//循环遍历、每一个商品的评价图片集合
            }
            wx.showLoading({
                title: '',
            })
            this.submit1(imageArr, 0, []);
        }
    },
    // 
    submit1(info, i, imageArr) {
        /**
         * info 每个商品评论图片集合
         * i      初始化为0，代表为第一个组商品的评论图片上传
         */
        // 上传完毕则提交评论
        if (i == info.length) {
            this.submit2(imageArr);
        } else {
            console.log(1111)
            var that = this;
            // 上传图片,
            debugger;
            App.uploadImage(info[i], i, function(res, index) {
                console.log(res);
                console.log(index);
                imageArr[index] = res;
                i++;
                that.submit1(info, i, imageArr);
            });
            console.log(imageArr);
        }
    },
    // 提交评论
    submit2(imageArr) {
        // console.log(imageArr);
        var evaluate = [];
        var goodsList = this.data.goodsList;
        for (var i = 0; i < goodsList.length; i++) {
            var label = [];
            for (var j = 0; j < goodsList[i].label.length; j++) {
                if (goodsList[i].label[j].select) {
                    label.push(goodsList[i].label[j]);
                }
            }
            var item = {
                goods_id: goodsList[i].goods_id,
                model_id: goodsList[i].model_id,
                scoure: goodsList[i].scoure,
                content: goodsList[i].word,
                img: imageArr[i],
                label: label
            }
            evaluate.push(item);
        }
        var data = {
            token_id: App.globalData.meData.token_id,
            order_id: this.data.id,
            hide_name: this.data.nameless ? 2 : 1,
            type: 3,
            evaluate: JSON.stringify(evaluate)
        }
        return;
        console.log(data);
        App.request(
            'order/add_evaluate',
            'POST',
            data,
            function(res) {
                console.log("-----------------");
                if (res.data.status == 1 && res.data.message == "成功") {
                    var status = res.data.status;
                    wx.hideLoading()
                    wx.navigateBack({ //返回
                        delta: 1
                    })
                }

            }
        )
    }
})