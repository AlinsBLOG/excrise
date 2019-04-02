var api = require('../config/api.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * request
 */
function request(url, data = {}, method = "GET") {
  const that = this;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Access-Token': wx.getStorageSync('accessToken'),
        'Cookie': wx.getStorageSync('uid'),
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve({ ...res.data, header:res.header});
        } else if (res.statusCode == 401){
          reject(res.data)
        }else{
          that.showErrorToast('加载出错了！')
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          console.log(res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(boolen) {
  //判断页面是否需要登录
  if (!boolen) {
    wx.navigateTo({
      url: '/pages/login/login'
    });
    return false;
  } else {
    return boolen;
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

/**
 * 生成时间戳
 */
function timeStamp(){
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成随机数
 */
function getRandom(){
  return Math.random().toString(36).substr(2, 8);
}

/* 随机数 */
function randomString(){
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < 32; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 *检查手机格式是否正确
 */
function checkMobile(mobile){
  let that = this;
  if (!(/^[1|9][3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobile))){
    that.showErrorToast('手机格式不正确');
    return false;
  }else{
    return true;
  }
}

/**
 * 检查邮箱格式是否正确
 */

function checkEmail(email){
  let that = this;
  if (!((/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g).test(email))) {
    that.showErrorToast('邮箱格式不正确');
    return false;
  }else{
    return true;
  }
}

/**
 * 停止加载和上拉刷新
 */
function stop() {
  setTimeout(function () {
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
  }, 800)
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  checkMobile,
  checkEmail,
  stop,
  timeStamp,
  randomString,
  getRandom
}


