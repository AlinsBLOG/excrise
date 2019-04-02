// pages/index/company/cSearch/cSearch.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScroll:true,
    showLoading:true,
    cGoodsData:[],
    page:1,
    selectValue:1,
    title:'',
    id:'',
    noSearching: true,
    inputvalue: '',
    isback: true,
    showMore2:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      title: options.title || '',
      id: options.id || ''
    })
    wx.setNavigationBarTitle({  
      title: that.data.title,  
    }) 
    this.getGoodsList();
  },
  cSearch:function () {
    // console.log("123");
      this.getGoodsList();
  },

    // 检查搜索框文字
    checkSearch: function (e) {
        console.log(e.detail.value);
        this.setData({
            serchinput: e.detail.value
        })
        if (!e.detail.value.length == 0) {
            this.setData({
                isback: false,
                noSearching: false
            })
        } else {
            this.setData({
                isback: true,
                noSearching: true
            })
        }
    },
    //清除搜索文字
    emptyStr: function () {
        this.setData({
            serchinput: '',
            noSearching: true
        })
    },
  getGoodsList: function () {
    var that = this
    var page = this.data.page;
    var data = {
      cid:this.data.id,
      token_id:App.globalData.meData.token_id,
      page,
        search: this.data.serchinput || ""
    }
    App.request(
      'index/recommand_goods',
      'POST',
      data,
      function (res) {
        that.setData({
          cGoodsData: res.data.data.list.goods,
          showLoading:false,
            
        })
        
        console.log(res.data.data);
      })
  },
//   加载更多
  getMoreGoodsList(){
      if(this.data.showMore2){
          return;
      }
    //   初始化
    this.setData({
        showMore1:true
    });
      var that = this
      var page = ++ this.data.page;
      var data = {
          cid: this.data.id,
          token_id: App.globalData.meData.token_id,
          page,
          search: this.data.serchinput || ""
      }
      
      App.request(
          'index/recommand_goods',
          'POST',
          data,
          function (res) {
              var moreList = res.data.data.list.goods;
              var showMore2 = moreList.length == 0?true:false;
              console.log(that.data.cGoodsData)
              var cGoodsData = that.data.cGoodsData.concat(moreList);
             
              console.log(that.data.cGoodsData);
              that.setData({
                  cGoodsData,
                  showLoading: false,
                  showMore1:false, //加载更多
                  showMore2 // 没有更多数据
              })

              console.log(res.data.data);
          })
  },
  showText:function () {
    if (this.data.isHidden==true) {
      this.setData({
        isHidden:false
      })
    }else{
      this.setData({
        isHidden:true
      })
    }
  },
  // 获取更多商品
  getMoreList: function () {
    var that = this
    this.setData({ showMore: 1 });
    var page = this.data.page;
    page++;
    // 1
    var type = this.data.type;
    
    var data = {
      id:this.data.id,
      page: page,
      order: this.data.selectValue,
      type,
      token_id:App.globalData.meData.token_id,
    }
    App.request(
      'index/companylist',
      'POST',
      data,
      function (res) {
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
  goDetails:function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;
    
    wx.navigateTo({
      url: '/pages/index/details/details?id='+id+'&goods_id='+goods_id
    });
  },
//   // 人气
//   select1: function () {
//     if (this.data.selectValue != 1) {
//       this.setData({
//         showMore: 0,
//         page: 1,
//         selectValue: 1
//       });
//       this.getGoodsList();
//     }
//   },
//   // 联系
//   select2: function () {
//     if (this.data.selectValue != 2) {
//       this.setData({
//         showMore: 0,
//         page: 1,
//         selectValue: 2
//       });
//       this.getGoodsList();
//     }
//   },
//   // 新品
//   select3: function () {
//     if (this.data.selectValue != 3) {
//       this.setData({
//         showMore: 0,
//         page: 1,
//         selectValue: 3
//       });
//       this.getGoodsList();
//     }
//   },
//   // 价格
//   select45: function () {
//     var selectValue = this.data.selectValue == 5 ? 4 : 5;
//     this.setData({
//       showMore: 0,
//       page: 1,
//       selectValue: selectValue
//     });
//     this.getGoodsList();
//   },
  // 跳转到消息页
  goMessage:function () {
    wx.switchTab({
      url: '/pages/index/message/message'
    });
  },
})