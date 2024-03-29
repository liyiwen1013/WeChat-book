const app = getApp()
Page({
  data: {
    hasGetCode: false,
    codeText: "获取验证码",
    restTime: 60,
    password: "",
    ensurepassword: "",
    email: "",
    authcode: "",
    isInfoConfirmed: false,
    showNotify: false,
    showLoading: false,
    loadingTxt: ""
  },

  // 显示一个没有关闭按钮的通知窗口，并会自动消失
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

  getInput: function(e) {
    var inputid = e.currentTarget.dataset.inputid
    this.setData({
      [inputid]: e.detail.value
    })
  },

  toGetAuthCode: function() {
    var password = this.data.password;
    var ensurepassword = this.data.ensurepassword;
    var email = this.data.email;
    if (password==="" || ensurepassword==="" || email==="") {
      var e = ['提示','密码或确认密码或邮箱空空如也']
      this.showNotify(e)
      return;
    }
    if (password!==ensurepassword) {
      var e = ['提示','密码前后不一致']
      this.showNotify(e)
      return;
    }
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email))) {
      var e = ['提示','邮箱格式有误']
      this.showNotify(e)
      return;
    }
    if (!(/^\w+$/).test(password)) {
      var e = ['提示','密码中含有非法字符']
      this.showNotify(e)
      return;
    }
    // 一旦成功发送邮件信息，输入框将不可再输入,并显示加载图标
    this.setData({
      isInfoConfirmed: true,
      showLoading: true,
      loadingTxt: "获取验证码"
    })
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "auth/code/forget/send/" + email,
      method: "GET",
      success: function(res) {
        if (res.data.code==="0000") {
          that.setData({
            isInfoConfirmed: true,
            hasGetCode: true,
          })
          var e = ['提示','验证码已发送到邮箱中，请前往查看']
          that.showNotify(e)
          // 保存当前session，用于验证码的验证
          app.globalData.SESSIONID = res.data.data.SESSIONID;
          that.data.setInter = setInterval(function() {
            if (that.data.restTime>0) {
              that.setData({
                restTime: that.data.restTime-1,
                codeText: that.data.restTime-1 + " s后重发",
                isInfoConfirmed: true
              })
            } else {
              clearInterval(that.data.setInter)
              that.setData({
                isInfoConfirmed: false,
                codeText: "获取验证码",
                restTime: 60
              })
            }
          }, 1000)
        } else {
          that.setData({
            isInfoConfirmed: false,
          })
          var e = ['提示',res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        that.setData({
          isInfoConfirmed: false,
        })
        var e = ['提示','出了点儿错，稍后再试吧']
        that.showNotify(e)
      },
      complete: function() {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      },
      fail: () => {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      }
    })
    
  },

  // 找回密码
  toFindPwdBack: function() {
    if (!this.data.hasGetCode) {
      var e = ['提示','请先获取验证码']
      this.showNotify(e)
      return
    }
    if (!this.data.authcode) {
      var e = ['提示','请先前往邮箱查看验证码并填写']
      this.showNotify(e)
      return
    }
    var password = this.data.password;
    var email = this.data.email;
    var authcode = this.data.authcode
    this.setData({
      showLoading: true,
      loadingTxt: "修改密码中"
    })
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "auth/password",
      method: "PUT",
      data: {
        password: password,
        email: email,
        emailVerifyCode: authcode,
      },
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        if (res.data.code==="0000") {
          var e = ['提示','密码修改成功，3s后跳转到登陆页面']
          that.showNotify(e)
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 3000)
        } else {
          var e = ['提示',res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ['提示','出了点儿错，稍后再试吧']
        that.showNotify(e)
      },
      complete: function() {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      },
      fail: () => {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      }
    })
  },
})