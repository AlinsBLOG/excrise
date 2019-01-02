// pages/createCard/createCard.js
var util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardPhoto:'',
    // selected:false,
    // second:60,
    // currentId:0,
    // childrenList:[],
    modalHidden:true,
    // inputValue:'',
    // list:[
    //  {
    //     name: '金融业',
    //     id:0,
    //     children:[{
    //       name:'金融',
    //     }]
    //  },
    // ]
    region:[],
    radioG: [
      { name: '0', value: '任何人可看',checked: 'true'}, 
      { name: '1', value: '联系人可看'}
    ]
  },

  /**
   * 选择图片
   */
  chooseImg:function(){
    const that = this;
    wx.showActionSheet({
      itemList: ['拍照','从相册选择'],
      success:function(e){
        let type = ['camera'];
        if (e.tapIndex == 1){
          type = ['album'];
        }
        wx.chooseImage({
          sourceType:type,
          success: function (res) {
            that.setData({
              cardPhoto: res.tempFilePaths[0]
            })
          },
        })
      }
    })
  },

  count: function (that) {
    var second = that.data.second;
    if (second == 0) {
      that.setData({
        selected: false,
        second: 60,
      });
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      that.count(that);
    }, 1000)
  },

  formSubmit:function(e){
    const that = this;
    let OBJ = e.detail.value;
    if (!util.checkMobile(OBJ.mobile)){
      util.showErrorToast('手机格式不正确');
      return;
    }else{
      // that.setData({
      //   selected:true
      // })
      // that.count(that);
    }

    const cardPhoto = that.data.cardPhoto;
    const user = util.checkUserId();
    OBJ = { ...OBJ, userId: user.id, cmpAddress: OBJ.cmpAddress.join(' '), cardPhoto, isDefault: (OBJ.isDefault?1:0)};
    if(user){
      util.request(api.addMyCardList + '?userId=' + user.id, OBJ, 'POST').then(function (res) {
        util.showSuccessToast('添加成功');
        util.reloadBfeorePage();
      })
    }
  },

  bindKeyInput:function(e){
    const name = e.currentTarget.dataset.name;
    const value = e.detail.value;
    // this.setData({
    //   [name]: value
    // })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  bindfocus:function(e){
    this.setData({
      modalHidden:false
    })
  },

  closeModal:function(){
    this.setData({
      modalHidden: true
    })
  },

  toLogin:function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  choose:function(e){
    const parentValue = e.target.dataset.childrenlist.name;
    const childrenValue = e.target.dataset.item.name;
    this.setData({
      inputValue: parentValue + '/' + childrenValue,
      modalHidden:true
    })
  },

  switchCate:function(e){
    this.setData({
      currentId:e.target.dataset.item.id,
      childrenList: e.target.dataset.item
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '创建名片'
    })
    this.setData({
      cardPhoto: app.globalData.cardPhoto
    })
  },

  /**
   * 是选择打开相机还是直接选择相册
   */
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success: function (res) {
      console.log(res)
          if (!res.cancel) {
             if (res.tapIndex == 0) {
                that.chooseWxImage('album')
             } else if (res.tapIndex == 1) {
                that.chooseWxImage('camera')
             }
          }
       }
    })
   },

  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})