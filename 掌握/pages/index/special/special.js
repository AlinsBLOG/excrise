// pages/index/special/special.js
const App = getApp();
Page({
    data: {
        specialList:[],
        page:1,
        showMore:null
    },

    onLoad: function (options) {
        this.getList();
    },

    onShow: function () {

    },

    getList: function () {
        if(this.data.showMore){
            return;
        }
        var that = this;
        this.setData({ showMore:1 });
        var page = this.data.page;
        var data={
            page:page
        }
        App.request(
            'index/themelist',
            'POST',
            data,
            function(res){
                var res = res.data;
                console.log(res);
                if(res.status){
                    var specialList = page == 1 ? [] : that.data.specialList;
                    specialList = specialList.concat(res.data.theme);
                    console.log(specialList)
                    page++
                    that.setData({
                        specialList,
                        page,
                        showMore: res.data.theme.length == 5 ? 0 : 2
                    });
                }
            }
        );
    },
    //按需跳转
    goTo:function (e) {
        var id = e.currentTarget.id
        var title = e.currentTarget.dataset.text
        if (id == 2) {
            wx.navigateTo({
                url: '/pages/index/company/company?id='+title
            });
        }
        if (id == 5) {
            wx.navigateTo({
                url: '/pages/webView/webView?webUrl='+title
            });
        }
    },

    onReachBottom: function () {
        this.getList();
    },
})