const app = getApp()
Page({
  data: {
    picHeight: 0.63*wx.getSystemInfoSync().windowWidth,
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
    isNormal: false,
  },
  onLoad: function(e) {
    // 页面标题
    // wx.setNavigationBarTitle({
    //   title: e.title
    // })
    this.setData({
      postsId: e.id,
      showLoading: true,
      loadingTxt: "玩命加载中"
    })
    this.getPosts()
    this.getPostsComment()
  },

  onShow: function() {
    this.setData({
      isNormal: wx.getStorageSync('isNormal')
    })
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
      url: app.globalData.baseUrl + "posts/" + this.data.postsId,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function(res) {
        console.log(res.data)
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
      url: app.globalData.baseUrl + "posts/comment/" + this.data.postsId,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function(res) {
        console.log("..",res.data)
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
    console.log("e.f",e)
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
      inputBoxTxt: "点击发表回复(字数在200字以内)",
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
    console.log("aaa",this.data)
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
        console.log("111",res.data)
        if (res.data.code==="0000") {
          that.setData({
            postContent: res.data.data,
            content: ""
          })
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

  // 点赞
  toAgree: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'changeAgreeStatus',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'JSESSIONID=' + app.globalData.SESSIONID
      },
      data: {
        postid: that.data.postid
      },
      success: function(res) {
        if (res.data.code===0) {
          that.setData({
            'postMain.agree': res.data.data===0?that.data.postMain.agree-1:that.data.postMain.agree+1,
            'postInfo.agree': res.data.data
          })
        } else {
          var e = ['点赞失败', res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },

  // 收藏
  toCollect: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'changeCollectStatus',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'JSESSIONID=' + app.globalData.SESSIONID
      },
      data: {
        postid: that.data.postid
      },
      success: function(res) {
        if (res.data.code===0) {
          that.setData({
            'postMain.collect': res.data.data===0?that.data.postMain.collect-1:that.data.postMain.collect+1,
            'postInfo.collect': res.data.data
          })
        } else {
          var e = ['收藏失败', res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        var e = ['提示', '出了点儿错，稍后再试吧']
        that.showNotify(e)
      }
    })
  },

  // 举报按钮
  toReport: function() {
    this.setData({
      isReport: this.data.isReport?false:true
    })
  },

  cancelbtn() {
    this.setData({
      isReport: false
    })
  },

  // 发送举报
  reportbtn: function() {
    if (this.data.report==="" || this.data.report.replace(/\s+/g, '').length===0) {
      let e = ['提示', '举报信息空空如也']
      this.showNotify(e)
      return
    }
    this.setData({
      showLoading: true
    })
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "toReport",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'JSESSIONID=' + app.globalData.SESSIONID
      },
      data: {
        postid: that.data.postid,
        report: that.data.report
      },
      success: function(res) {
        if (res.data.code===0) {
          that.setData({
            report: "",
            isReport: false
          })
          var e = ['提示', '举报信息已收到，我们将尽快核实并通知与您。感谢您为健康网络环境做出的贡献']
          that.showNotify(e)
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
          showLoading: false
        })
      },
      fail: () => {
        that.setData({
          showLoading: false
        })
      }
    })
  }

})