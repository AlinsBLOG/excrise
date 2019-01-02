const moment = require('./moment.min.js');
const api = require('./api.js');

const formatTime = date => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 *检查手机格式是否正确
 */
const checkPhoneNum = n => {
  let that = this;
  if (!(/^[1|9][3|4|5|6|7|8|9][0-9]\d{8}$/.test(n))) {
    showErrorToast('手机格式不正确');
    return false;
  } else {
    return true;
  }
}

/**
 * 检查邮箱格式是否正确
 */

function checkEmail(email) {
  let that = this;
  if (!((/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g).test(email))) {
    showErrorToast('邮箱格式不正确');
    return false;
  } else {
    return true;
  }
}

/**
 * request
 */
function request(url, data = {}, method = "GET", header = {}) {
  let token = ''
  if (getStorageSync('registerInfo')) {
    token = getStorageSync('registerInfo').token
  }
  const that = this;
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        token,
        ...header,
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data)
          // if (res.data.success){

          // } else {
          //   // showErrorToast(res.data.message)
          //   reject(res.data)
          // }
        } else if (res.statusCode == 401) {
          reject(res.errMsg)
        } else {
          showErrorToast(res.data.message)
          reject(res.data)
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

const showErrorToast = (msg) => {
  wx.showToast({
    title: msg,
    image: '/images/icon_error.png'
  })
}

/**
 * 刷新上一页
 */
function reloadBfeorePage(beforeThenNexturl) {
  var pages = getCurrentPages(); // 当前页面
  var beforePage = pages[pages.length - 2]; // 前一个页面  

  // setTimeout(function () {
  if (beforePage) {
    if (beforeThenNexturl){
      wx.navigateBack({
        success: function () {
          wx.navigateTo({
            url: beforeThenNexturl
          })
          return
        }
      })
      return
    }
    wx.navigateBack({
      success: function() {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法  
      }
    })
  } else {
    wx.switchTab({
      url: '/pages/index/index',
      success: function() {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法  
      }
    })
  }
  // }, 1000)
}

const getStorageSync = (key) => {
  const obj = wx.getStorageSync(key)
  if (obj) {
    return JSON.parse(wx.getStorageSync(key))
  }
  return
}

const uploadFileGroup = (arr) => {
  // 图片上传至服务器
  let newA = []
  let num = 0
  let token = ''
  const that = this
  if (getStorageSync('registerInfo')){
    token = getStorageSync('registerInfo').token
  }
  return new Promise((resolve, reject) => {
    arr.forEach(item => {
      wx.uploadFile({
        url: api.uploadFile,
        filePath: item,
        name: 'image',
        header: {
          'token': token
        },
        success(res) {
          num += 1
          const obj = JSON.parse(res.data)
          newA.push(obj.data)
          if (num == arr.length) {
            resolve(newA.join(','))
          }
        }
      })
    })
  })
}

module.exports = {
  formatTime,
  checkPhoneNum,
  request,
  checkEmail,
  showErrorToast,
  reloadBfeorePage,
  getStorageSync,
  uploadFileGroup
}