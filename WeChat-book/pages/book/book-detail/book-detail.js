// pages/book-detail/book-detail.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    content: [],
    book: null,
    bookId: 0,
    likeStatus: false,
    likeCount: 0,
    posting: false,
    isLoading: false,
    isShowLogin: false,
    showLoading: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log("bookId",e)
    this.setData({
      bookId: e.id,
      showLoading: true,
      loadingTxt: "玩命加载中"
    })
    this.getBookDetail()
    this.getBookComment()
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
  // 书籍详情
  getBookDetail: function() {
    var that = this
    console.log("eeee",this.data)
    wx.request({
      url: app.globalData.baseUrl + "book/" + this.data.bookId,
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        console.log("..",res.data)
        if (res.data.data.summary.includes("展开全部")) {
          console.log("该文本中包含“展开全部”");
          res.data.data.summary=res.data.data.summary.substring(0, res.data.data.summary.length - 6)
        }
        if (res.data.code==="0000") {
          that.setData({
            book: res.data.data
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
  // 获取短评
  getBookComment: function() {
    var that = this
    console.log("getBookComment",this.data)
    wx.request({
      url: app.globalData.baseUrl + "book/comment",
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        console.log("getBookComment.res.data",res.data)
        if (res.data.code==="0000") {
          that.setData({
            comments: res.data.data
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

  // 点击收藏
  onLike: function(e) {
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "book/collect",
      header: {
        'content-type': "application/json",
        'Authorization': 'Bearer ' + app.globalData.token // 涉及到登录
      },
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.bookId
      },
      success(res) {
        console.log("............like",res.data)
        if (res.data.code==="0000") {
          that.setData({
            'book.collectCount': res.data.data.collectCount,
            'book.isCollect': res.data.data.isCollect
          })
        }
      }
    })
  },

  // 点击输入短评
  onFakePost: function(e) {
    console.log(app.globalData.isLogin)
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    this.setData({
      posting: true
    })
  },

  // 标题输入
  getInput: function(e) {
    var inputid = e.currentTarget.dataset.inputid
    this.setData({
      [inputid]: e.detail.value,
    })
  },

  // 取消输入短评
  onCancel: function(e) {
    this.setData({
      posting: false
    })
  },

  // 提交短评
  onPost: function(e) {
    console.log("........e",e)
    console.log("........this.data",this.data)
    const content = this.data.content
    if (content=="" || content == null || content.replace( / (^\s*)l(\s*$)/g,"") == "") {
      var e = ["提示", '内容为空,请输入短评']
      this.showNotify(e)
    }
    if (content > 10) {
      var e = ["提示", '短评最多10个字']
      this.showNotify(e)
    }
    var that = this
    console.log("........this.data",this.data)
    wx.request({
      url: app.globalData.baseUrl + "book/comment",
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        content: that.data.content,
        bookId: that.data.bookId,
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code==="0000") {
          that.data.comments.unshift({content: content,count: 1})
          that.setData({
            comments: that.data.comments,
            posting: false
          })
          var e = ["评论成功", '去看看吧~']
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
  
  goLogin: function() {
    this.setData({
      isShowLogin: false
    })
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  // 根据响应窗口类型关闭窗口
  closeWindow: function(e) {
    var modelid = e.currentTarget.dataset.modelid
    this.setData({
      [modelid]: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareImageTap: function(res) {
    // if (!app.globalData.isLogin) {
    //   this.setData({
    //     isShowLogin: true
    //   })
    //   return
    // }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage: function() {
    return {
      title: '好书分享',
      path: '/pages/book/book-detail/book-detail',
      imageUrl: this.data.book.image
    }
  },
  // 分享到朋友圈回调
  onShareTimeline: function () {
    return {
      title: '好书分享',
      query: '/pages/book/book-detail/book-detail?id=' + res.target.dataset.bookId
    };
  }
})