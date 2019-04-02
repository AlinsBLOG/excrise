const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const App = getApp();
Page({
  data: {
    isback: true,
    serchinput: '',
    suggestions: [],

    pageNo: 1,
    loadMore: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getStart(options)
  },

  getStart(options){
    let placeholder = options.title == "适用机型" ? "请输入适用机型，如PC200-8" : "请输入配件名称";
    /**
     * index代表着上一个页面携带过来的配件索引。用来修改对应配件名称
     */
    if (options.index) {
      var index = options.index;
    };
    if (options.isEdit) {
      var isEdit = options.isEdit;
    }
    this.setData({
      title: options.title,
      placeholder,
      serchinput: options.partName || "",
      isEdit: isEdit || "",
      index: index || ""
    });
    wx.setNavigationBarTitle({
      title: options.title,
    })
  },

  // 返回上一页
  goback: function() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //清除搜索文字
  emptyStr: function() {
    this.setData({
      serchinput: '',
      isback: true,
    })
  },
  // 检查搜索框文字
  checkSearch: function(e) {
    var that = this;
    var serchinput = e.detail.value;
    let url = '';
    if (serchinput.length == 0) {
      return;
    }
    this.setData({
      serchinput,
    })
    if (!serchinput.length == 0) {
      this.setData({
        isback: false
      })
      this.loadMore()
    } else {
      this.setData({
        isback: true,
        noSearching: true
      })
    }
  },
  // 确认
  comfirm: function() {
    var value = this.data.serchinput
    if (!value) return
    this.setType(value)
  },

  // 设置适用机型、配件信息通用函数
  setType(item) {
    console.log(item)
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    if (this.data.title == "适用机型") {
      // 如果有dataset属性意味着是搜索提示获取的名称，否则是自己输入的    
      prevPage.setData({
        adapter: (item.pathName || item),
        adapterDetail: item
      })
    } else {
      let num = 1; //配件数量
      let remark = ""; //备注
      let partsItem = {
        ...item,
        num,
        remark,
        name:(item.name || item)
      }
      if (this.data.isEdit == 1) {
        partsItem = {
          ...prevPage.data.parts[this.data.index],
          name: (item.name || item)
        }
        prevPage.data.parts[this.data.index] = partsItem
        prevPage.setData({
          parts: prevPage.data.parts
        })
      } else {
        var parts = prevPage.data.parts.concat(partsItem);
        prevPage.setData({
          parts
        });
      }
    }
    wx.navigateBack({
      delta: 1 // 返回上一级页面。
    })
  },
  // 适用机型
  setAG(e) {
    var item = e.currentTarget.dataset.item;
    this.setType(item);
  },
  loadMore(){
    const that = this
    let { suggestions, serchinput, loadMore, pageNo, title} = this.data
    if (loadMore) {
      if (title == '配件名称') {
        util.request(api.getCategory, {
          nameLike: serchinput,
          pageNo
        }).then(res => {
          if (pageNo == res.pageCount) {
            this.setData({
              loadMore: false
            })
          }

          if (res.data) {
            suggestions = suggestions.concat(res.data)
          }
          this.setData({
            suggestions,
            pageNo: pageNo + 1
          })
        })
      } else {
        util.request(api.getProdModel, {
          nameLike: serchinput,
          pageNo
        }).then(res => {
          if (pageNo == res.pageCount) {
            this.setData({
              loadMore: false
            })
          }

          if (res.data) {
            suggestions = suggestions.concat(res.data)
          }
          this.setData({
            suggestions,
            pageNo: pageNo + 1
          })
        })
      }
    }
  }
})