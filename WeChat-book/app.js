// app.js
App({
  onLaunch: function () {
    wx.setStorageSync('isNormal', true)
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
  },
  globalData: {
    token: "",
    baseUrl: "https://momo.linzeliang.cn/",
    name: wx.getStorageSync('name'),
    password: wx.getStorageSync('password'),
    isLogin: false
  },
  /**
   * 封装简单的 loading 框
   */
  showLoading: function (title) {
    wx.showLoading({
      title: title || '加载中',
      mask: true
    })
  },
  /**
   * 隐藏 loading 框
   */
  hideLoading: function () {
    wx.hideLoading()
  }
})
