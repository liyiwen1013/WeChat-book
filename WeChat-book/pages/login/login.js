// pages/login/login.js
const app = getApp()
Page({
  data: {
    name: "",
    password: "",
    showNotify: false,
    isLoading: false,
    userInfo: '',
    showWeChatLogin: false, // 是否显示微信登录授权对话框
  },

  // 显示一个没有关闭按钮并会自动消失的通知窗口
  // 在使用时应提供一个数组，该数组包括通知标题和通知详情
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

  // 输入用户名密码
  getInput: function(e) {
    var inputid = e.currentTarget.dataset.inputid
    this.setData({
      [inputid]: e.detail.value
    })
  },

  // 账号/邮箱登录
  checkLogin: function () {
    var that = this
    var name = this.data.name;
    var password = this.data.password;
    /* 登陆前验证 */
    if (name==="" || password==="") {
      var e = ["提示", "用户名或密码空空如也"]
      this.showNotify(e)
      return
    }
    /* 展示加载动画 */
    wx.showLoading({
      title: '账号登录中',
      mask: true
    })
    /* 发起请求验证密码 */
    wx.request({
      url: app.globalData.baseUrl + "auth/account/login",
      data: {
        username: name,
        password: password
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code==="0000") {
          wx.setStorageSync('username', res.data.data.username)
          wx.setStorageSync('avatar', res.data.data.avatar)
          app.globalData.token = res.data.data.accessToken
          app.globalData.isLogin = true
          wx.navigateBack()
        } else {
          var e = ["登陆失败", res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ["提示", "出了点儿错，稍后再试吧"]
        that.showNotify(e)
      },
      complete: function() {
        that.setData({
          isLoading: false
        })
      },
      fail: () => {
        that.setData({
          isLoading: false
        })
      }
    })
  },
  // 注册
  register: function() {
    wx.navigateTo({
      url: 'register/register',
    })
  },
  // 找回密码
  forgetpwd: function () {
    wx.navigateTo({
      url: 'forgetpwd/forgetpwd',
    })
  },

  onTapLogin: function() {
    this.setData({ showWeChatLogin: true });
  },
  onCloseAuthDialog: function() {
    this.setData({ showWeChatLogin: false });
  },

  // 微信登陆
  onGetUserInfo: function(e) {
    var that = this;
    /* 展示加载动画 */
    wx.showLoading({
      title: '微信登录中',
      mask: true
    })
    // 如果用户拒绝授权，则给出提示
    if (!e.detail.userInfo) {
      console.log("用户拒绝授权");
      return;
    }
    // 用户授权，发送请求到后端
    wx.login({
      success: function(res) {
        // 发送 res.code 到后端换取Openid、Session Key、Unionid等
        wx.request({
          url: app.globalData.baseUrl + "auth/wx/login",
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            code: res.code,
            nickname: e.detail.userInfo.nickName,
            avatar: e.detail.userInfo.avatarUrl,
          },
          success: function(res) {
            if(res.data.code === "0000") {
              // 将获取到的用户信息保存到全局变量中，方便其他页面使用
              wx.setStorageSync('username', res.data.data.username)
              wx.setStorageSync('avatar', res.data.data.avatar)
              app.globalData.token = res.data.data.accessToken
              app.globalData.isLogin = true
              wx.navigateBack()
            } else {
              var e = ["登陆失败", res.data.msg]
              that.showNotify(e)
            }
          },
          error: function() {
            var e = ["提示", "出了点儿错，稍后再试吧"]
            that.showNotify(e)
          },
          complete: function() {
            that.setData({
              isLoading: false
            })
          },
          fail: () => {
            that.setData({
              isLoading: false
            })
          }
        })
      }
    })
  },
  // 根据响应窗口类型关闭窗口
  closeWindow: function() {
    this.setData({ showWeChatLogin: false });
  },
})