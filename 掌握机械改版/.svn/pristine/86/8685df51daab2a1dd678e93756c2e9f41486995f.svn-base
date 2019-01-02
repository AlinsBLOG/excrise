// pages/index/class/class.js
const App = getApp();
Page({
    
    data: {
      likeList:[],
      showMore1: 0,
      showMore3: 0,
      showLoading:true,
      page1:1,
      page3:1,
      delBtnWidth:132,//删除按钮宽度单位（rpx）
      goTop:0,
    },


    onLoad: function (options) {
        this.initEleWidth();
        this.getLikeList1();
    },
    onShow:function () {
      this.getHisList();
    },
  // 获取浏览历史数据
  getHisList: function () {
    var meData = App.globalData.meData;
    this.setData({
      showMore1: 0,
    });
    var that = this;
    // 商品
    var data = {
      token_id:meData.token_id,
      type:0,
      page:1
    }
    App.request(
      'user/my_browse',
      'POST',
      data,
      function (res) {
        console.log(res.data);
        that.setData({
          showLoading:false,
          list:res.data.data.goods,
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

  },

  // 获取更多商品
  getMoreList: function () {
    
    var meData = App.globalData.meData;
    var that = this
    this.setData({ showMore1: 1 });
    var page1 = this.data.page1;
    page1++;
    var data = {
      token_id:meData.token_id,
      type:0,
      page: page1
    }
    App.request(
      'user/my_browse',
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




    ////////////////////////////////

    touchS:function(e){
      if(e.touches.length==1){
        this.setData({
          //设置触摸起始点水平方向位置
          startX:e.touches[0].clientX
        });
        
      }
    },
    touchM:function(e){
      if(e.touches.length==1){
        //手指移动时水平方向位置
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        var txtStyle = "";
        if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0px";
        }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-"+disX+"px";
          if(disX>=delBtnWidth){
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-"+delBtnWidth+"px";
          }
        }
        //获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        
        var list = this.data.list;
        list[index].txtStyle = txtStyle;

        //更新列表的状态
        this.setData({
          list:list
        });
      }
    },
  
    touchE:function(e){
      if(e.changedTouches.length==1){
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
        //获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          list:list
        });
        
      }
    },
    //获取元素自适应后的实际宽度
    getEleWidth:function(w){
      var real = 0;
      try {
        var res = wx.getSystemInfoSync().windowWidth;
        var scale = (750/2)/(w/2);//以宽度750px设计稿做宽度的自适应
        real = Math.floor(res/scale);
        return real;
      } catch (e) {
        return false;
       // Do something when catch error
      }
    },
    initEleWidth:function(){
      var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
      this.setData({
        delBtnWidth:delBtnWidth
      });
    },
    //点击删除按钮事件
  delItem:function(e){

    var meData = App.globalData.meData;
    var that = this
    //获取列表中要删除项的下标
    var id = e.currentTarget.dataset.text.goods_id;
    var index = e.currentTarget.dataset.index;
    var data ={
      token_id:meData.token_id,
      type:0,
      id
    }
    App.request(
      'data/fun_browse_del',
      'POST',
      data,
      function (res) {
       if(res.data.status == 1){
           wx.showToast({
               title: res.data.message,
               icon: 'none',
           })
           var list = that.data.list;
           list.splice(index, 1);
           that.setData({
               list
           })
           if (that.data.list.length == 0) {
               that.setData({
                   searchNull: true
               })
           } else {
               that.setData({
                   searchNull: false
               })
           }
       }else{
           wx.showToast({
               title: res.data.message,
               icon: 'none',
           })
       }
          
      }
    )
  },

    ////////////////////////////////
    empty:function () {
      var that = this;
      wx.showModal({
        title:'清空浏览历史',
        content:'你确定要清空浏览历史吗？',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            var data = {
              token_id: App.globalData.meData.token_id
            }
            App.request(
              'data/fun_goods_del_all',
              'POST',
              data,
              function (res) {
                console.log(res);
                that.getHisList();
                that.setData({
                  goTop:0
                })
              }
            )
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
  // 获取商品ID跳转到详情
  goDetails: function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;

    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
    });
  },
  // 猜你喜欢1
  getLikeList1: function(){
    console.log("3");
    
    var that = this;
    this.setData({ showMore3: 1 });
    var page3 =this.data.page3
    var data = {
      page:page3,
      token_id:App.globalData.meData.token_id
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
})
