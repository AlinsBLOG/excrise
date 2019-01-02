const app = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否是在不编辑状态
    editState:false,

    groupInfo:{},
    groupId:'',
    groupContactListData:{},
    groupContactList: [],
    pageNo:1,
    pageSize:10,
    request:true,

    groupContactListContact:[],
    pageNoContact: 1,
    pageSizeContact: 10,
    requestContact: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const groupId = options.id;
    const that = this;
    wx.setNavigationBarTitle({
      title: '群通讯录',
    });
    this.setData({
      groupId,
      globalImage: app.globalData.cardPhoto
    })
    util.request(api.groupGet, {
      id: groupId,
    }, 'GET').then(function (res) {
      if (res) {
        if (res) {
          that.setData({
            groupInfo: res
          })
        }
      }
    })
    this.getGroup();
  },

  editGroupName:function(){
    this.setData({
      showModal:true
    })
  },

  exitGroupFun:function(){
    this.setData({
      editState:true
    })
  },

  editCancel:function(){
    this.setData({
      editState: false
    })
  },

  deletecheckbox:function(e){
    console.log(e)
    this.setData({
      deleteGroupList: e.detail.value
    })
  },

  deleteCertain:function(){
    const that = this;
    let { deleteGroupList, groupInfo } = that.data;
    const userId = util.checkUserId().id;

    if (deleteGroupList && deleteGroupList.length) {
      that.closeModal();
      wx.showLoading({
        title: '加载中...',
      })
      deleteGroupList = deleteGroupList.map(function(item){
        return parseInt(item);
      });
      util.request(api.groupDeteteMember + '?groupContactIds='+deleteGroupList, {},'POST').then(function (res) {
        wx.hideLoading();
        util.showSuccessToast('批量删除成功');
        that.setData({
          selectContactList: [],
          groupContactListData: {},
          groupContactList: [],
          pageNo: 1,
          pageSize: 10,
          request: true,
          editState:false
        })
        that.getGroup();
      })
    } else {
      util.showErrorToast('请选择联系人');
    }
  },

  onCancel: function () {
    this.setData({
      showModal: false,
      selectContactList: [],
    });
  },

  onConfirm:function(){
    wx.showLoading({
      title: '加载中...',
    })
    const { editValue, groupInfo } = this.data;
    const that = this;
    util.request(api.groupModify, {
      id: groupInfo.id,
      groupName: editValue,
    }, 'POST').then(function (res) {
      that.setData({
        groupInfo:{
          ...groupInfo,
          groupName: editValue
        }
      })
      wx.hideLoading();
      that.onCancel();
    })
  },

  inputChange:function(e){
    this.setData({
      editValue:e.detail.value
    })
  },

  scrolltolower:function(){
    const { groupContactList } = this.data;
    this.getGroup();
  },

  scrolltolowerContact:function(){
    this.getGroupContact();
  },

  getGroup: function (){
    const that = this;
    const { pageNo, pageSize, groupId, groupContactList, request } = that.data;

    if (request){
      wx.showLoading({
        title: '加载中...',
      })
      util.request(api.groupGetContactList, {
        groupId: groupId,
        pageNo,
        pageSize
      }, 'GET', "ALL").then(function (res) {
        if (res.data) {
          that.setData({
            groupContactListData: res,
            groupContactList: groupContactList.concat(res.data),
            pageNo: pageNo+1
          })
        }
        if(!res.data || res.data.length < pageSize){
          that.setData({
            request:false
          })
        }
        wx.hideLoading();
      })
    }
  },

  getGroupContact: function () {
    const that = this;
    const userId = util.checkUserId().id;
    const { pageNoContact, pageSizeContact, groupId, groupContactListContact, requestContact } = that.data;

    if (requestContact) {
      wx.showLoading({
        title: '加载中...',
      })
      util.request(api.myContactList, {
        userId,
        pageNo: pageNoContact,
        pageSize: pageSizeContact,
      }, 'GET').then(function (res) {
        if (res) {
          that.setData({
            groupContactListContact: groupContactListContact.concat(res),
            pageNo: pageNoContact + 1
          })
        }
        if (!res || res.length < pageSizeContact) {
          that.setData({
            requestContact: false
          })
        }
        wx.hideLoading();
      })
    }
  },

  addContactToGroup:function(){
    const that = this;
    that.getGroupContact();
    that.setData({
      modalVisible:true
    })
  },

  checkboxChange:function(e){
    this.setData({
      selectContactList: e.detail.value
    })
  },

  /**
   * 关闭模态框
   */
  closeModal: function () {
    this.setData({
      modalVisible: false
    })
  },

  /**
   * 点击确定
   */
  certain:function(){
    const that = this;
    let { selectContactList, groupInfo } = that.data;
    const userId = util.checkUserId().id;
    if (selectContactList && selectContactList.length){
      that.closeModal();
      wx.showLoading({
        title: '加载中...',
      })
      util.request(api.addContactToGroup + '?userId=' + userId + '&groupId=' + groupInfo.id, {
        userId,
        groupId: groupInfo.id,
        cardIds: selectContactList
      }, 'POST').then(function (res) {
        wx.hideLoading();
        util.showSuccessToast('添加成功');
        that.setData({
          selectContactList:[],
          groupContactListData: {},
          groupContactList: [],
          pageNo: 1,
          pageSize: 10,
          request: true,
        })
        that.getGroup();
      })
    }else{
      util.showErrorToast('请选择联系人');
    }
  },

  toMyCard:function(){
    wx.reLaunch({
      url: "/pages/myCard/myCard"
    })
  },

  toMyCard: function () {
    wx.reLaunch({
      url: "/pages/myCard/myCard"
    })
  },

  toContactCard:function(e){
    const cardId = e.target.dataset.id;
    if(cardId){
      wx.navigateTo({
        url: '/pages/index/index?cardId=' + cardId,
      })
    }
  },

  //退出本群
  quit_out:function(){
    const { groupInfo } = this.data;
    wx.showModal({
      title: '解散群组',
      content: '点击确定后，此群通讯录将自动删除，确定要解散本群吗？',
      success:function(e){
        if (e.confirm){
          util.request(api.groupDetete + '?id=' + groupInfo.id, {},'POST').then(function (res) {
            util.showSuccessToast('解散成功');
            util.reloadBfeorePage();
          })
        }
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