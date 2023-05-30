const app = getApp()
Page({
  data: {
    mycomment: [],
    showNotify: false,
    notifyTitle: "",
    notifyDetail: ""
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
  },
  deleteComment(e) {
    console.log(e)
    let delid = e.currentTarget.dataset.id
    this.setData({
      showDel: true,
      delid: delid,
    })
  },

  toDeleteComment() {
    this.setData({
      showLoading: true,
      loadingTxt: "删除中"
    })
    let that = this
    console.log(this.data)
    let delid = this.data.delid
    let mycomment = this.data.mycomment
    wx.request({
      url: app.globalData.baseUrl + "posts/comment",
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
          const updatedMyposts = mycomment.filter(item => item.id !== delid)
          that.setData({
            mycomment: updatedMyposts
          })
          let e = ['删除成功', '评论内容已成功删除啦']
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