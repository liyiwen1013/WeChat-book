const app = getApp()
Page({
  data: {
    mycollect: [],
    showNotify: false,
    notifyTitle: "",
    notifyDetail: ""
  },
  onLoad: function (options) {
    this.getMyCollects()
  },
  onShow: function (options) {
    this.getMyCollects()
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

  getMyCollects() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "book/collect/list",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success(res) {
        if (res.data.code==="0000") {
          console.log("dha c",res.data)
          that.setData({
            mycollect: res.data.data
          })
        } else {
          let e = ['获取失败', res.data.msg]
          that.showNotify(e)
        }
      },
      error() {
        let e = ['出错', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },

  toCollect(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/book/book-detail/book-detail?id=' + e.currentTarget.dataset.bookId,
    })
  }
})