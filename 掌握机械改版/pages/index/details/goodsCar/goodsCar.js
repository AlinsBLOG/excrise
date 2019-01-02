// pages/index/goodsCar/goodsCar.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    allSelect:false,
    number:0,
    money:"0.00",
    showLoading:true,
    carList:[],
    searchNull:true,
    showMore3:0,
    page3:1,
    likeList:[],
    delBtnWidth:132//删除按钮宽度单位（rpx）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.initEleWidth();
      this.getLikeList1();
  },

  onShow: function () {
    
    var isTied = App.globalData.isTied;
    console.log(isTied);
    if (!isTied) {
      this.setData({
        searchNull:true,
        showLoading:false
      })
    }else if 
    (isTied) {
      this.setData({
        searchNull:false
      })
      this.getCarList();
    }
    this.setData({
      number:0,
      money:"0.00"
    })
  },

  // 获取购物车数据
  getCarList:function () {
    var that = this;
    var meData = App.globalData.meData;
    var data = {
      token_id:meData.token_id
    }
    App.request(
      'cart/cartlist',
      'POST',
      data,
      function(res){
          console.log(res.data);
          that.setData({
            carList:res.data.data.cart.reverse()
          })
          if (!that.data.carList.length == 0) {
            that.setData({
              searchNull: false
            })

            // 读取购物车勾选状态
            var carList = that.data.carList
            var storage = wx.getStorageSync('carList')
            console.log(storage);

            for (let i = 0; i < storage.length; i++) {
              if (storage[i].select == true) {
                // console.log(storage[i].company_id);
                for (let j = 0; j < carList.length; j++) {
                  if (storage[i].company_id == carList[j].company_id) {
                    carList[j].select = true
                    // console.log(carList[j].company_id);
                  }
                }
              }
              for (let k = 0; k < storage[i].goods.length; k++) {
                if (storage[i].goods[k].select == true) {
                  // console.log(storage[i].goods[k].cart_id);
                  for (let l = 0; l < carList.length; l++) {
                    for (let m = 0; m < carList[l].goods.length; m++) {
                      if (storage[i].goods[k].cart_id == carList[l].goods[m].cart_id) {
                        carList[l].goods[m].select = true
                        // console.log(carList[l].goods[m].cart_id);
                      }
                    }
                  }
                }
              }
            }
            var allSelect = true
            for (let i = 0; i < carList.length; i++) {
              if (!allSelect) {
                break;
              }
              for (let j = 0; j < carList[i].goods.length; j++) {
                if (carList[i].goods[j].select) {
                  allSelect = true
                } else {
                  allSelect = false
                  break;
                }
              }
            }
            that.setData({
              carList,
              allSelect
            })
            // 数量运算
            var number = 0;
            for (let i = 0; i < carList.length; i++) {
              for (let j = 0; j < carList[i].goods.length; j++) {
                if (carList[i].goods[j].select) {
                  number += parseInt(carList[i].goods[j].goods_num)
                }
              }
            }
            that.setData({
              number
            })
            // 价格运算
            var money = 0;
            for (let i = 0; i < carList.length; i++) {
              for (let j = 0; j < carList[i].goods.length; j++) {
                if (carList[i].goods[j].select) {
                  money += parseFloat(carList[i].goods[j].goods_num * carList[i].goods[j].nowprice)
                }
              }
            }
            money = money.toFixed(2);
            that.setData({
              money
            })
            // console.log(that.data.carList);

          } else {
            that.setData({
              searchNull: true
            })
          }
          that.setData({
            showLoading:false
          })
      }
    );
  },
  // 获取商品ID跳转到详情
  goDetails: function (e) {
    var id = e.currentTarget.dataset.text.model_id;
    var goods_id = e.currentTarget.dataset.text.goods_id;

    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
    });
  },
  goDetails2: function (e) {
    var id = e.currentTarget.dataset.text.id;
    var goods_id = e.currentTarget.dataset.text.goods_id;

    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id + '&goods_id=' + goods_id
    });
  },
  //跳转到商家
  goCompany:function (e) {
    var id = e.currentTarget.dataset.text.company_id;
    wx.navigateTo({
      url: '/pages/index/company/company?id='+id
    });
  },
  // 猜你喜欢1
  getLikeList1: function(){
    console.log("3");
    
    var that = this;
    this.setData({ showMore3: 1 });
    var page3 =this.data.page3
    var data = {
      page:page3,
      token_id:App.globalData.meData.token_id
    }
    App.request(
      'index/index_more',
      'POST',
      data,
      function (res) {
        var moreLike = res.data.data
        var likeList = that.data.likeList.concat(moreLike)
        
        page3++
        that.setData({
          likeList,
          page3,
          showMore3: moreLike.length == 20 ? 0 : 2
        })

      }
    );
  },
    ////////////////////////////////

    touchS:function(e){
      if(e.touches.length==1){
        var index = e.currentTarget.dataset.index;
        this.setData({
          //设置触摸起始点水平方向位置
          startX:e.touches[0].clientX,
          boxIndex:index
        });
        
      }
    },
    touchM:function(e){
      if(e.touches.length==1){
        //手指移动时水平方向位置
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        var txtStyle = "";
        if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0px";
        }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-"+disX+"px";
          if(disX>=delBtnWidth){
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-"+delBtnWidth+"px";
          }
        }
        //获取手指触摸的是哪一项
        var carList = this.data.carList;
        // carList.goods.txtStyle = txtStyle;

        //更新列表的状态
        this.setData({
          carList:carList
        });
      }
    },
  
    touchE:function(e){
      if(e.changedTouches.length==1){
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
        //获取手指触摸的是哪一项
        var listIndex =this.data.listIndex;
        var index = e.currentTarget.dataset.index;
        var carList = this.data.carList;
        
        carList[listIndex].goods[index].txtStyle = txtStyle;
        
        //更新列表的状态
        this.setData({
          carList:carList
        });
        
      }
    },
    //获取元素自适应后的实际宽度
    getEleWidth:function(w){
      var real = 0;
      try {
        var res = wx.getSystemInfoSync().windowWidth;
        var scale = (750/2)/(w/2);//以宽度750px设计稿做宽度的自适应
        real = Math.floor(res/scale);
        return real;
      } catch (e) {
        return false;
       // Do something when catch error
      }
    },
    initEleWidth:function(){
      var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
      this.setData({
        delBtnWidth:delBtnWidth
      });
    },
    checkIndex:function (e) {
      var listIndex = e.currentTarget.dataset.index;
      this.setData({
        listIndex
      })
    },
    //点击删除按钮事件
  delItem:function(e){
    var carList = this.data.carList;
    var listIndex = this.data.listIndex;
    var boxIndex = this.data.boxIndex;
    var that = this;
    var cart_id = e.currentTarget.dataset.text.cart_id;
    var data = {
      token_id:App.globalData.meData.token_id,
      cart_id
    }
    App.request(
      'cart/del_cart',
      'POST',
      data,
      function (res) {
        console.log(res);

        if (res.data.status == 1) {
          carList[listIndex].goods.splice(boxIndex, 1);
          //如果删除后商品数为0，删除商家
          if (carList[listIndex].goods.length == 0) {
            carList.splice(listIndex, 1)
          } else {
            //商品都为true，将商家变成true
            for (let i = 0; i < carList[listIndex].goods.length; i++) {
              if (carList[listIndex].goods[i].select) {
                carList[listIndex].select = true
              } else {
                carList[listIndex].select = false
                break;
              }
            }
            //商家都为true，将全选变成true
            for (let i = 0; i < carList.length; i++) {
              if (carList[i].select) {
                that.setData({
                  allSelect: true
                });
              } else {
                that.setData({
                  allSelect: false
                });
                break;
              }
            }
          }
          //更新列表的状态
          that.setData({
            carList: carList
          });
          if (that.data.carList.length == 0) {
            that.setData({
              searchNull: true
            })
          }
          that.checkboxChange(e)
        }
      }
    )
  },
 

    ////////////////////////////////
    // 商品数量加减
    numDown:function (e) {
      if (this.data.flag) {
        this.setData({
          flag:false
        })
        var carList = this.data.carList;
        var listIndex = this.data.listIndex;
        var boxIndex = this.data.boxIndex;
        
        var that = this;
        var cart_id = e.currentTarget.dataset.text.cart_id;
        var goods_num = e.currentTarget.dataset.text.goods_num;
        goods_num--
        if (goods_num<1) {
          goods_num = 1 ;
        }
        var data = {
          token_id:App.globalData.meData.token_id,
          cart_id,
          goods_num
        }
        App.request(
          'cart/save_num',
          'POST',
          data,
          function (res) {
            // that.getCarList();
            if (res.data.status == 1) {
              carList[listIndex].goods[boxIndex].goods_num--;
              if (carList[listIndex].goods[boxIndex].goods_num<1) {
                carList[listIndex].goods[boxIndex].goods_num = 1 ;
              }
              //更新列表的状态
              that.setData({
                carList:carList
              });
              that.checkboxChange(e);
            }
            that.setData({
              flag:true
            })
          }
        )
      }

    },
    numUp:function (e) {
      if (this.data.flag) {
        this.setData({
          flag:false
        })
        var carList = this.data.carList;
        var listIndex = this.data.listIndex;
        var boxIndex = this.data.boxIndex;
        

        var that = this;
        var cart_id = e.currentTarget.dataset.text.cart_id;
        var goods_num = e.currentTarget.dataset.text.goods_num;
        goods_num++
        var data = {
          token_id:App.globalData.meData.token_id,
          cart_id,
          goods_num
        }
        App.request(
          'cart/save_num',
          'POST',
          data,
          function (res) {
            // that.getCarList();
            if (res.data.status == 1) {
              carList[listIndex].goods[boxIndex].goods_num++;
              //更新列表的状态
              that.setData({
                carList:carList
              });
              that.checkboxChange(e);
            }
            that.setData({
              flag:true
            })
          }
        )
      }
    },
    // 选中商品
    checkboxChange:function (e) {
      var id = e.currentTarget.id;
      var listIndex = this.data.listIndex;
      var boxIndex = this.data.boxIndex;
      var carList = this.data.carList;
      
      if (id == 3) {
        var select = carList[listIndex].goods[boxIndex].select;
        if (!select) {
          //将商品变成true
          carList[listIndex].goods[boxIndex].select = true;
          //商品都为true，将商家变成true
          for (let i = 0; i < carList[listIndex].goods.length; i++) {
            if (carList[listIndex].goods[i].select) {
              carList[listIndex].select = true
            }else{
              carList[listIndex].select = false
              break;
            }
          }
          //商家都为true，将全选变成true
          for (let i = 0; i < carList.length; i++) {
            if (carList[i].select) {
              this.setData({
                allSelect:true
              });
            }else{
              this.setData({
                allSelect:false
              });
              break;
            }
          }
        }else{
          //将商品变成false
          carList[listIndex].goods[boxIndex].select = false;
          //将商家变成false
          carList[listIndex].select = false;
          //将全选变成false
          this.setData({
            allSelect:false
          });
        }
      }else if 
      (id == 2) {
        var select = carList[listIndex].select;
        if (!select) {
          // 将商家变成true,商品都为true
          carList[listIndex].select = true;
          for (let i = 0; i < carList[listIndex].goods.length; i++) {
            carList[listIndex].goods[i].select = true;
          }
          //商家都为true，将全选变成true
          for (let j = 0; j < carList.length; j++) {
            if (carList[j].select) {
              this.setData({
                allSelect:true
              });
            }else{
              this.setData({
                allSelect:false
              });
              break;
            }
          }
        }else{
          //将商家变成false
          carList[listIndex].select = false;
          //将商品变成false
          for (let i = 0; i < carList[listIndex].goods.length; i++) {
            carList[listIndex].goods[i].select = false;
          }
          //将全选变成false
          this.setData({
            allSelect:false
          });
        }
      }else if 
      (id == 1) {
        var select = this.data.allSelect
        if (!select) {
          //将全选变成true
          this.setData({
            allSelect:true
          });
          //将商家变成true
          for (let i = 0; i < carList.length; i++) {
            carList[i].select = true;
            //将商品变成true
            for (let j = 0; j < carList[i].goods.length; j++) {
              carList[i].goods[j].select = true;
            }
          }
        }else{
          //将全选变成false
          this.setData({
            allSelect:false
          });
          //将商家变成false
          for (let i = 0; i < carList.length; i++) {
            carList[i].select = false;
            //将商品变成false
            for (let j = 0; j < carList[i].goods.length; j++) {
              carList[i].goods[j].select = false;
            }
          }
        }
      }
      // 更新列表状态
      this.setData({
        carList:carList
      });
      wx.setStorageSync('carList', carList);      
      // 数量运算
      var number = 0;
      for (let i = 0; i < carList.length; i++) {
        for (let j = 0; j < carList[i].goods.length; j++) {
          if (carList[i].goods[j].select) {
            number += parseInt(carList[i].goods[j].goods_num)
          }
        }
      }
      this.setData({
        number
      })
      // 价格运算
      var money = 0;
      for (let i = 0; i < carList.length; i++) {
        for (let j = 0; j < carList[i].goods.length; j++) {
          if (carList[i].goods[j].select) {
            money += parseFloat(carList[i].goods[j].goods_num * carList[i].goods[j].nowprice)
          }
        }
      }
      money = money.toFixed(2); 
      this.setData({
        money
      })
    },
    //跳转到确认订单
    toCheckOrder:function () {
      if (this.data.number == 0) {
        wx.showToast({
            title: '请选择需要的配件',
            icon:'none'
        })
      }else{
        var carList = this.data.carList;
        var cart_id = '';
        for (let i = 0; i < carList.length; i++) {
          for (let j = 0; j < carList[i].goods.length; j++) {
            if (carList[i].goods[j].select) {
              cart_id += carList[i].goods[j].cart_id + ','
            }
          }
        }
        cart_id = cart_id.substring(0, cart_id.lastIndexOf(','));
        wx.navigateTo({
          url: '/pages/index/checkOrder/checkOrder?cart_id='+cart_id
        });
      }
    },
})