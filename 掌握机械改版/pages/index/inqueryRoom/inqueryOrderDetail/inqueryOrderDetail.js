const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const App = getApp();
let params = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reqId: null,
    providerId: null,
    inquiryDetails: {},
    inquiryDetailsItem: [],
    inquiryDetailsItemOffer:[],
    showLoading: true,
    stateList: App.globalData.stateList,
    type: null,
    dealWithMe:false,
    alreadyBaoJiaInitText: '你同事已报价',

    chooseWithYou:false,

    totalPrice:0,
    selectedNum:0,

  },

  onUnload() {
    params = [];
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    const reqId = options.id
    const type = options.type || 1
    const from = options.from || ''
    if (from && from == 'list'){
      this.setData({
        from:true
      })
    }
    this.setData({
      reqId,
      type
    })
    this.getUserProvider(reqId, type)
  },

  loadAgain(){
    let { reqId, type } = this.data
    this.getUserProvider(reqId, type)
  }, 

  // reqId, type
  getUserProvider(reqId) {
    const that = this;
    const registerInfo = util.getStorageSync('registerInfo');
    const userInfo = util.getStorageSync('userInfo');
    const providerId = registerInfo.providerId;
    const token = registerInfo.token;
    const { from } = this.data
    let type = null;
    util.request(api.getInqueryDetail, {
      reqId
    }, 'GET', {
      token
    }).then(res => {
      let centerVal = res.data
      console.log(centerVal)
      if (centerVal.providerId == registerInfo.providerId) {
        type = 1
      } else {
        type = 2
      }
      this.setData({
        type
      })
      centerVal.createTime = util.formatTime(centerVal.createTime)
      centerVal.expireDate = util.formatTime(centerVal.expireDate)
      this.setData({
        inquiryDetails: centerVal
      })

      //报价单
      if (type == 2) {
        util.request(api.getInqueryDetailItem, {
          reqId,
          providerId
        }, 'GET', {
          token: registerInfo.token
        }).then(resItem => {
          console.log(resItem.data)
          this.setData({
            inquiryDetailsItem: resItem.data,
            providerId,
            showLoading: false
          })
          let iii = res.data.groupLimit.split(',')
          resItem.data.forEach((item, index) => {
            params.push({
              reqId,
              providerId,
              itemId: item.id,
              offerGroupList: []
            })
            
            iii.forEach((iitem, iindex) => {
              params[index].offerGroupList.push({
                groupName: iitem,
                price: null,
                remark: null
              })
            })

            if (item.offers && item.offers.length){
              console.log(from)
              // that.setData({
              //   alreadyBaoJiaInit: true,
              // })
              item.offers.forEach(function(k){
                if (!from) {
                  if (k.createUser == userInfo.userId) {
                    // that.setData({
                    //   alreadyBaoJiaInitText: '你已报价'
                    // })
                    wx.showToast({
                      title: '你已报价',
                      icon:'none'
                    })
                  } else {
                    wx.showToast({
                      title: '你同事已报价',
                      icon: 'none'
                    })
                  }
                }
                if (k.offerState == 1){
                  that.setData({
                    dealWithMe:true
                  })
                }
              })
            }
          })
        })
      // 询价单
      } else {
        util.request(api.getInqueryDetailItemOffer,{
          reqId
        }).then(res => {
          console.log(res.data)
          if (res.data && res.data.length > 0) {
            this.setData({
              inquiryDetailsItemOffer:res.data,
              showLoading: false,
            })

            res.data.forEach(i => {
              if (i.offerItemVoList){
                i.offerItemVoList.forEach(j => {
                  if (j.groupList){
                    j.groupList.forEach(k => {
                      if (1 == k.state){
                        that.setData({
                          chooseWithYou:true
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
      this.setData({
        showLoading: false        
      })
    })
  },

  //已有同事报价 默认modal
  alreadyBaoJiaInitFun(){
    this.setData({
      alreadyBaoJiaInit:false
    })
  },

  setOffer(e) {
    const obj = e.target.dataset
    const value = e.detail.value
    params[obj.pindex]['offerGroupList'][obj.iindex][obj.name] = value
  },

  errFun(errTips){
    this.setData({
      errTips,
      errShow:true
    })
  },
  errCertain(){
    this.setData({
      errShow: false
    })
  },

  // 提交报价
  submit() {
    let boolen = false
    params.forEach(item => {
      if (item.offerGroupList && item.offerGroupList.length){
        item.offerGroupList.forEach(j => {
          if (j.price && j.price > 0){
            boolen = true
            return
          }
        })
      }
    })
    if (!boolen) {
      this.errFun('请至少填写一个配件的价格')
      return
    }
    const registerInfo = util.getStorageSync('registerInfo');
    const userInfo = util.getStorageSync('userInfo');
    const token = registerInfo.token;
    const inquiryDetails = this.data.inquiryDetails
    if (inquiryDetails.createUser == userInfo.userId) {
      this.errFun('您不能对自己的产品进行报价')
      return
    }
    wx.showLoading({
      title: '正在提交报价...'
    })
    util.request(api.offerSave, params, 'POST', {
      token
    }).then(res => {
      wx.hideLoading()
      if(res.flag == 1){
        //本单已报满
        this.setData({
          baojiaFull:true
        })
        return
      } else if (res.flag == 2){
        //你同事已报价
        this.setData({
          alreadyBaoJia:true
        })
        return
      }
     this.setData({
       tijiaoSuccess:true
     })
      // this.loadAgain()
    })
  },

  tijiaoSuccessFun(){
    this.setData({
      tijiaoSuccess: false,
      successBaoJia:false,
      alreadyBaoJiaInit: false
    })
  },

  successBaoJiaCancel(){
    util.reloadBfeorePage('/pages/index/me/myInquriy/myInquriy?type=2')
  },
  backIndex(){
    wx.switchTab({
      url: '/pages/index/inqueryRoom/inqueryRoom'
    })
  },
  
  choice_quality(e) {
    let index = e.currentTarget.dataset.index;//商家报价索引
    let offerIndex = e.currentTarget.dataset.offerindex;//配件索引
    let qualityIndex = e.currentTarget.dataset.qualityindex;//配件表内的配件等级行的索引

    let item = e.currentTarget.dataset.item;
    let itemId = e.currentTarget.dataset.itemid;
    let reqItemId = e.currentTarget.dataset.reqitemid;

    if (!item.price) return

    console.log(itemId)
    // id: 291
    // price: 664
    // reqId: 117
    // reqItemId: 112
    // state: 2

    let quality = this.data.inquiryDetailsItemOffer

    quality.map((i,iindex) => {
      if (i.offerItemVoList) {
        i.offerItemVoList.map((j, jindex) => {
          if (j.itemId == itemId){
            if (j.groupList) {
              j.groupList.map((k, kindex) => {

                if (iindex == index && jindex == offerIndex && kindex == qualityIndex) {
                  k.selected = (!k.selected ? 1 : 0)
                } else {
                  k.selected = 0
                }
                return k
              })
            }
            return j
          }
        })
      }
      return i
    })

    this.setData({
      inquiryDetailsItemOffer: quality
    })

    let totalPrice = 0
    let selectedNum = 0
    let choiceArr = []

    // 每个配件商的索引值
    quality.forEach((i, iindex) => {
      if (i.offerItemVoList) {
        i.offerItemVoList.forEach((j, jindex) => {
          if (j.groupList) {
            j.groupList.forEach((k, kindex) => {
              if (k.selected) {
                choiceArr.push(k)
                selectedNum += k.prodNum
                totalPrice += k.prodNum * k.price
              }
            })
          }
        })
      }
    })

    this.setData({
      nquiryDetailsItemOffer: quality,
      totalPrice,
      selectedNum,
      choiceArr
    })
  },
  // 选择成交
  choiceOffer() {
    let that = this
    let { choiceArr } = this.data
    if (!choiceArr.length){
      wx.showToast({
        title: '请至少选择一个配件'
      })
      return
    }
    wx.showLoading({
      title: '报价中...',
    })

    let objAr = choiceArr.map(i => {
      i = {
        id: i.offerId,
        price: i.price,
        reqId: i.reqId,
        reqItemId: i.reqItemId,
        state: 1
      }
      return i
    })

    util.request(api.confirm,objAr,'POST').then(res => {
      wx.hideLoading()
      if(res.success){
        that.setData({
          successBaoJia:true
        })
      }
      this.loadAgain()
    })
  },

  mackePhone(e) {
    var that = this
    var phone = e.currentTarget.dataset.phone
    if (phone){
      wx.makePhoneCall({
        phoneNumber: phone
      })
    } else {
      wx.showToast({
        title: '商家电话不存在',
        icon:'none'
      })
    }
  },

  preImg: function (e) {
    let self = this;
    let current = e.currentTarget.dataset.text;
    let index = e.currentTarget.dataset.index;
    const { inquiryDetails } = this.data
    const arr = inquiryDetails.prodImages.split(',')
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },

  //   跳转到配件商、维修厂详情
  goBusinessDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/index/inqueryRoom/inqueryOrderDetail/businessDetail/businessDetail?id=${id}`
    })
  },

  click(e){
    this.setData({
      show:true
    })
    util.reloadBfeorePage()
  },

  //查看报价单
  seePrice() {
    util.reloadBfeorePage('/pages/index/me/myInquriy/myInquriy?type=2')
  },
  backIndex() {
    wx.switchTab({
      url: '/pages/index/inqueryRoom/inqueryRoom'
    })
  },
  //重新发布
  applyAgain(){
    const { inquiryDetailsItemOffer, inquiryDetails, reqId } = this.data
    wx.navigateTo({
      url: `/pages/index/makeInquriy/makeInquriy?reqId=${reqId}`
    })

    return
    let params ={
      createUser: inquiryDetails.createUser,
      items:[],
      model: inquiryDetails.prodModel,
      modelName: inquiryDetails.prodModelName,
      prodImages: inquiryDetails.prodModelImage,
      providerId: inquiryDetails.providerId,
      qualitificateLimit: inquiryDetails.groupLimit,
      tenantId: App.globalData.tenantId
    }

    const center = inquiryDetailsItemOffer[0].offerItemVoList[0].groupList

    console.log(center)
    if (center) {
      center.forEach(k => {
        params.items.push({
          prodNum: k.prodNum,
          prodName: k.groupName
        })
      })
    }

    util.request(api.publishP, params,'POST').then(res => {
     
    })
  }
})