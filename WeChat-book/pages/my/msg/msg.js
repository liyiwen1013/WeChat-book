const app = getApp()
Page({
  data: {
    message: [],
    showLoading: false,
    showNotify: false,
    showDel: false,
    delid: "",
    notifyTitle: "",
    notifyDetail: "",
    loadingTxt: "",
  },
  onLoad: function (options) {
    this.getAllMessage()
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

  getAllMessage() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "message",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success(res) {
        if (res.data.code==="0000") {
          that.setData({
            message: res.data.data,
          })
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

  toMessage(e) {
    if (e.currentTarget.dataset.isRead == false) {
      let that = this
      wx.request({
        url: app.globalData.baseUrl + "message",
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
              ['message['+index+'].isRead']: true
            })
          }
        }
      })
    } 
    wx.navigateTo({
      url: '../../bbs/passage/passage?id='+ e.currentTarget.dataset.postsId
    })
  },

  deleteMessage(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      showDel: true,
      delid: id,
    })
  },

  toDeleteMessage() {
    this.setData({
      showLoading: true,
      loadingTxt: "删除中"
    })
    console.log(this.data)
    let message = this.data.message
    let delid = this.data.delid
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "message",
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
          const updatedMessages = message.filter(item => item.id !== delid)
          that.setData({
            message: updatedMessages
          })
          let e = ['提示', '消息已成功删除啦']
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