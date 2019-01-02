// pages/index/supply/supply.js
const App = getApp();
Page({
    data: {
        supplyList:[],
        page:1,
        showMore:null
    },

    onLoad: function (options) {
        this.getList();
    },

    onShow: function () {

    },

    getList: function () {
        if(this.data.showMore == 2){
            return;
        }
        var that = this;
        this.setData({ showMore:1 });
        var page = this.data.page;
        var data={
            page:page,
            token_id:App.globalData.meData.token_id
        }
        App.request(
            'company/index',
            'POST',
            data,
            function(res){
                var res = res.data;
                console.log(res);
                if(res.status){
                    var supplyList = page ==1 ? [] : that.data.supplyList;
                    supplyList = supplyList.concat(res.data);
                    page++;
                    that.setData({
                        supplyList,
                        page,
                        showMore:res.data.length == 3 ? 0 : 2
                    });
                }
            }
        );
    },

  // 获取商品ID跳转到详情
  goDetails:function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;
    
    wx.navigateTo({
      url: '/pages/index/details/details?id='+id+'&goods_id='+goods_id
    });
  },
  // 跳转到商家店铺
  goCompany:function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/index/company/company?id='+id
    });
  },

    onReachBottom: function () {
        this.getList();
    },
    
})