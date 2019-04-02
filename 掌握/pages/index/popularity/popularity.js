// pages/index/popularity/popularity.js
let col1H = 0;
let col2H = 0;
const App = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topImage:'',
        select:[],
        page:1,
        selectValue:1,
        // goodsList:[],
        colArr1:[],
        colArr2:[],
        showMore:null,
        load:false,
        goodsList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList();
        
    },
    // 获取商品列表
    getList: function(){
        if(this.data.showMore == 2){
            return;
        }
        var that = this;
        this.setData({ showMore:1 });
        var page = 1;
        var data={
            page:page,
            order:this.data.selectValue,
            token_id:App.globalData.meData.token_id
        }
        App.request(
            'index/goodstop',
            'POST',
            data,
            function(res){
                var res = res.data;
                console.log(res);
                if(res.status){
                    if(!that.data.load){
                        var topImage = res.data.img || that.data.topImage;
                        var select = res.data.select;
                        that.setData({
                            topImage,
                            showMore:res.data.list.goods.length == 20 ? 0 : 2
                        });
                    }
                    var goodsList = res.data.list.goods;
                    that.setData({
                        goodsList,
                    });
                }
            }
        );
    },
    // 获取更多商品列表
    getMoreList: function () {
        if (this.data.showMore == 2) {
            return;
        }
        var that = this;
        this.setData({ showMore: 1 });
        var page = this.data.page + 1;
        console.log(page);
        
        var data = {
            page: page,
            order: this.data.selectValue,
            token_id:App.globalData.meData.token_id
        }
        App.request(
            'index/goodstop',
            'POST',
            data,
            function (res) {
                var res = res.data;
                console.log(res);
                if (res.status) {
                    if (!that.data.load) {
                        var topImage = res.data.img || that.data.topImage;
                        var select = res.data.select;
                        that.setData({
                            topImage,
                            showMore: res.data.list.goods.length == 20 ? 0 : 2
                        });
                    }
                    var goodsList = that.data.goodsList.concat(res.data.list.goods);
                    that.setData({
                        goodsList,
                        page
                    });
                }
            }
        );
    },


    // 人气
    select1: function(){
        if(this.data.selectValue!=1){
            this.setData({
                showMore:0,
                page:1,
                selectValue:1
            });
            this.getList();
        }
    },
    // 联系
    select2: function(){
        if(this.data.selectValue!=2){
            this.setData({
                showMore:0,
                page:1,
                selectValue:2
            });
            this.getList();
        }
    },
    // 价格
    select3: function(){
        var selectValue = this.data.selectValue == 5 ? 4 : 5;
        this.setData({
            showMore:0,
            page:1,
            selectValue:selectValue
        });
        this.getList();

    },

  // 获取商品ID跳转到详情
  goDetails:function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;
    
    wx.navigateTo({
      url: '/pages/index/details/details?id='+id+'&goods_id='+goods_id
    });
  },
    onShow: function () {

    },

    onReachBottom: function () {
        this.getMoreList();
    },

})
