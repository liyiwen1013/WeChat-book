const app = getApp();
Page({
  data: {
    isNormal: false,
    postType: 1,
    isAnonymous: false,
    isMoreInfo: false,
    customBg: ['DA4453','E9573F','8CC152','39b54a','48CFAD','37BCC9','4FC1E9','3BAFDA','4A89DC','0081ff','967ADC','6739b6','D770AD','9c26b0','a5673f','8799a3','656D78','434A54'],
    title: "",
    content: "",
    placeHolders: ["今日趣事", "优质资源"],
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    showLoading: false,
    defaultbg: ['https://p.qqan.com/up/2016-7/2016071115340721509.gif', 'https://www.gif.cn/Upload/newsucai/2021-06-02/162262263362400.gif', 'https://cdn.pixabay.com/photo/2023/03/20/12/30/tulips-7864592__340.jpg'],
    bgType: 3,
    bgContent: "74c7f2"
  },
  onShow: function() {
    this.setData({
      isNormal: wx.getStorageSync('isNormal')
    })
  },

  // 显示一个提示消息，没有关闭按钮，一定时间后自动消失，使用时直接调用并传递一个数组
  showNotify: function(e) {
    this.setData({
      showNotify: true,
      notifyTitle: e[0],
      notifyDetail: e[1]
    })
    var that = this
    setTimeout(function() {
      that.setData({
        showNotify: false
      })
    }, 2000)
  },

  // 匿名了解更多
  showAnonymousInfo: function() {
    this.setData({
      isMoreInfo: true
    })
  },

  onLoad: function(e) {
    this.setData({
      postType: e.postType
    })
  },

  // 关闭了解更多
  closeSelect: function() {
    this.setData({
      isMoreInfo: false
    })
  },

  // 匿名发布
  changeCheckboxStatus: function(e) {
    this.setData({
      isAnonymous: this.data.isAnonymous?false:true
    })
  },

  // 选择上传图片
  selectPic: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      camera: ['front', 'back'],
      success: function (res) {
        let picsize = res.tempFiles[0].size;
        let path = res.tempFiles[0].path
        let formatImage = path.split(".")[(path.split(".")).length - 1];
        if (formatImage!="png"&&formatImage!="jpg"&&formatImage!="jpeg"&&formatImage!="gif") {
          let e = ['提示', '仅支持png, jpg, jpeg, gif格式图片']
          self.showNotify(e)
          return
        }
        if (picsize > 3000000) {
          let e = ['提示', '图片大小限制在3M以内']
          self.showNotify(e)
          return
        }
        self.setData({
          bgContent: res.tempFilePaths[0],
          bgType: 1
        })
      }
    })
  },

  previewPic: function() {
    var tmp = []
    tmp.push(this.data.bgContent)
    wx.previewImage({
      urls: tmp,
    })
  },

  deletePic: function() {
    this.setData({
      bgContent: []
    })
  },

  // 标题输入
  getInput: function(e) {
    var inputid = e.currentTarget.dataset.inputid
    this.setData({
      [inputid]: e.detail.value,
    })
  },
  
  // 选择默认图片
  pickDefaultBg(e) {
    // this.deletePic()
    let bgindex = e.currentTarget.dataset.bgindex
    this.setData({
      bgType: 2,
      bgContent: this.data.defaultbg[bgindex]
    })
  },

  // 纯色
  pickCurrentColor: function(e) {
    this.deletePic()
    this.setData({
      bgType: 3,
      bgContent: e.currentTarget.dataset.custombg
    })
  },

  // 新建帖子
  addPost: function() {
    this.setData({
      showLoading: true
    })
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'posts',
      data: {
        type: that.data.postType,
        title: that.data.title,
        content: that.data.content,
        isAnonymous: that.data.isAnonymous,
        bgType: that.data.bgType,
        bgContent: that.data.bgContent
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function(res) {
        if (res.data.code==="0000") {
          var e = ["发布成功", "发布成功，即将跳转到首页"]
          that.showNotify(e)
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/bbs/bbs',
            })
          }, 2000)
        } else {
          var e = ["提示", res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ["提示", "出了点儿错，稍后再试吧"]
        that.showNotify(e)
      },
      complete: function() {
        that.setData({
          showLoading: false
        })
      },
      fail: () => {
        that.setData({
          showLoading: false
        })
      }
    })
  },

  // 发布
  toPost: function() {
    var that = this
    let title = this.data.title
    let content = this.data.content
    let bgType = this.data.bgType
    if (title.trim().length===0 || content.trim().length===0) {
      var e = ["提示","标题或正文不能为空~"]
      this.showNotify(e)
      return
    }
    if (title.length > 30 || content.length > 500) {
      var e = ["提示","标题或正文字数超过限制"]
      this.showNotify(e)
      return
    }
    if (bgType == 1) {
      // 用户自定义的图片，需要上传到服务器
      wx.uploadFile({
        filePath: this.data.bgContent,
        url: app.globalData.baseUrl + 'file/upload',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + app.globalData.token
        },
        method: "POST",
        name: 'file',
        formData: {},
        success: function(res) {
          that.setData({
            bgContent: res.data.data
          })
        },
        fail: function (res) {
          // 上传失败后返回的数据
          console.log(res.errMsg);
          var e = ["提示","图片上传失败~"]
          this.showNotify(e)
          return
        }
      })
    }
    this.addPost()
  },

  closeResultMsg: function() {
    this.setData({
      isResultMsg: false
    })
  }
})