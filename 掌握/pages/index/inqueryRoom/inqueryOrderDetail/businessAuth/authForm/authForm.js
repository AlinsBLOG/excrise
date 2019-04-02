const util = require('../../../../../../utils/util.js');
const api = require('../../../../../../utils/api.js');
const city = require('../../../../../../utils/city.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    showVModal:false,
    company:'',
    address: "",
    erTips:'',
    area:null,
    region:[],
    isPicker: false,
    createUser:null,
    mobile: "",
    tenantId:null,
    type:'MTS',

    upload_yingyeImg: [], //营业执照图片
    upload_yingyeImgCenter: [], //营业执照图片-临时

    logoImages: [], //公司照片
    logoImagesCenter: [] //公司照片-临时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const identity = options.title || 2
    const createUser = util.getStorageSync('userInfo').userId
    let name = ''
    let type = 'MTS'
    if (identity == 1){
      name = '修理厂'
    } else {
      name = '配件商'
      type = 'TPS'
    }
    var title = name + "认证"
    var name_placeholder = `请输入${name}名称`
    var detail_placeholder = `请输入${name}详细地址`
    var area_placeholder = `请输入${name}所在地区`
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      identity,
      createUser,
      name_placeholder,
      detail_placeholder,
      area_placeholder,
      type
    })

    this.getApplyInfo()
  },

  getApplyInfo(){
    const applyInfo = util.getStorageSync('applyInfo')
    if (applyInfo) {
      let data = {
        company: applyInfo.company,
        address: applyInfo.address,
        area: applyInfo.area,
        linkMan: applyInfo.linkMan,
        mobile: applyInfo.mobile,
        applyId: applyInfo.id
      }
      if (applyInfo.logoImage){
        data.logoImages = applyInfo.logoImage.split(',')
        data.logoImagesCenter = applyInfo.logoImage.split(',')
      }
      if (applyInfo.licenseImage) {
        data.upload_yingyeImg = applyInfo.licenseImage.split(',')
        data.upload_yingyeImgCenter = applyInfo.licenseImage.split(',')
      }
      if (applyInfo.area){
        let region = []
        let areaArr = city.vsupa_get_district_path(applyInfo.area)
        region[0] = areaArr.provinceName
        region[1] = areaArr.cityName
        region[2] = areaArr.countyName
        data.region = region
        data.isPicker = true
      }
      console.log(data)
      this.setData({
        ...data
      })
      try {
        wx.removeStorageSync('applyInfo')
      } catch (e) {

      }
    }
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      isPicker: true,
      area: e.detail.code[2]
    })
  },

  chooseLocation: function () {
    App.chooseLocation(this)
    // console.log(this.data)
  },

  certain(e){
    const region = e.detail
    this.setData({
      region,
      show:false
    })
  },

  formValidate(e) {
    const { upload_yingyeImg, upload_yingyeImgCenter, logoImages, logoImagesCenter, area, identity } = this.data
    let that = this
    const token = util.getStorageSync('registerInfo').token
    let data = {
      company: e.detail.value.company,
      address: e.detail.value.address,
      linkMan: e.detail.value.linkMan,
      mobile: e.detail.value.mobile,
      area,
      createUser: this.data.createUser,
      tenantId: App.globalData.tenantId,
      type: this.data.type,
      licenseImage:'',
      logoImage:''
    }

    if (!(/^[1|9][3|4|5|6|7|8|9][0-9]\d{8}$/.test(data.mobile))) {
      this.showModFun('手机格式不正确')
      return
    }
    
    if (!data.company){
      this.showModFun('请填写公司名称')
      return
    } else if (!data.address) {
      this.showModFun('请填写地址')
      return
    } else if (!data.linkMan) {
      this.showModFun('请填写联系人')
      return
    } else if (!data.area) {
      this.showModFun('请选择地区')
      return
    } else if (!logoImages.length) {
      this.showModFun('请上传公司照片')
      return
    }

    if (identity == 2){
      if (!upload_yingyeImg.length) {
        this.showModFun('请上传营业执照')
        return
      } 
    }
    wx.showLoading({
      title: '正在提交',
    })

    if (logoImages.length > logoImagesCenter.length){
      logoImages.splice(0, logoImagesCenter.length)
      util.uploadFileGroup(logoImages).then(resCom => {
        if (logoImagesCenter.length) {
          resCom += ',' + logoImagesCenter.join(',')
        }
        data.logoImage = resCom
        if (identity == 2 && (upload_yingyeImg.length > upload_yingyeImgCenter.length)) {
          upload_yingyeImg.splice(0, upload_yingyeImgCenter.length)
          util.uploadFileGroup(upload_yingyeImg).then(resLo => {
            if (upload_yingyeImgCenter.length) {
              resLo += ',' + upload_yingyeImgCenter.join(',')
            }
            data.licenseImage = resLo
            that.save(data)
          })
        } else {
          data.licenseImage = upload_yingyeImgCenter.join(',')
          that.save(data)
        }
      })
    } else {
      data.logoImage = logoImagesCenter.join(',')
      that.save(data)
    }
  },
  showModFun(title){
    this.setData({
      showVModal:true,
      erTips:title
    })
  },
  cancel(){
    this.setData({
      showVModal: false
    })
  },
  save(data){
    console.log(data)
    const { applyId } = this.data
    if (applyId){
      data.id = applyId
    }
    util.request(api.authorize, data, 'POST').then(resLast => {
      if (resLast.success) {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/index/inqueryRoom/inqueryOrderDetail/businessAuth/authForm/examine/examine',
          })
        }, 700)
      }
    })
  },
  // 营业执照上传
  upload_yingye: function(e) {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        self.setData({
          upload_yingyeImg: res.tempFilePaths,
        });
      }
    })
  },
  // 营业执照删除
  del_upload_yingyeImg() {
    this.setData({
      upload_yingyeImg: [],
      upload_yingyeImgCenter:[]
    });
  },
  // 公司照片上传
  upload_comp: function() {
    var self = this;
    wx.chooseImage({
      count: 3 - self.data.logoImages.length, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function(res) {
        let logoImages = self.data.logoImages;
        logoImages = logoImages.concat(res.tempFilePaths);
        self.setData({
          logoImages
        });
      }
    })
  },
  // 删除公司照片
  del_comp_img(e) {
    let that = this;
    let { logoImages, logoImagesCenter } = that.data
    let index = e.currentTarget.dataset.index

    if (index < logoImagesCenter.length) {
      logoImagesCenter.splice(index, 1)
    }
    logoImages.splice(index, 1)
    that.setData({
      logoImages: logoImages,
      logoImagesCenter: logoImagesCenter
    })
  }
})