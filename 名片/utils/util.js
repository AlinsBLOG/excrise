var api = require('../config/api.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * request
 */
function request(url, data = {}, method = "GET",typeData) {
  const that = this;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        // 'X-Nideshop-Token': wx.getStorageSync('token'),
        'Cookie': wx.getStorageSync('uid'),
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.errno == 401) {
            //需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
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
          } else {
            if(res.data.success === true){
              if (typeData == 'ALL'){
                resolve(res.data)
              }else{
                resolve(res.data.data);
              }
            }else{
              that.showErrorToast(res.data.message)
            }
          }
        } else {
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

function checkUserId(){
  const localUser = wx.getStorageSync('user');
  if (localUser){
    const user = JSON.parse(localUser);
    return user;
  }else{
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function showSuccessToast(msg){
  wx.showToast({
    title: msg,
  })
}

/**
 *检查手机格式是否正确
 */
function checkMobile(mobile){
  return /^[1|9][3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobile);
}

/**
 * 检查邮箱格式是否正确
 */
function checkEmail(email){
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g.test(email);
}

/**
 * 判断是否为空对象
 */
function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

/**
 * 刷新上一页
 */
function reloadBfeorePage(){
  var pages = getCurrentPages(); // 当前页面
  var beforePage = pages[pages.length - 2]; // 前一个页面  

  setTimeout(function(){
    if (beforePage){
      if (beforePage.route == 'pages/myCard/myCard'){
        wx.switchTab({
          url: '/pages/myCard/myCard',
          success:function(){
            beforePage.onLoad(); // 执行前一个页面的onLoad方法  
          }
        })
      }else{
        wx.navigateBack({
          success: function () {
            beforePage.onLoad(); // 执行前一个页面的onLoad方法  
          }
        }); 
      }
    }else{
      wx.switchTab({
        url: '/pages/myCard/myCard',
      })
    }
  },1000)
}

/**
 * 停止加载和上拉刷新
 */
function stop(){
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
  showSuccessToast,
  checkSession,
  login,
  getUserInfo,
  checkMobile,
  checkEmail,
  checkUserId,
  isEmptyObject,
  reloadBfeorePage,
  stop
}


