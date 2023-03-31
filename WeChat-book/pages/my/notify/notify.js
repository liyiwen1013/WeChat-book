const app = getApp()
Page({
  data: {
    notify: [],
    showLoading: false,
    showNotify: false,
    showDel: false,
    delid: "",
    notifyTitle: "",
    notifyDetail: "",
    loadingTxt: "",
  },
  onLoad: function () {
    this.getAllNotify()
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
  
  getAllNotify: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "notify",
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success(res) {
        if (res.data.code==="0000") {
          that.setData({
            notify: res.data.data,
          })
        } else {
          var e = ['提示', res.data.msg]
          that.showNotify(e)
        }
      },
      error() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },
  toNotify: function(e) {
    if (e.currentTarget.dataset.isRead == false) {
      let that = this
      wx.request({
        url: app.globalData.baseUrl + "notify",
        method: "PUT",
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + app.globalData.token
        },
        data: {
          id: e.currentTarget.dataset.id
        },
        success(res) {
          if (res.data.code==="0000") {
            let index = e.currentTarget.dataset.index
            that.setData({
              ['notify['+index+'].isRead']: true
            })
          }
        }
      })
    }
  },
  deleteNotify(e) {
    let id = e.currentTarget.dataset.id
    let delIndex = e.currentTarget.dataset.index
    this.setData({
      showDel: true,
      delid: id,
      delIndex: delIndex
    })
  },

  toDeleteNotify() {
    this.setData({
      showLoading: true,
      loadingTxt: "删除中"
    })
    let notify = this.data.notify
    let delid = this.data.delid
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "notify",
      method: "DELETE",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        id: delid
      },
      success(res) {
        if (res.data.code==="0000") {
          const updatedNotify = notify.filter(item => item.id !== delid)
          that.setData({
            notify: updatedNotify
          })
          let e = ['删除成功', '消息已成功删除啦']
          that.showNotify(e)
        } else {
          let e = ['提示', res.data.msg]
          that.showNotify(e)
        }
      },
      error() {
        let e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      },
      complete() {
        that.setData({
          showDel: false,
          showLoading: false
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

  closeWindow() {
    this.setData({
      showDel: false
    })
  }
})