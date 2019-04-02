const app = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    myCardList:[],
    //我的名片
    cardFolder:{},
    //我的草稿箱
    draftlist:{},
    //群通讯录
    groupList:{},
    globalImage: app.globalData.cardPhoto,
    showModal: false,
    modalVisible: false,
    inputValue:'',
    current: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.myContactList();
  },

  inputChange:function(e){
    const value = e.detail.value;
    this.setData({
      inputValue: value
    })
  },

  swiperScrollChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  /**
  * 获取我的名片列表
  */
  getMyCardListFunction: function () {
    wx.showLoading({
      title: '加载中...',
    })
    const that = this;
    const user = util.checkUserId();
    if (user) {
      //获取个人名片列表
      util.request(api.getMyCardList + '?userId=' + user.id + '&pageNo=1&pageSize=10', {}, 'POST').then(function (res) {
        wx.hideLoading();
        if (res) {
          that.setData({
            modalVisible: true,
            myCardList: res
          })
        }
      })
    }
  },

  /**
   * 获取我的名片夹
   */
  myContactList:function(){
    wx.showLoading({
      title: '加载中...',
    })
    const user = util.checkUserId();
    const that = this;
    wx.showNavigationBarLoading();
    util.request(api.myContactList, {
      userId:user.id,
      pageNo:1,
      pageSize:10,
    }, 'GET','ALL').then(function (res) {
      if(res){
        that.setData({
          cardFolder:res
        })
      }
    })
    
    util.request(api.myDraftList, {
      userId: user.id,
      pageNo: 1,
      pageSize: 10,
    }, 'GET','ALL').then(function (res) {
      if (res) {
        that.setData({
          draftlist: res
        })
      }
    })
    that.qGroupList();
  },

  //查询群通讯录列表
  qGroupList:function(){
    const ownerId = util.checkUserId().id;
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    util.request(api.groupList + '?ownerId=' + ownerId, {
      ownerId,
      pageNo: 1,
      pageSize: 10,
    }, 'POST',"ALL").then(function (res) {
      if (res) {
        that.setData({
          groupList: res
        })
      }
      util.stop();
    })
    wx.hideLoading();
  },

  shareButNoLogin:function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true,
      inputValue:''
    })
  },

  preventTouchMove: function () {
  
  },

  onCancel: function () {
    this.setData({
      showModal: false,
      modalVisible: false
    });
  },

  /**
   * 关闭模态框
   */
  closeModal: function () {
    this.setData({
      modalVisible: false
    })
  },

  onConfirm: function () {
    const { inputValue } = this.data;
    const ownerId = util.checkUserId().id;
    const that = this;
    if (!inputValue){
      util.showErrorToast('请填写群通讯录名称');
    }else{
      that.onCancel();
      util.request(api.groupAdd, {
        ownerId,
        groupName: inputValue
      }, 'POST').then(function (res) {
        if (res) {
          that.qGroupList();
          util.showSuccessToast('添加群组成功')
        }
      })
    }
  },

  certain: function () {
    const { inputValue, myCardList, current } = this.data;
    const ownerId = util.checkUserId().id;
    const that = this;
    that.setData({
      modalVisible: false
    })
    wx.showLoading({
      title: '加载中...',
    })
    console.log(myCardList[current])

    util.request(api.groupAdd, {
      ownerId,
      groupName: inputValue
    }, 'POST').then(function (res) {
      if (res) {
        console.log(res)
        that.qGroupList();
      }
    })
    this.hideModal();
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
    this.myContactList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      success: function (res0) {
        wx.getShareInfo({
          shareTicket: res0.shareTickets[0],
          success:function(res1){
            console.log(res1)
            const encrypt = res1.encryptedData;
            const iv = res1.iv;
            util.request('http://www.st122.cn/xcx/php/demo.php', {
              encrypt: encrypt,
              iv: iv,
              sessionKey: app.globalData.sessionKey
            }).then(function (res3) {
              var x = res3.data;
              var y = eval('(' + x + ')');
              var openGId = y.openGId;
              util.request(api.createGroup, {
                groupName: 'groupName',
                ownerId: 'ownerId'
              }).then(function (res4) {
                //创建成功先把自己加入群组
                util.request(api.updateGroupMember, {
                  memberid: '', // 新增成员名片id
                  groupid: '', //群组id
                  action:'1',
                }).then(function (res5) {
                  //创建成功先把自己加入群组
                  util.showSuccessToast('分享成功');
                })
              })
            })
          }
        })
      },
    }
  }
})