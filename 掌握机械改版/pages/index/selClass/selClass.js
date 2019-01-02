// pages/index/class/class.js
const App = getApp();
Page({

    data: {
        showLoading:true,
        toView:'',
        name2:"产品类型",
        name3:"货源",
        historyStr: false,
        getLast:false,
        getSecond:false,
        serchinput:'',
        origin:0,
        type:"",
        secondId:'',
        lastId:"",
        pid:"",
        modelHot:[],
        modelAll:[],
    },

    onLoad: function (options) {
        this.setData({
            serchinput: options.serchinput || '',
            origin: options.origin || 0,
            type: options.type || "",
            model_id: options.model_id || '',
            name1:options.name1 || '适用机型',
            name2:options.name2 || '产品类型',
            name3:options.name3 || '货源',
        })
        var that = this;
        App.request(
            'index/classify',
            'POST',
            {},
            function(res){
                var res = res.data;
                console.log(res);
                if(res.status){
                    var all = res.data.all;
                    var hot = res.data.hot;
                    that.setData({
                        modelAll:all,
                        modelHot:hot,
                        showLoading:false
                    });
                }
            }
        )
        // this.checkHistory()
    },
    // 获取二级菜单列表    
    getSecondList:function (e) {
        var that = this;
        var pid = e.currentTarget.id;
        var bigSeries = e.currentTarget.dataset.text.name;
        var img = e.currentTarget.dataset.text.img;
        
        var data = {
            pid
        }
        App.request(
            'index/classify_more',
            'POST',
            data,
            function(res){
                console.log(res.data);
                that.setData({
                    secondList:res.data.data,
                    img,
                    secondId:pid,
                    bigSeries,
                    getSecond:true
                })
            }
        )
    },
        
    // 关闭二级菜单
    close2:function () {

        this.setData({
            getSecond:false
        })

    },
    // 获取三级菜单列表    
    getLastList:function (e) {
        var that = this;
        var pid = e.currentTarget.id;
        var series = e.currentTarget.dataset.text;
        
        var data = {
            pid
        }
        App.request(
            'index/classify_more',
            'POST',
            data,
            function(res){
                console.log(res.data);
                that.setData({
                    lastList:res.data.data,
                    series,
                    lastId:pid,
                    getLast:true
                })
            }
        )
    },
    // 关闭三级菜单
    close3:function () {
        this.setData({
            getLast:false
        })

    },
    
    // 获取三级ID并传回搜索
    getLastId: function (e) {
        var search = "";
        /**
         * 因为该项目的选择机型不是在对应 search下选择model_id，所以如果并联查询就查不出东西。暂时先用search = "",代替
         */
        var pid = e.currentTarget.id;
        var name1 = e.currentTarget.dataset.text;
        var name2 = this.data.name2;
        var name3 = this.data.name3;
        var origin = this.data.origin;
        var type = this.data.type;
        console.log(this.data);

        if (name1.length > 8) {
            var word = name1.substring(0, 7) + "...";
            name1 = word;
        }
        var pages = getCurrentPages();//当前页面
        var prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({//直接给上移页面赋值
            model_id: pid,
            serchinput: search,
            origin,
            type,
            name1,
            name2,
            name3,
        });
        wx.navigateBack({//返回
            delta: 1
        })
        this.close2();
        this.close3();
    },
    
  // 字母滚动条
  choiceWordindex: function (event) {
        
    var that = this;
    let wordindex = event.currentTarget.dataset.wordindex;
    
    if (wordindex == '*') {
        that.setData({
            toView: 'not',
        })
    } else {
        that.setData({
            toView: wordindex,
        })
    }

},  
})