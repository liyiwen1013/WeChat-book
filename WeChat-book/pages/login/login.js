// pages/login/login.js
const app = getApp()
Page({
  data: {
    imgUrl:  app.globalData.imgUrl,
    name: "",
    password: "",
    showNotify: false,
    isLoading: false,
    isNormal: false,
    userInfo: ''
  },
  onShow: function() {
    this.setData({
      isNormal: wx.getStorageSync('isNormal')
    })
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

  onLoad: function(e) {
    // 如果之前登陆过，自动登录
    if (app.globalData.name) {
      this.autoLogin()
      // this.wxLogin()
    }
    if (app.globalData.isLogin) {
      wx.switchTab({
        url: '/pages/square/square',
      })
    }
  },

  // 用户名密码
  getInput: function(e) {
    var inputid = e.currentTarget.dataset.inputid
    this.setData({
      [inputid]: e.detail.value
    })
  },

  autoLogin() {
    this.setData({
      isLoading: true
    })
    let type = 0
    let name = app.globalData.name
    let password = app.globalData.password
    /**判断用户名是邮箱还是昵称 */
    if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(name)) {
      type = 1;
    }
    /* 发起请求验证密码 */
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "checkLogin",
      data: {
        type: type,
        name: name,
        password: password
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code===0) {
          wx.setStorageSync('name', name)
          wx.setStorageSync('password', password)
          app.globalData.SESSIONID = res.data.data.SESSIONID
          app.globalData.isLogin = true
          wx.switchTab({
            url: '../square/square',
          })
        } else {
          wx.removeStorageSync('name');
          wx.removeStorageSync('password');
          var e = ["登陆失败", res.data.message]
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

  checkLogin: function () {
    var that = this
    var name = this.data.name;
    var password = this.data.password;
    var type = 0; //0代表默认的通过用户昵称进行验证，1代表通过邮箱进行验证
    /* 登陆前验证 */
    if (name==="" || password==="") {
      var e = ["提示", "用户名或密码空空如也"]
      this.showNotify(e)
      return
    }
    /* 展示加载动画 */
    this.setData({
      isLoading: true
    })
    /**判断用户名是邮箱还是昵称 */
    if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(name)) {
      type = 1;
    }
    /* 发起请求验证密码 */
    wx.request({
      url: app.globalData.baseUrl + "checkLogin",
      // url: 'http://localhost:8080/checkLogin',
      data: {
        type: type,
        name: name,
        password: password
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code===0) {
          wx.setStorageSync('name', name)
          wx.setStorageSync('password', password)
          app.globalData.SESSIONID = res.data.data.SESSIONID
          app.globalData.isLogin = true
          wx.switchTab({
            url: '../square/square',
          })
        } else {
          var e = ["登陆失败", res.data.message]
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

  register: function() {
    wx.navigateTo({
      url: 'register/register',
    })
  },

  forgetpwd: function () {
    wx.navigateTo({
      url: 'forgetpwd/forgetpwd',
    })
  },
  // 获取用户信息按钮的回调函数
  getUserInfo: function(e) {
    var that = this;
    // 如果用户拒绝授权，则给出提示
    if (!e.detail.userInfo) {
      console.log("用户拒绝授权");
      return;
    }
    // 用户授权，发送请求到后端
    wx.login({
      success: function(res) {
        // 发送 res.code 到后端换取Openid、Session Key、Unionid等
        console.log(e)
        wx.request({
          url: "http://127.0.0.1:8080/auth/login",
          method: "POST",
          data: {
            code: res.code,
            nickname: e.detail.userInfo.nickName,
            avatar: e.detail.userInfo.avatarUrl,
          },
          success: function(res) {
            console.log(res.data);
            if(res.code === "00000") {
              // 将获取到的用户信息保存到全局变量中，方便其他页面使用
              getApp().globalData.userInfo = res.data.userInfo;
              // 跳转到首页
              wx.switchTab({
                url: "/pages/square/"
              })
            }
          }
        })
      }
    })
  }
})