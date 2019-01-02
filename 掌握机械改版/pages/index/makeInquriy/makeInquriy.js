const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();
Page({
  data: {
    qualityList: [], //品质范围
    adapter: "", //适用机型
    adapterDetail:null,
    showVModal: false,
    prodImages:'',
    show:false,
    
    parts: [], //配件
    photoList: [], //照片
    imageList:[], //临时照片

    qualitificateLimit: "", //选中后的品质

    isComplete: false, //图片是否上传完毕
    submit_limit: false, //限制只能提交一次,以免重复点击时候会发布多条询价单
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const reqId = options.reqId
    const that = this
    this.getList()
    if (reqId){
      that.setData({
        reqId
      })
      util.request(api.getQuery, { 
        reqId
      }).then(res => {
        let result = res.data
        if (result){
          result.map(i => {
            i.name = i.prodName
            i.num = i.prodNum
            return i
          })
        }
        that.setData({
          parts: result
        })
      })
      util.request(api.getqueryInfo,{
        reqId
      }).then(res => {
        let result = res.data
        console.log(result)
        
        let adapterDetail = {
          name: result.prodModelName,
          id: result.prodModel
        }
        let adapter = result.prodModelName
        let photoList = result.prodModelImage.split(',')
        that.setData({
          adapterDetail,
          adapter,
          photoList,
          imageList: photoList
        })
      })
    }
  },

  clickModal(){
    this.setData({
      show:false,
      isDisabled:false
    })
    // util.reloadBfeorePage()
  },

  showModFun(title) {
    this.setData({
      showVModal: true,
      isDisabled:true,
      erTips: title
    })
  },

  cancel() {
    this.setData({
      showVModal: false,
      isDisabled:false
    })
  },

  onShow(){
    const userInfo = util.getStorageSync('userInfo')
    const registerInfo = util.getStorageSync('registerInfo')
    if (!userInfo) {
      wx.showModal({
        content: '您还没有登陆',
        success: function (e) {
          if (e.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/inqueryRoom/inqueryRoom'
            })
          }
        }
      })
    }
  },

  getList(){
    util.request(api.list2).then(res => {
      console.log(res.data)
      // if(res.data){
      //   let arr = []
      //   res.data.forEach(a => {
      //     arr.push(a.name)
      //   })
      //   this.setData({
      //     qualitificateLimit:arr.join(',')
      //   })
      // }
      this.setData({
        qualityList:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
  //  */
  onUnload: function() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      flag: true
    })
  },
  checkboxChange: function(e) {
    this.setData({
      qualitificateLimit: e.detail.value.join(",")
    });
  },
  // 删除配件列表
  delItem(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '确定删除配件？',
      content: "",
      confirmColor: "#f05b29",
      success: function(res) {
        if (res.confirm) {
          that.data.parts.splice(index, 1)
          that.setData({
            parts: that.data.parts
          });
        }
      }
    })

  },
  // 适用机型
  searchType() {
    var partName = this.data.adapter
    wx.navigateTo({
      url: `/pages/index/makeInquriy/searchType/searchType?title=适用机型&partName=${partName}`,

    })
  },
  // 编辑配件名称
  editPartName(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/index/makeInquriy/searchType/searchType?title=配件名称&partName=${item.name}&index=${index}&isEdit=1`,
    })
  },
  //配件名称
  goName() {
    wx.navigateTo({
      url: '/pages/index/makeInquriy/searchType/searchType?title=配件名称',
    })
  },

  editN(e) {
    let value = e.detail.value
    let index = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    let centerValue = this.data.parts
    centerValue[index][name] = value
    console.log(centerValue)
    this.setData({
      parts: centerValue
    });
  },
  // 删除照片
  del: function(e) {
    let that = this
    let { photoList,imageList,reqI, } = that.data
    let index = e.currentTarget.dataset.index
    if (index < imageList.length){
      imageList.splice(index, 1)
    }
    photoList.splice(index, 1)
    that.setData({
      photoList: photoList,
      imageList: imageList
    })
  },
  // 添加照片
  add: function() {
    var self = this;
    wx.chooseImage({
      count: 9 - self.data.photoList.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function(res) {
        let photoList = self.data.photoList;
        photoList = photoList.concat(res.tempFilePaths);
        self.setData({
          photoList
        })
      }
    })
  },
  submitInfo(){
    wx.showLoading({
      title: '正在提交'
    })
    let params = {

    }
    const {
      photoList,
      prodImages,
      isComplete,
      imageList,
      reqId
    } = this.data

    if (!isComplete) {
      if (photoList.length > imageList.length) {
        photoList.splice(0, imageList.length)
        util.uploadFileGroup(photoList).then(res => {
          if (imageList.length){
            res += ',' + imageList.join(',')
          }
          this.setData({
            prodImages: res,
            isComplete: true
          })
          params.prodImages = res
          this.submitCertain(params)
        })
      } else {
        params.prodImages = imageList.join(',')
        this.submitCertain(params)
      }
    } else {
      this.submitCertain(params)
    }
  },
  // 发布询价
  submitCertain(obj) {
    const { 
      submit_limit, 
      parts, 
      qualitificateLimit, 
      photoList,
      prodImages,
      adapter,
      adapterDetail
      } = this.data
    console.log(this.data)
    // return
    const userInfo = util.getStorageSync('userInfo')
    const registerInfo = util.getStorageSync('registerInfo')
    wx.hideLoading()
    
    // if (submit_limit) return
    if (!adapter) {
      this.showModFun("适用机型不能为空")
      return
    } else if (parts.length == 0) {
      this.showModFun("配件名称不能为空")
      return
    } else if (!qualitificateLimit) {
      this.showModFun("配件性质不能为空")
      return
    }
    wx.showLoading({
      title: '正在提交'
    })
    let params ={}
    let items = []
    parts.forEach(item => {
      items.push({
        prodName:item.name,
        prodNum:item.num,
        remark: item.remark
      })
    })
    params ={
      ...params,
      ...obj,
      createUser: userInfo.userId,
      providerId: registerInfo.providerId,
      qualitificateLimit,
      tenantId: App.globalData.tenantId,
      items
    }
    if (adapterDetail.id){
      params.model = adapterDetail.id
      params.modelName = adapterDetail.name
    } else {
      params.modelName = adapterDetail
    }
    this.setData({
      submit_limit: true
    })
    util.request(api.publishP, params,'POST').then(res => {
      console.log(res)
      if(res.success){
        wx.hideLoading()
        this.setData({
          show: true,
          isDisabled:true,
          count: (res.data || 120)
        })
      }
    })
  },
  showModal(message){
    wx.showToast({
      title: message,
      icon: "none"
    })
  },

  //查看询价单
  back(){
    util.reloadBfeorePage()
  },
  container(){
    this.setData({
      adapter: "", //适用机型
      adapterDetail: null,
      showVModal: false,
      prodImages: '',
      show: false,
      parts: [], //配件
      photoList: [], //临时照片路径
      qualitificateLimit: "", //选中后的品质
      isComplete: false, //图片是否上传完毕
      submit_limit: false, //限制只能
    })
    this.getList()
  }
})