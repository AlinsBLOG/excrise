/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');
const tcity = require("../pages/template/city.js");



/**
 * 根据code获取省市名字
 */
function getNameByCode(code){
  let vsupa_get_district_path = tcity.vsupa_get_district_path;
  let nameObj = vsupa_get_district_path(code);
  return (nameObj.provinceName + ' - ' + nameObj.cityName)
}

/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  // return new Promise(function (resolve, reject) {
  //   // if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
  //   if (wx.getStorageSync('lsuid')) {
  //     util.checkSession().then(() => {
  //       resolve(true);
  //     }).catch(() => {
  //       reject(false);
  //     });

  //   } else {
  //     reject(false);
  //   }
  // });
  let obj = wx.getStorageSync('lsuid');
  if (obj){
    return util.redirect(JSON.parse(obj))
  }else{
    return util.redirect(false)
  }
}

/**
 * 用存储的json对象判断用户是否登录
 */
function checkLoginWithJson(that) {
  try {
    let value = JSON.parse(wx.getStorageSync('lsuid'));
    let name = that.data.name;
    if (value) {
      if (value.avatarImg) {
        that.setData({
          avatarImg: value.avatarImg
        })
      }
      if (value.username) {
        name = value.username;
      } else if (value.realName) {
        name = value.realName;
      } else if (value.nickName) {
        name = value.nickName;
      } else if (value.mobile) {
        name = value.mobile;
      }
      that.setData({
        name: name,
        type:'login'
      })
    }
  } catch (e) { }
};


module.exports = {
  loginByWeixin,
  checkLogin,
  checkLoginWithJson,
  getNameByCode,
};











