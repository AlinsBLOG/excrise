const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noSearching: true,
    inputvalue: '',
    isback: true,
    historyStr: false,
    historyArr: [],
    serchinput: '',
    hotArr: [],
    suggestions: [],
    isFocus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      serchinput: options.serchinput || '',
    })
    this.getList()
  },
  onShow: function() {
    this.setData({
      isFocus: true
    })
  },
  // 获取数据
  getList: function() {

  },

  // 检查搜索历史的数据
  checkHistory: function() {
    var that = this;
    wx.getStorage({
      key: 'key',
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
        // 数组去重
        var historyArr = that.data.historyArr;
        var n = [];
        //遍历当前数组 
        for (var i = 0; i < historyArr.length; i++) {
          //如果当前数组的第i已经保存进了临时数组，那么跳过， 
          //否则把当前项push到临时数组里面 
          if (n.indexOf(historyArr[i]) == -1) n.push(historyArr[i]);
        }
        that.setData({
          historyArr: n
        })

        // 数组去空格
        var historyArr = that.data.historyArr;
        var l = [];
        for (var i = 0; i < historyArr.length; i++) {
          if (historyArr[i].indexOf(" ") != 0) {
            l.push(historyArr[i])
          };
        }
        that.setData({
          historyArr: l
        })

        //删除超过10数据的历史
        if (historyArr.length > 10) {
          historyArr.pop();
          that.setData({
            historyArr
          })
          wx.setStorage({
            key: "key",
            data: that.data.historyArr

          })
        }
      }
    })
  },
  // 返回上一页
  goback: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 清空历史搜索
  delArr: function() {
    this.setData({
      historyArr: [],
      historyStr: false
    })
    // 清理本地数据缓存。
    wx.clearStorage()
  },

  //清除搜索文字
  emptyStr: function() {
    this.setData({
      serchinput: '',
      isback: true,
      noSearching: true
    })
  },
  // 检查搜索框文字
  checkSearch: function(e) {
    var that = this;
    var serchinput = e.detail.value;
    this.setData({
      serchinput,
    })
    if (!serchinput.length == 0) {
      this.setData({
        isback: false,
        noSearching: false
      })
      var data = {
        search: serchinput
      }
    } else {
      this.setData({
        isback: true,
        noSearching: true
      })
    }
  },
  // 搜索
  goSearch: function() {
    var search = this.data.serchinput;
    this.toProducts();
    this.setData({
      isback: true,
      noSearching: true
    })
    if (search == '') {
      return
    }
    this.addHistory();
  },
  //   点击搜索建议 - 搜索
  suggestiongoSearch(e) {
    var searchInp = e.currentTarget.dataset.content;
    console.log(searchInp);
    this.setData({
      serchinput: searchInp,
    });
    this.goSearch();
  },

  // 点击历史热门进行搜索
  goSearch2: function(e) {
    this.setData({
      serchinput: e.target.id
    })
    this.goSearch()
  },
  // 跳转到列表页
  toProducts: function() {
    var search = this.data.serchinput
    wx.navigateTo({
      url: '/pages/index/products/products?serchinput=' + search
    });
  },
  // 添加搜索历史
  addHistory: function() {
    var newWord = this.data.serchinput;
    this.data.historyArr.unshift(newWord);
    this.setData({
      historyArr: this.data.historyArr
    })

    wx.setStorage({
      key: "key",
      data: this.data.historyArr

    })

    this.checkHistory()
  },
})