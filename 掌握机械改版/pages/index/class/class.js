const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();
Page({
  data: {
    toView: '',
    historyStr: false,
    historyArr: [],
    classId: 1,
    className: '发动机件',
    changeid: 0,
    flag: true,
    styleDisplay: "none",
    animationData: {},
    pid: "",
    modelHot: [],
    modelAll: [],
    classArray: [],
    classIndex: 0,
    getLast: false,
    getSecond: false,
    serchinput: '',
    secondId: '',
    lastId: "",

  },


  onLoad: function(options) {
    this.setData({
      serchinput: options.serchinput || ''
    })
    this.getClass()
  },

  getClass(){
    const that = this
    wx.showLoading({
      title: '正在加载...',
    })
    util.request(api.getAllClass, {
      parentId: -63
    }).then(res => {
      if(res.data){
        that.setData({
          classArray:res.data
        })
      }
      console.log(res.data)
      wx.hideLoading()
    }) 
  },

  headerChange: function(e) {
    this.setData({
      pageIndex: e.detail.current
    });
  },

  changePage: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      pageIndex: index
    });
    this.close2();
    this.close3();
  },
  //model
  changeModel: function(e) {
    this.setData({
      modelIndex: e.currentTarget.dataset.index
    });

  },

  // 获取二级菜单列表    
  getSecondList: function(e) {
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
      function(res) {
        console.log(res.data);
        that.setData({
          secondList: res.data.data,
          img,
          secondId: pid,
          bigSeries,
          getSecond: true
        })
      }
    )
    this.tabHidden()
  },

  // 关闭二级菜单
  close2: function() {

    this.setData({
      getSecond: false
    })
    this.tabShow()
  },
  // 获取三级菜单列表    
  getLastList: function(e) {
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
      function(res) {
        console.log(res.data);
        that.setData({
          lastList: res.data.data,
          series,
          lastId: pid,
          getLast: true
        })
      }
    )
  },
  // 关闭三级菜单
  close3: function() {

    this.setData({
      getLast: false
    })

  },
  // 获取三级ID并传回搜索
  getLastId: function(e) {
    var search = this.data.serchinput;
    var pid = e.currentTarget.id;
    var name1 = e.currentTarget.dataset.text;
    if (name1.length > 8) {
      var word = name1.substring(0, 7) + "...";
      name1 = word;
    }
    this.close2();
    this.close3();
    wx.navigateTo({
      url: '/pages/index/products/products?model_id=' + pid + '&serchinput=' + search + '&name1=' + name1
    })


    setTimeout(() => {
      this.addHistory(e);
    }, 1000);
  },

  //class
  changeClass: function(e) {
    this.setData({
      classIndex: e.currentTarget.dataset.index,
      classId: e.currentTarget.id,
      className: e.currentTarget.dataset.text,
    });
    this.getClassList();
  },

  // 获取分类菜单
  getClassList: function() {
    var classArray = this.data.classArray;
    var classIndex = this.data.classIndex;
    if (!classArray[classIndex].typeTop) {
      
      var that = this;
      App.request(
        'index/alltype_more',
        'POST',
        data,
        function(res) {
          var res = res.data;
          console.log(res);
          if (res.status) {
            var typeTop = res.data.type_top;
            var typeList = res.data.type_list;
            var brand_list = res.data.brand_list;
            classArray[classIndex].typeTop = typeTop;
            classArray[classIndex].typeList = typeList;
            classArray[classIndex].brand_list = brand_list;
            that.setData({
              classArray
            });
          }
        }
      );
    }
  },
  // 获取类型并传回搜索
  changeType: function(e) {
    var lastType = e.currentTarget.id;
    var name2 = e.currentTarget.dataset.text;
    if (name2.length > 4) {
      var word = name2.substring(0, 3) + "...";
      name2 = word;
    }
    wx.navigateTo({
      url: '/pages/index/products/products?type=' + lastType + '&name2=' + name2
    })


  },
  // 添加搜索历史
  addHistory: function(e) {
    var hisId = e.currentTarget.id;
    var hisWord = e.currentTarget.dataset.text;

    this.data.historyArr.unshift({
      hisId,
      hisWord
    });
    this.setData({
      historyArr: this.data.historyArr
    })

    wx.setStorage({
      key: "type",
      data: this.data.historyArr

    })
    this.checkHistory()

  },
  // 检查搜索历史的数据
  checkHistory: function() {

    var that = this;

    wx.getStorage({
      key: 'type',
      success: function(res) {
        that.setData({
          historyArr: res.data
        })


        // 是否有搜索历史
        if (!that.data.historyArr.length == 0) {
          that.setData({
            historyStr: true
          })
        } else {
          that.setData({
            historyStr: false
          })
        }
        // // 字符串大于7省略
        var historyArr = that.data.historyArr;

        for (let i = 0; i < historyArr.length; i++) {
          if (historyArr[i].hisWord.length > 8) {
            var word = historyArr[i].hisWord.substring(0, 7) + "...";
            historyArr[i].hisWord = word;
            that.setData({
              historyArr
            })
          }
        }
        // 数组去空格
        var historyArr = that.data.historyArr;
        var l = [];
        for (var i = 0; i < historyArr.length; i++) {
          var hisId = historyArr[i].hisId;
          var hisWord = historyArr[i].hisWord;
          if (hisWord.indexOf(" ") != 0) {
            l.push({
              hisId,
              hisWord
            })
          };
        }
        that.setData({
          historyArr: l
        })
        // 数组去重
        var historyArr = that.data.historyArr;
        var m = [];
        var n = [];
        //遍历当前数组 
        for (var i = 0; i < historyArr.length; i++) {
          //如果当前数组的第i已经保存进了临时数组，那么跳过， 
          //否则把当前项push到临时数组里面 
          var hisId = historyArr[i].hisId;
          var hisWord = historyArr[i].hisWord;
          if (m.indexOf(hisId) == -1) {
            m.push(hisId)
            n.push({
              hisId,
              hisWord
            })
          };
        }
        that.setData({
          historyArr: n
        })
        //删除超过8数据的历史
        if (historyArr.length > 8) {
          historyArr.pop();
          that.setData({
            historyArr
          })

          wx.setStorage({
            key: "type",
            data: that.data.historyArr

          })

        }

      }
    })

  },
  //   跳转到品牌详情
  goBrand: function(e) {
    var id = e.currentTarget.id;

    wx.navigateTo({
      url: '/pages/index/brand/brand?id=' + id
    });
  },
  //   隐藏tabbar
  tabHidden: function() {
    wx.hideTabBar({
      animation: true
    })
  },
  //   显示tabbar
  tabShow: function() {
    wx.showTabBar({
      animation: true
    })
  },
  // 字母滚动条
  choiceWordindex: function(event) {

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
  // tabbar红点
  checkBadge: function() {
    var that = this;
    var data = {
      token_id: App.globalData.meData.token_id,
      reg_id: '',
    }
    App.request(
      'cart/cart_count',
      'POST',
      data,
      function(res) {
        var badge = res.data.data.count;
        if (badge <= 0) {
          wx.removeTabBarBadge({
            index: 3
          })
        } else {
          wx.setTabBarBadge({
            index: 3,
            text: badge + ''
          })
        }
      }
    );
  }
})