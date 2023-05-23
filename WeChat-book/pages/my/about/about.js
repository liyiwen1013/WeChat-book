const app = getApp()
Page({
  data: {
    baseUrl: ''
  },
  onShow: function() {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  }
})