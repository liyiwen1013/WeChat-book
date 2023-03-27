// app.js
App({
  onLaunch: function () {
    wx.setStorageSync('isNormal', true)
    // this.getDataNormal();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: e => {
        this.globalData.statusBar = e.statusBarHeight; //状态栏高度
        let custom = wx.getMenuButtonBoundingClientRect(); //菜单按钮
        this.globalData.custom = custom;
        this.globalData.customBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.navigateBar = this.globalData.customBar - this.globalData.statusBar;
      },
    })
    // 定时请求，保证session一直存在
    let that = this
    setInterval(function() {
      if (that.globalData.isLogin) {
        wx.request({
          url: that.globalData.baseUrl + "refreshSession",
          header: {
            'Authorization': 'Bearer ' + app.globalData.token
          }
        })
      }
    }, 25 * 60 * 1000)
  },
  // getDataNormal: function() {
  //   wx.request({
  //     url: this.globalData.baseUrl + 'getDataNormal',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success: (res) => {
  //       wx.setStorageSync('isNormal', res.data == 0 ? false : true)
  //     }
  //   })
  // },
  globalData: {
    token: "",
    baseUrl: "http://8.142.189.153:8080/",
    name: wx.getStorageSync('name'),
    password: wx.getStorageSync('password'),
    isLogin: false
  }
})
