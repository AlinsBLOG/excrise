// pages/buyNow/buyNow.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseMember:false,
    certainChoose:false,
    Check:0,
    totalPrice:0,

    //订单详情
    prodGroups:[],
    orderId:'',

    //企业买家信息列表
    buyerList:[],
    bowBuyerList:{},
    type:'add',
    editBuyer:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = (options.orderId ? options.orderId : 81);
    let totalPrice = 0;
    let that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    this.getInfo();
    util.request(api.OrderDetail + user.checkLogin().id + '/detail/' + orderId, "GET")
      .then(function (res) {
        
       let prodGroups = res.data.prodGroups;
       prodGroups.map(function(item){
         item.items.map(function(subItem){
           subItem.countyName = user.getNameByCode(subItem.countyCode);
           totalPrice += (subItem.orderPrice * subItem.quantity);
           return subItem;
         })
         return item;
       })

       that.setData({
         prodGroups: prodGroups,
         orderId: res.data.orderId,
         totalPrice: totalPrice
       })
       wx.hideLoading();
      });
  },

  getInfo: function () {
    let that = this;
    util.request(api.buyerList + user.checkLogin().id + "/list").then(function (res) {
      if (res.success === true) {
        that.setData({
          buyerList: res.data,
          bowBuyerList: res.data && res.data[0]
        });
      }
    });
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
  
  },

  /**
   * 声明
   */
  agree: function () {
    wx.showModal({
      title: '服务声明',
      content: '当您在本网站及附属软件上进行用户注册登记、订制个性化产品以及参加网上支付等活动时，在您同意及确认下，本网站将通过注册表格、订单等形式要求您提供部分个人资料。个人资料包括：真实姓名、性别、电话、通信地址、电子邮件等，以上个人资料本网站仅用作确保您能够更好的享用本网站为您提供的服务，本网站保证任何情况下都不会主动向任何第三方提供这些信息，除国家法律、法规要求披露的除外。',
      showCancel:false
    })
  },
  /**
   * 数量减
   */
  cutNumber: function (e) {
    let cutItem = e.target.dataset.item;
    let prodGroups = this.data.prodGroups;
    let totalPrice = 0;
    prodGroups.map(function (item) {
      item.items.map(function (subItem) {
        if (cutItem.itemId == subItem.itemId) {
          if (subItem.quantity-1>0){
            subItem.quantity = subItem.quantity-1;
          }
        }
        totalPrice += (subItem.orderPrice * subItem.quantity);
        return subItem
      })
      return item
    })
    this.setData({
      prodGroups: prodGroups,
      totalPrice: totalPrice
    });
  },
   /**
   * 数量加
   */
  addNumber: function (e) {
    let addItem = e.target.dataset.item;
    let prodGroups = this.data.prodGroups;
    let totalPrice = 0;
    prodGroups.map(function(item){
      item.items.map(function(subItem){
        if (addItem.itemId == subItem.itemId){
          subItem.quantity++;
        }
        totalPrice += (subItem.orderPrice * subItem.quantity);
        return subItem
      })
      return item
    })
    this.setData({
      prodGroups: prodGroups,
      totalPrice: totalPrice
    });
  },
  /**
   * input键盘输入
   */
  bindinput: function (e) {
    let addItem = e.target.dataset.item;
    let prodGroups = this.data.prodGroups;
    let value = e.detail.value;
    let totalPrice = 0;
    prodGroups.map(function (item) {
      item.items.map(function (subItem) {
        if (addItem.itemId == subItem.itemId) {
          if (value<=0){
            subItem.quantity = 1;
            totalPrice += (subItem.orderPrice * subItem.quantity);
          }else{
            subItem.quantity = value;
            totalPrice += (subItem.orderPrice * subItem.quantity);
          }
        }
        return subItem
      })
      return item
    })
    this.setData({
      prodGroups: prodGroups,
      totalPrice: totalPrice
    });
  },
  /**
   * 选择买家信息
   */
  chooseMember: function () {
    this.setData({
      chooseMember: !this.data.chooseMember
    })
  },
  /**
   * 确定选哪个买家信息
   */
  chooseBuyer: function (e) {
    let that = this;
    this.setData({
      Check: e.currentTarget.dataset.id,
      chooseMember: !this.data.chooseMember,
      bowBuyerList: that.data.buyerList[e.currentTarget.dataset.id],
    })
  },
  /**
   * 添加企业买家信息
   */
  addBuyer: function () {
    this.setData({
      certainChoose: true,
      chooseMember: false,
      type:'add'
    })
  },
  /**
   * 添加买家信息返回
   */
  back: function () {
    this.setData({
      chooseMember: false
    })
  },

  certainBack: function () {
    this.setData({
      certainChoose: false
    })
  },

  editBack :function () {
    this.setData({
      certainChoose: false,
      chooseMember: true
    })
  },
  /**
   * 表单提交
   */
  formSubmit: function (e) {
    let that = this;
    var obj = e.detail.value;
    //console.log(e.detail.value)
    if (!obj.contactStaffName || !obj.contactPhone || !obj.enterpriseName) {
      util.showErrorToast('信息不完整')
    }else {
      if (util.checkMobile(obj.contactPhone)){
        if (obj.contactEmail){
          if (!util.checkEmail(obj.contactEmail)){
            return
          }
        }
      
        util.request(api.buyerList + user.checkLogin().id + "/save",{
          enterpriseName: obj.enterpriseName,
          contactStaffName: obj.contactStaffName,
          contactPhone: obj.contactPhone,
          contactEmail: obj.contactEmail,
        },'POST').then(function (res) {
          if (res.success === true) {
            wx.showToast({
              title: '添加成功'
            });
            that.getInfo();
            that.setData({
              certainChoose: false,
              chooseMember: false,
              Check:0
            })
          }
        });
      }
    }
  },

  /**
   * 编辑更新企业买家信息
   */
  editFormSubmit: function (e) {
    let that = this;
    var obj = e.detail.value;
    console.log(obj)
    if (!obj.contactStaffName || !obj.contactPhone || !obj.enterpriseName) {
      util.showErrorToast('信息不完整')
    } else {
      if (util.checkMobile(obj.contactPhone)) {
        if (obj.contactEmail) {
          if (!util.checkEmail(obj.contactEmail)) {
            return
          }
        }

        util.request(api.buyerList + user.checkLogin().id + "/update/" + that.data.editBuyer.id, {
          enterpriseName: obj.enterpriseName,
          contactStaffName: obj.contactStaffName,
          contactPhone: obj.contactPhone,
          contactEmail: obj.contactEmail,
        }, 'POST').then(function (res) {
          if (res.success === true) {
            wx.showToast({
              title: '修改成功'
            });
            that.getInfo();
            that.setData({
              certainChoose: false,
              chooseMember: false,
              Check: 0
            })
          }
        });
      }
    }
  },
  /**
   * 确认订单
   */
  goToPay: function (e) {
    let buyerInfoId;
    let buyListNow = this.data.bowBuyerList;
    let orderId = e.target.dataset.orderid;
    let prodGroups = this.data.prodGroups;
    let items = [];
    if (buyListNow && buyListNow.id ){
      buyerInfoId = buyListNow.id;
    }else{
      util.showErrorToast('请添加企业买家信息')
      return
    }

    prodGroups.map(function(item){
      item.items.map(function(subItem){
        items.push({
          itemId: subItem.itemId,
          count: subItem.quantity
        })
      })
    })

    util.request(api.DirectlyPrepare + user.checkLogin().id + "/confirm/" + orderId,{
      buyerInfoId: buyerInfoId,
      items: items
    },'POST').then(function (res) {
      if (res.success === true) {
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?orderId=' + res.data.orderId,
        })
      }else{
        util.showErrorToast('订单重复提交!')
      }
    });
  },
  edit: function (e) {
    let that = this;
    that.setData({
      type:'edit',
      certainChoose: true,
      chooseMember: false,
      editBuyer:e.target.dataset.value
    })
  }
})