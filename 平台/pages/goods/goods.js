getApp();

var a = require("../../lib/wxParse/wxParse.js"), e = require("../../utils/util.js"), t = require("../../config/api.js"), i = require("../template/city.js"), d = require("../../services/user.js"), r = null;

Page({
    data: {
        skuUuid: "",
        skuId: "",
        dataIndex: 0,
        serveDetails: {},
        cityData: [],
        value: [ 0, 0, 0 ],
        values: [],
        condition: !1,
        prodSkuUuid: "",
        providerUuid: "",
        durationNames: [],
        selectedDurationName: "",
        countyCode: "",
        price: ""
    },
    getGoodsInfo: function() {
        wx.showLoading({
            title: "加载中"
        });
        var d = this;
        e.request(t.ServiceArea + d.data.skuId + "/applyRegion/list").then(function(a) {
            if (!0 === a.success) {
                var e = a.data, t = [], o = [];
                if ("*" === e[0].provinceCode) o = (r = i.vsupa_get_children_district)(); else {
                    var u = new (0, i.VsupaDistrictTree)(e);
                    o = (r = function(a) {
                        return u.getChildren(a);
                    })(null);
                }
                o[0].children = r(o[0].value), o[0].children[0].children = r(o[0].children[0].value), 
                t = o, d.setData({
                    cityData: t
                });
            }
            wx.hideLoading();
        }), e.request(t.GoodsDetail + d.data.skuUuid + ".json").then(function(e) {
            !0 === e.success && (d.setData({
                durationNames: e.data.skuDetail.durationNames,
                serveDetails: e.data,
                prodSkuUuid: e.data.skuDetail.uuid,
                providerUuid: e.data.provider.uuid,
                prodSkuId: e.data.skuDetail.id,
                selectedDurationName: e.data.skuDetail.selectedDurationName,
                price: e.data.skuDetail.minPrice
            }), a.wxParse("description", "html", e.data.skuDetail.description, d));
        });
    },
    onLoad: function(a) {
        this.setData({
            skuUuid: a.id ? a.id : "SKU-TEST-2018-0000000000000017",
            skuId: a.skuId ? a.skuId : "17"
        }), this.getGoodsInfo();
    },
    cityPickerChange: function(a) {
        var e = this.data.cityData, t = this.data.value, i = a.detail.value;
        t[0] !== i[0] && (e[i[0]].children = r(e[i[0]].value), e[i[0]].children[i[1]].children = r(e[i[0]].children[i[1]].value), 
        this.setData({
            value: [ i[0], 0, 0 ]
        })), t[1] !== i[1] && (e[i[0]].children[i[1]].children = r(e[i[0]].children[i[1]].value), 
        this.setData({
            value: [ i[0], i[1], 0 ]
        })), t[2] !== i[2] && this.setData({
            value: [ i[0], i[1], i[2] ]
        }), this.setData({
            cityData: e
        });
    },
    open: function(a) {
        var e = a.target.dataset.click, t = this;
        if (this.setData({
            condition: !this.data.condition
        }), "certion" == e) {
            var i = t.data.cityData[t.data.value[0]].children[t.data.value[1]].children[t.data.value[2]], d = t.data.selectedDurationName;
            t.setData({
                values: t.data.value,
                countyCode: i.value
            }), i.value && d && t.getPrice(d, i.value);
        }
    },
    bindDataPickerChange: function(a) {
        var e = this;
        e.setData({
            dataIndex: a.detail.value,
            selectedDurationName: e.data.durationNames[a.detail.value]
        });
        var t = e.data.selectedDurationName, i = e.data.countyCode;
        t && i && e.getPrice(t, i);
    },
    getPrice: function(a, i) {
        var d = this;
        e.request(t.CheckPrice + d.data.serveDetails.skuDetail.id + "/orderPrice", {
            durationName: a,
            countyCode: i
        }, "GET").then(function(a) {
            !0 === a.success && d.setData({
                price: a.data
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    openCartPage: function() {
        wx.switchTab({
            url: "/pages/cart/cart"
        });
    },
    mycart: function() {
        wx.navigateTo({
            url: "/pages/cart/cart"
        });
    },
    zxServe: function() {
        wx.makePhoneCall({
            phoneNumber: "12345678900",
            success: function() {
                console.log("拨打电话成功！");
            },
            fail: function() {
                console.log("拨打电话失败！");
            }
        });
    },
    buyNow: function(a) {
        this.data.selectedDurationName ? this.data.countyCode ? (wx.showLoading({
            title: "正在跳转..."
        }), e.request(t.DirectlyPrepare + d.checkLogin().id + "/directlyPrepare", {
            providerUuid: this.data.providerUuid,
            prodSkuUuid: this.data.prodSkuUuid,
            durationName: this.data.selectedDurationName,
            countyCode: this.data.countyCode,
            prodSkuId: this.data.prodSkuId
        }, "POST").then(function(a) {
            1 == a.success && wx.navigateTo({
                url: "/pages/buyNow/buyNow?orderId=" + a.data.orderId
            });
        })) : e.showErrorToast("请选择服务地区!") : e.showErrorToast("请选择服务期限!");
    },
    addToCart: function() {
      console.log(t.CartAdd + d.checkLogin().id + "/addProduct")
        this.data.selectedDurationName ? this.data.countyCode ? e.request(t.CartAdd + d.checkLogin().id + "/addProduct", {
            providerUuid: this.data.providerUuid,
            prodSkuUuid: this.data.prodSkuUuid,
            durationName: this.data.selectedDurationName,
            countyCode: this.data.countyCode
        }, "POST").then(function(a) {
            1 == a.success ? wx.showToast({
                title: "添加成功"
            }) : wx.showToast({
                image: "/static/images/icon_error.png",
                title: "添加失败"
            });
        }) : e.showErrorToast("请选择服务地区!") : e.showErrorToast("请选择服务期限!");
    }
});