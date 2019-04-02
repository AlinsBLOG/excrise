var t = Object.assign || function (t) {
  for (var e = 1; e < arguments.length; e++) {
    var a = arguments[e];
    for (var o in a) Object.prototype.hasOwnProperty.call(a, o) && (t[o] = a[o]);
  }
  return t;
}, e = require("../../utils/util.js"), a = require("../../config/api.js"), o = require("../../services/user.js");

getApp();

Page({
  data: {
    cartGoods: [],
    cartTotal: {
      goodsCount: 0,
      goodsAmount: 0,
      checkedGoodsCount: 0,
      checkedGoodsAmount: 0
    },
    isEditCart: !1,
    checkedAllStatus: !0,
    editCartList: []
  },
  onLoad: function (t) {
    this.getCartList();
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  getCartList: function () {
    wx.showLoading({
      title: "加载中..."
    });
    var t = this;
    e.request(a.CartList + o.checkLogin().id + "/list").then(function (e) {
      if (!0 === e.success && e.data) {
        var a = e.data.itemGroups.map(function (t) {
          return t.items.map(function (t) {
            return t.checked = !1, t.countyCode = o.getNameByCode(t.countyCode), t;
          }), t;
        });
        t.setData({
          cartGoods: a,
          cartTotal: e.data.itemsCount
        });
      }
      t.setData({
        checkedAllStatus: t.isCheckedAll()
      }), t.getCheckedGoodsCount(), wx.hideLoading();
    });
  },
  isCheckedAll: function () {
    return this.data.cartGoods.every(function (t) {
      return t.items.every(function (t) {
        return 1 == t.checked;
      });
    });
  },
  checkedItem: function (t) {
    var e = t.target.dataset.parentIndex, a = t.target.dataset.subIndex, o = this, i = this.data.cartGoods.map(function (t, o) {
      return e == o && t.items.map(function (t, e) {
        return e == a && (t.checked = !t.checked), t;
      }), t;
    });
    o.setData({
      cartGoods: i,
      checkedAllStatus: o.isCheckedAll()
    }), o.getCheckedGoodsCount();
  },
  getCheckedGoodsCount: function () {
    var t = 0, e = 0;
    this.data.cartGoods.forEach(function (a) {
      a.items.forEach(function (a) {
        !0 === a.checked && (t += a.quantity, e += a.orderPrice * a.quantity);
      });
    }), this.setData({
      "cartTotal.checkedGoodsCount": t,
      "cartTotal.checkedGoodsAmount": e.toFixed(2)
    });
  },
  checkedAll: function () {
    var t = this, e = t.isCheckedAll(), a = this.data.cartGoods.map(function (t) {
      return t.items.map(function (t) {
        return t.checked = !e, t;
      }), t;
    });
    t.setData({
      cartGoods: a,
      checkedAllStatus: t.isCheckedAll()
    }), t.getCheckedGoodsCount();
  },
  editCart: function () {
    this.setData({
      isEditCart: !this.data.isEditCart
    });
  },
  updateCart: function (t, i, n) {
    e.request(a.UpdataCartList + o.checkLogin().id + "/updateItemCount?itemId=" + t + "&delta=" + n, null, "POST").then(function (t) { });
  },
  cutNumber: function (t) {
    var e = t.target.dataset.itemIndex, a = t.target.dataset.itemParentIndex, o = this.data.cartGoods[a], i = o.items[e].quantity;
    o.items[e].quantity = i - 1 > 1 ? i - 1 : 1, this.setData({
      cartGoods: this.data.cartGoods
    }), 1 != i && (this.updateCart(o.items[e].itemId, "cut", "-1"), this.getCheckedGoodsCount());
  },
  addNumber: function (t) {
    var e = t.target.dataset.itemIndex, a = t.target.dataset.itemParentIndex, o = this.data.cartGoods[a], i = o.items[e].quantity + 1;
    o.items[e].quantity = i, this.setData({
      cartGoods: this.data.cartGoods
    }), this.updateCart(o.items[e].itemId, "add", 1), this.getCheckedGoodsCount();
  },
  checkoutOrder: function () {
    var t = [], i = "";
    if (this.data.cartGoods.map(function (e, a, o) {
      e.items.map(function (e) {
        1 == e.checked && t.push(e);
      });
    }), t.length <= 0) return e.showErrorToast("请选择购买商品!"), !1;
    t.forEach(function (t) {
      i += t.itemId + ",";
    }), wx.showLoading({
      title: "加载中..."
    }), e.request(a.Prepare + o.checkLogin().id + "/prepare?itemIds=" + i, null, "POST").then(function (t) {
      wx.hideLoading(), 1 == t.success && wx.navigateTo({
        url: "/pages/buyNow/buyNow?orderId=" + t.data.orderId
      });
    });
  },
  deleteCart: function () {
    var i = this, n = this.data.cartGoods.map(function (e) {
      var a = e.items.filter(function (t) {
        return !t.checked;
      });
      return t({}, e, {
        items: a
      });
    });
    n = n.filter(function (t) {
      return t.items.length > 0;
    });
    var s = [];
    this.data.cartGoods.map(function (t) {
      t.items.map(function (t) {
        t.checked && s.push(t.itemId);
      });
    }), i.setData({
      cartGoods: n
    }), i.getCheckedGoodsCount(), s.join(",") ? e.request(a.RemoveCartList + o.checkLogin().id + "/removeProducts?itemIds=" + s.join(","), null, "POST").then(function (t) {
      !0 === t.success && wx.showToast({
        title: "删除成功!"
      });
    }) : e.showErrorToast("请选择要删除的商品!");
  }
});