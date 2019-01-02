// pages/index/makeInquriy/makeInquriy.js
const App = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //   品质范围
        qualityList: [], //品质
        adapter: "", //适用机型
        parts: [], //配件
        photoList: [], //临时照片路径
        // selquality: [],
        quality: "", //选中后的品质
        original: [], //上传后的返回的图片路径
        isComplete: false, //图片是否上传完毕
        updataImg: [], //询价失败、已过期、已退回的图片上传
        new_upload:[],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = App.globalData.activeId;
        var status_name = App.globalData.status_name;
        console.log(status_name);
        var title = status_name == "已退回" ? "编辑询价" : "发布询价";
        wx.setNavigationBarTitle({
            title: title,
        })
        this.setData({
            id,
            status_name,
        });
        if (id == "") {
            this.getQualityList();
        } else {
            this.update_inquiry(id)
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // wx.hideTabBar({
        //     animation: true,
        // });
    },

    /**
     * 生命周期函数--监听页面隐藏
    //  */
    onUnload: function () {
        // console.log("监听页面隐藏3");     
        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            flag: true, //初始化
        });
        // 清除编辑所需的id
        App.globalData.activeId = "",
        App.globalData.status_name = "",

        console.log("销毁了");
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    checkboxChange: function (e) {

        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        // this.selquality = e.detail.value;
        this.setData({
            quality: e.detail.value.join(","),
        });
    },
    // 删除配件列表
    delItem(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.showModal({
            title: '确定删除配件？',
            content: "",
            confirmColor: "#f05b29",
            success: function (res) {
                if (res.confirm) {
                    that.data.parts.splice(index, 1);
                    that.setData({
                        parts: that.data.parts
                    });
                }
            }
        })

    },
    // 适用机型
    searchType() {
        console.log(111);
        var partName = this.data.adapter;
        wx.navigateTo({
            url: `/pages/index/makeInquriy/searchType/searchType?title=适用机型&partName=${partName}`,

        })
    },
    // 编辑配件名称
    editPartName(e){
        var index = e.currentTarget.dataset.index;
        console.log(index);
        var partName = e.currentTarget.dataset.partname;
        wx.navigateTo({
            url: `/pages/index/makeInquriy/searchType/searchType?title=配件名称&partName=${partName}&index=${index}&isEdit=1`,
        })
    },
    //配件名称
    goName() {
        wx.navigateTo({
            url: '/pages/index/makeInquriy/searchType/searchType?title=配件名称',

        })
    },
    // 发布求购-添加询价单
    getInquiry() {

    },
    // inquiry/get_quality_list
    // 品质范围
    getQualityList() {
        let self = this;
        let data = {
            token_id: App.globalData.meData.token_id,
        }
        App.request(
            "inquiry/get_quality_list",
            "POST",
            data,
            function (res) {
                var default_quality = [];//默认的被选中的品质范围id
                if (res.data.status == 1) {
                    res.data.data.forEach((i)=>{
                        i.selected = "1";
                        default_quality.push(i.id);
                    });
                    // console.log(default_quality.join(',') );
                    var quality = default_quality.join(',')
                    self.setData({
                        // quality: res.data.data
                        qualityList:res.data.data,
                        quality,
                    });
                    console.log(self.data.qualityList);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none"
                    })
                }
            }
        );
    },
    // 添加备注、修改备注
    setRemarts(e) {
        console.log(e.detail.value)
        let self = this;
        let remarks = e.detail.value; //备注
        let index = e.currentTarget.dataset.index;
        this.data.parts[index].remarks = remarks;
        this.setData({
            parts: self.data.parts
        });

    },
    // 修改询价单的数量
    editNum(e) {
        let self = this;
        let num = e.detail.value; //备注
        let index = e.currentTarget.dataset.index;
        this.data.parts[index].num = num;
        this.setData({
            parts: self.data.parts
        });
    },
    // 删除照片
    del: function (e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        this.data.photoList.splice(index, 1);
        this.data.oldImg.splice(index,1);//如果是已退回，并删除之前的图片在上传新的图片后，需要将就图片删除，在提交
        this.setData({
            photoList: self.data.photoList,
            oldImg: self.data.oldImg,
        })
        console.log(self.data.oldImg);
        
    },
    // 添加照片
    add: function () {
        var self = this;
        wx.chooseImage({
            count: 9 - self.data.photoList.length, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],
            success: function (res) {
                // console.log(res.tempFilePaths);
                let photoList = self.data.photoList;
                photoList = photoList.concat(res.tempFilePaths);
                // 编辑询价单（询价失败、已过期、已退回、），所需上传的新图片。
                var updataImg = self.data.updataImg;
                updataImg = updataImg.concat(res.tempFilePaths);
                // 编辑询价单（询价失败、已过期、已退回、），所需上传的新图片。
                // console.log(updataImg);
                self.setData({
                    photoList,
                    updataImg
                });
                // console.log(self.data.updataImg);
            }
        })
    },
    // 发布询价
    submitInfo() {
        if (this.data.adapter == "") {
            this.showModal("适用机型不能为空");
            return;
        } else if (this.data.parts.length == 0) {
            this.showModal("配件不能为空");
            return;
        } else if (this.data.quality == "") {
            this.showModal("品质范围不能为空");
            return;
        } 
        // else if (this.data.photoList.length == 0) {
        //     this.showModal("图片不能为空");
        //     return;
        // }
        this.uploadImg();
    },
    // 图片上传
    uploadImg(i) {
        //    debugger;
        var that = this;
        var i = i || 0;
        var imgUrl;
        //    有id则代表不是新发布的询价单，即之前有添加过图片。
        if (this.data.id != "") {
            //    如果没有新添加图片的话，则用原来的服务器保存的图片路径传。oldImg代表旧的已上传的图片文件名

            /**
             * 没有上传新图片
             */
            if (this.data.updataImg.length == 0) {
                // this.setData({
                //     original: that.data.oldImg
                // });
                if (this.data.status_name == "已退回"){
                    this.save_inquiry();
                }else{
                    this.makeInquriy();                    
                }
                return;
            }
            /**
             * 上传新的图片，并上传至最后一张的时候
             */
            if (i == this.data.updataImg.length) {
                // console.log(this.data.new_upload);
                // console.log(this.data.oldImg);
                //    上传结束
                if (this.data.status_name == "已退回") {
                    this.save_inquiry();
                } else {
                    this.makeInquriy();
                }
                return;
            }
            // console.log(this.data.updataImg);
            imgUrl = this.data.updataImg[i];
            // console.log(imgUrl);
        } else {
            imgUrl = this.data.photoList[i];
            if (i == this.data.photoList.length) {
                if (this.data.status_name == "已退回") {
                    this.save_inquiry();
                } else {
                    this.makeInquriy();
                }
                return;
            }
        }

        wx.uploadFile({
            url: 'https://zw.palmar.cn/api/api/inquiry/upload_img', //仅为示例，非真实的接口地址
            filePath: imgUrl,
            name: 'img',
            formData: {
                'token_id': App.globalData.meData.token_id,
            },
            success(res) {
                ++i;
                if (that.data.status_name == "已退回"){
                    that.data.new_upload.push(JSON.parse(res.data).data[0].img);
                }else{
                    that.data.original.push(JSON.parse(res.data).data[0].img);
                }
               
                that.uploadImg(i);
            }
        })
    },
    //    发布询价单
    makeInquriy() {
        wx.showLoading({
            title: '数据提交中',
            mask: true,
        })
        let token_id = App.globalData.meData.token_id;
        let quality = this.data.quality;
        let adapter = this.data.adapter;
        let parts = JSON.stringify(this.data.parts);
        let original = JSON.stringify(this.data.original);
        let data = {
            token_id,
            quality,
            adapter,
            parts,
            original,
            img: "[]"
        }
        App.request(
            "inquiry/add_inquiry",
            "POST",
            data,
            function (res) {
                if (res.data.status == 1) {
                    wx.hideLoading()
                    wx.redirectTo({
                        url: `/pages/index/inqueryRoom/inqueryOrderDetail/inqueryOrderDetail?id=${res.data.data.id}`,
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none"
                    })
                }
            }
        );
    },
    // 模态框
    showModal(msg) {
        wx.showModal({
            title: '请填写完整信息',
            content: msg,
            confirmColor: "#f05b29",
            showCancel: false,
            success: function (res) {
                if (res.confirm) {

                }
            }
        })
    },
    // 已过期、询价失败=》更新询价单（本质是重新添加询价单）
    update_inquiry(id) {
        var that = this;
        var token_id = App.globalData.meData.token_id;
        var id = id;
        var data = {
            token_id,
            id,
        }
        App.request(
            "inquiry/update_inquiry",
            "POST",
            data,
            function (res) {
                if (res.data.status == 1) {
                    var intact_img = res.data.data.original_img.map((i) => {
                        return i.intact_img
                    });
                    var img = res.data.data.original_img.map((i) => {
                        return i.img
                    });
                    that.setData({
                        adapter: res.data.data.adapter,
                        parts: res.data.data.parts,
                        qualityList: res.data.data.quality_list,
                        quality: res.data.data.quality,
                        photoList: intact_img,
                        original: img,
                        oldImg: img,//给已退回状态进来的保存询价单用的
                    });
                    console.log(that.data.oldImg);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none"
                    })
                }
            }
        );
    },
    /**
     * 保存询价单
     * inquiry/save_inquiry
     * 重已退回的状态-重新编辑询价单（是在原有的基础上修改询价单，并非重新添加询价单）
     */
    save_inquiry(){
        wx.showLoading({
            title: '数据提交中',
            mask: true,
        })
        let token_id = App.globalData.meData.token_id;
        let id = this.data.id;
        let quality = this.data.quality;
        let adapter = this.data.adapter;
        let parts = JSON.stringify(this.data.parts);
        let original = JSON.stringify(this.data.new_upload);
        let http_img_url = JSON.stringify(this.data.oldImg)//旧件图片，original_img.img的值
        let data = {
            token_id,
            id,
            quality,
            adapter,
            parts,
            original,
            http_img_url,
            img: "[]"
        }
        App.request(
            "inquiry/save_inquiry",
            "POST",
            data,
            function (res) {
                if (res.data.status == 1) {
                    wx.hideLoading();
                    wx.redirectTo({
                        url: `/pages/index/inqueryRoom/inqueryOrderDetail/inqueryOrderDetail?id=${res.data.data.id}`,
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none"
                    })
                }
            }
        );
    }


});