const app = getApp()
Page({
  data: {
    isInput: false,
    floor: -1,
    inputBoxTxt: "留言",
    postsId: 0,
    posts: {},
    notifyTitle: "",
    notifyDetail: "",
    showLoading: false,
    loadingTxt: "",
    parentId: 0,
    content: "",
    referenceContent: "",
    isReport: false,
    report: "",
  },
  onLoad: function(e) {
    // 页面标题
    wx.setNavigationBarTitle({
      title: e.title
    })
    this.setData({
      postsId: e.id,
      showLoading: true,
      loadingTxt: "玩命加载中"
    })
    this.getPosts()
    this.getPostsComment()
  },

  // 预览头像
  previewAvatar(e) {
    let avatar = [e.currentTarget.dataset.avatar]
    wx.previewImage({
      urls: avatar,
    })
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

  // 获取详情信息
  getPosts: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "posts/" + that.data.postsId,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function(res) {
        if (res.data.code==="0000") {
          that.setData({
            posts: res.data.data
          })
        } else {
          var e = ['提示', res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      },
      complete: function() {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      }
    })
  },
  getPostsComment: function() {
    var that = this
    console.log("xxx",that.data)
    wx.request({
      url: app.globalData.baseUrl + "posts/comment/" + that.data.postsId,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function(res) {
        if (res.data.code==="0000") {
          that.setData({
            postContent: res.data.data
          })
        } else {
          var e = ["提示", res.data.msg]
          that.showNotify(e)
        }
      },
      complete: function() {
        that.setData({
          showLoading: false,
          loadingTxt: ""
        })
      }
    })
  },

  // 预览发布图片
  picPreview: function(e) {
    let pics = []
    pics.push(e.target.dataset.url)
    wx.previewImage({
      urls: pics
    })
  },

  //点击引用评论
  toQuote: function(e) {
    var floorr = e.currentTarget.dataset.floor
    var parentId = e.currentTarget.dataset.id
    this.setData({
      isInput: true,
      inputBoxTxt: "正在引用 "+(floorr+1)+" 楼的评论",
      floor: floorr,
      parentId: parentId,
      content: ""
    })
    wx.pageScrollTo({
      selector: "#inputBox",
      duration: 300
    })
  },

  cancelQuote: function() {
    this.setData({
      isInput: false,
      inputBoxTxt: "点击发表留言(字数在200字以内)",
      parentId: 0,
      content: "",
      floor: -1
    })
  },

  getInput: function(e) {
    console.log("2e",e)
    var inputid = e.currentTarget.dataset.inputid
    this.setData({
      [inputid]: e.detail.value
    })
  },

  // 点击评论发布评论
  toComment: function() {
    var content = this.data.content
    if (content==="" || content.replace(/\s+/g, '').length===0) {
      var e = ["提示", "评论内容是空的~"]
      this.showNotify(e)
      return
    }
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "posts/comment",
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        content: that.data.content,
        parentId: that.data.parentId,
        postsId: that.data.postsId,
      },
      success: function(res) {
        if (res.data.code==="0000") {
          that.setData({
            postContent: res.data.data,
            content: ""
          })
          var e = ["评论成功", '去评论区看看吧~']
          that.showNotify(e)
        } else {
          var e = ["提示", res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareImageTap: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage: function() {
    return {
      title: '帖子分享',
      path: '/pages/bbs/passage/passage',
      imageUrl: this.data.postContent.image
    }
  }
})