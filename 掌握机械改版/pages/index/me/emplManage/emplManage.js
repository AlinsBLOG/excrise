const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    translateX: [],
    employeeManage: [],
    admin:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getEmployeeanage()
    let registerInfo = util.getStorageSync('registerInfo')
    if (registerInfo.authCode == 'Admin'){
      this.setData({
        admin:true
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //   添加公司人员
  addEmpl() {
    wx.navigateTo({
      url: '/pages/index/me/emplManage/addEmpl/addEmpl',
    })
  },
  // 打电话
  callPhone(e) {
    var phoneNumber = String(e.currentTarget.dataset.phonenumber);
    console.log(phoneNumber);
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  // 离开公司
  leaveCompany(){
    wx.showModal({
      title: '确认离开公司?',
      content: '离开公司以后，将接收不到询价信息，同时收回报价权',
      confirmColor: "#f05b29",
      success: function (res) {
        if (res.confirm) {
          util.reloadBfeorePage()
        }
      }
    })
  },
  /**
   * 滑动删除事件-滑动开始
   */
  touchStartHandler: function(e) {
    if (!this.data.admin) return
    if (e.target.dataset.authcode == 'Admin') return
    console.log(e)
    this.setData({
      translateX: []
    });
    var that = this;
    let startX = e.touches[0].pageX;
    let startY = e.touches[0].pageY
    this.setData({
      startX,
      startY
    });

  },
  /**
   * 滑动删除事件-滑动
   */
  touchMoveHandler: function(e) {
    if (!this.data.admin) return
    if (e.target.dataset.authcode == 'Admin') return
    let pageX = e.touches[0].pageX;
    let pageY = e.touches[0].pageY;
    let moveX = pageX - this.data.startX;
    let moveY = Math.abs(pageY - this.data.startY);
    let index = e.currentTarget.dataset.index;
    // if (moveX > 0) { // 右滑 隐藏删除
    //     if (Math.abs(this.data.translateX) == 0) {
    //         return
    //     } else {
    //         this.setData({
    //             translateX: 0
    //         })
    //     }
    // } else { // 左滑 显示删除
    //     if (Math.abs(this.data.translateX) >= 60) {
    //         return
    //     }else{
    //         this.setData({
    //             translateX: moveX                    
    //         })
    //     }

    // }
    // var moveX = Math.abs(moveX) >= 60 ? -60 :moveX
    var translateX = this.data.translateX;
    if (moveX >= 0 && moveY <= 42) {
      translateX[index] = 0;
      this.setData({
        translateX,
      })
    } else if (moveX < 0 && Math.abs(moveX) <= 60 && moveY <= 42) {
      translateX[index] = -60;
      this.setData({
        translateX
      })
    } else {
      return;
    }
  },
  /**
   * 删除对应项
   */
  delItem(e) {
    var that = this
    wx.showModal({
      title: '确认删除员工',
      content: '删除员工以后，该员工将接收不到询价信息，同时收回报价权',
      confirmColor: "#f05b29",
      success: function(res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index;
          var id = e.currentTarget.dataset.id;
          util.request(api.delUser,{
            id
          }).then(response => {
            if (response.success){
              that.getEmployeeanage()
              wx.showToast({
                title: '删除成功',
                icon: "none"
              })
              // that.data.translateX[index] = -60;
              // //    否则
              // that.setData({
              //   translateX: that.data.translateX,
              // })
            }
          })
        }
      }
    })
  },
  // 获取员工管理列表
  getEmployeeanage() {
    var self = this;
    const registerInfo = util.getStorageSync('registerInfo')
    util.request(api.getUser,{
      providerId: registerInfo.providerId
    }).then(res => {
      console.log(res.data)
      this.setData({
        employeeManage:res.data
      })
    })
  },
  // 客服
  goChating(e) {
    var chatTo = e.currentTarget.dataset.chatto;
    var id = Number(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/partials/chating/chating?chatTo=${chatTo}`,
    })
  },
})