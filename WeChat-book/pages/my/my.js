const app = getApp();
Page({
  data: {
    isMark: "",
    isLogin: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    basicInfo: {"mark":"NONE"},
    showAuth: false,
    showFeedback: false,
    feedback: "",
    showLoading: false,
    loadingTxt: "",
    showModifyName: false,
    newname: "",
    showClear: false,
    isNormal: false
  },
  
  onShow: function() {
    this.setData({
      isLogin: app.globalData.isLogin,
      isNormal: wx.getStorageSync('isNormal')
    })
    if (app.globalData.isLogin) {
      this.setData({
        showLoading: true,
        loadingTxt: "获取资料..."
      })
      this.getBasicInfo()
    }
  },

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

  showAuthentication() {
    this.setData({
      showAuth: true
    })
  },
  // 关闭弹窗
  closeWindow(e) {
    var windowid = e.currentTarget.dataset.windowid
    this.setData({
      [windowid]: false,
    })
    if (windowid==="showFeedback") {
      this.setData({
        feedback: ""
      })
    }
    if (windowid==="showModifyName") {
      this.setData({
        newname: ""
      })
    }
  },
  // 获取用户信息
  getBasicInfo: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "user/info",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      method: "GET",
      success(res) {
        if (res.data.code==="0000") {
          that.setData({
            basicInfo: res.data.data,
            showLoading: false,
            loadingTxt: ""
          })
        } else {
          var e = ['个人资料获取失败', res.data.msg]
          that.showNotify(e)
        }
      },
      error() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },

  toLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 点击头像
  previewImg: function(e) {
    let avatarurl = e.currentTarget.dataset.avatarurl
    wx.previewImage({
      urls: [avatarurl],
    })
  },

  // 关于界面跳转
  toNext: function(e) {
    let id = e.currentTarget.dataset.id
    if (id!=="about" && id!=="instruc") {
      if (!this.data.isLogin) {
        var e = ['提示', '请先登录']
        this.showNotify(e)
        return
      }
    }
    wx.navigateTo({
      url: id + '/' + id,
    })
  },

  // 用户反馈
  toFeedBack: function() {
    this.setData({
      showFeedback: true
    })
  },
  getInput(e) {
    this.setData({
      newname: e.detail.value
    })
  },
  goFeedback: function() {
    if (this.data.feedback==="" || this.data.feedback.replace(/\s+/g, '').length===0) {
      var e = ['提示', '总得写点儿什么吧']
      this.showNotify(e)
      return
    }
    this.setData({
      showLoading: true,
      loadingTxt: "反馈中..."
    })
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "addFeedback",
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      data: {
        detail: that.data.feedback
      },
      success(res) {
        if (res.data.code===0) {
          var e = ['反馈成功', '你的建议我已经收到啦，我会认真阅读并尽快回复你哒']
          that.showNotify(e)
          that.setData({
            showFeedback: false
          })
        } else {
          var e = ['反馈失败', res.data.msg]
          that.showNotify(e)
        }
      },
      error() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      },
      complete() {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      }
    })
  },

  // 长按头像
  changeAvatar() {
    if (!app.globalData.isLogin) {
      let e = ['提示', '请先登录']
      this.showNotify(e)
      return
    }
    let that = this
    wx.chooseMedia ({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        let picsize = res.tempFiles[0].size;
        let path = res.tempFiles[0].tempFilePath;
        console.log(res)
        let formatImage = path.split(".")[(path.split(".")).length - 1];
        if (formatImage!="png"&&formatImage!="jpg"&&formatImage!="jpeg"&&formatImage!="gif") {
          let e = ['提示', '仅支持png, jpg, jpeg, gif格式图片']
          self.showNotify(e)
          return
        }
        if (picsize > 1000000) {
          let e = ['提示', '图片大小限制在1M以内']
          self.showNotify(e)
          return
        }
        that.setData({
          showLoading: true,
          loadingTxt: "光速修改中..."
        })
        that.toChangeAvatar(res.tempFiles[0])
      }
    })
  },

  // 修改头像
  toChangeAvatar(e) {
    let that = this
    wx.uploadFile({
      filePath: e.tempFilePath,
      url: app.globalData.baseUrl + "file/upload",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      name: 'file',
      success: function(res) {
        console.log(res)
        res = JSON.parse(res.data)
          that.setData({
            'basicInfo.avatar': res.data
          })
          wx.request({
            url: app.globalData.baseUrl + "user/avatar",
            method: "PUT",
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + app.globalData.token
            },
            data: {
              avatar: res.data
            },
            success(res) {
              if (res.data.code == "0000") {
                let e = ['提示', '头像更新成功']
                that.showNotify(e)
              } else {
                let e = ['提示', res.data.msg]
                that.showNotify(e)
              }
            },
            error() {
              let e = ['提示', '出了点儿错，稍后再试吧']
              that.showNotify(e)
            }
          })
      },
      error() {
        let e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },

  // 点击用户名
  changeName() {
    this.setData({
      showModifyName: true
    })
  },
  // 修改用户名
  goModifyName() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "user/username",
      method: "PUT",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        username: that.data.newname
      },
      success(res) {
        if (res.data.code==="0000") {
          that.setData({
            'basicInfo.username': that.data.newname,
            'showModifyName': false
          })
          let e = ['提示', '用户名修改成功']
          that.showNotify(e)
        } else {
          let e = ['提示', res.data.msg]
          that.showNotify(e)
        }
      },
      error() {
        let e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },

  // 清除缓存
  clearCache() {
    this.setData({
      showClear: true
    })
  },
  toClearCache() {
    let that = this
    success
    wx.setStorageSync('token', '')
    // wx.clearStorage({
    //   success: (res) => {
    //     that.setData({
    //       showClear: false,
    //       basicInfo: ''
    //     })
    //     wx.showToast({
    //       title: '操作成功!',
    //     })
    //   },
    // })
  }
})