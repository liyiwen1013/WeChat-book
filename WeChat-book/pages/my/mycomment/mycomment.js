const app = getApp()
Page({
  data: {
    imgUrl:  app.globalData.imgUrl,
    mycomment: [],
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    isNormal: false
  },
  onShow: function() {
    this.setData({
      isNormal: wx.getStorageSync('isNormal')
    })
  },
  onLoad: function (options) {
    this.getMyComments()
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

  getMyComments() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "posts/comment/my",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success(res) {
        console.log(".,.,.,",res.data)
        if (res.data.code==="0000") {
          that.setData({
            mycomment: res.data.data
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

  toComment(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../bbs/passage/passage?id=' + e.currentTarget.dataset.postId
    })
  }
})