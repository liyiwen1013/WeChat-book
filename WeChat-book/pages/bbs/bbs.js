const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    curItem: 0,
    navs: ["热点", "趣闻", "书评"],
    distance: 5,
    picHeight: 0.27*wx.getSystemInfoSync().windowWidth,
    isSelect: false,
    isShowLogin: false,
    showLoading: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    keyword: "",
    isLoading: false,
    isSearch: false,
    postLists: [],
    pageNum: 1,
    pageSize: 10,
    pages: 0
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

  onLoad: function() {
    this.setData({
      showLoading: true
    })
   // 获取所有的帖子，0 代表更新操作而不是加载。
    this.getPosts(0);
  },

  // 监听用户下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      isSearch: false,
      keyword: '',
      pageNum: 1,
      pageSize: 10,
      postLists: []
    })
    this.getPosts(0);
  },
  // 页面滚动到底部加载更多帖子
  onReachBottom() {
    this.setData({
      isLoading: true
    })
    // 加载更多帖子，1 代表加载操作而不是更新
    this.data.isSearch ? this.goSearch(1) : this.getPosts(1)
  },

  // 获取页面帖子列表
  getPosts: function(e) {
    console.log("dddd",e)
    console.log("dddd,,,,,,,,,",this.data)
    var that = this
    var pageNum = this.data.pageNum
    var action = e;
    if (action === 1 && pageNum >= this.data.pages + 1) {
      return
    }
    wx.request({
      url: app.globalData.baseUrl + "posts",
      method: "GET",
      data: {
        type: that.data.curItem,
        pageNum: pageNum,
        pageSize: that.data.pageSize
      },
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        console.log(res.data.data.list)
        console.log(res.data.data)
        if (res.data.code === "0000") {
          if (action === 0) {
            that.setData({
              postLists: that.data.postLists.concat(res.data.data.list),
              pageNum: pageNum + 1,
              pages: res.data.data.pages
            })
          } else {
            if (pageNum <= that.data.pages + 1 && res.data.data.list.length != 0) {
              that.setData({
                postLists: that.data.postLists.concat(res.data.data.list),
                pageNum: pageNum + 1
              })
            }
          }
        } else {
          // 显示通知窗口
          var e = ["刷新失败", res.data.msg]
          this.showNotify(e)
        }
      },
      error: function() {
        // 隐藏刷新动画
        wx.stopPullDownRefresh()
        var e = ["提示", "出了点儿错，稍后再试吧"]
        this.showNotify(e)
      },
      complete: function() {
        that.setData({
          showLoading: false,
          isLoading: false
        })
        // 隐藏刷新动画
        wx.stopPullDownRefresh()
      }
    })
  },

  // 导航栏点击反应
  changeNav: function(e) {
    var pickItem = e.currentTarget.dataset.id
    this.setData({
      curItem: pickItem,
      distance: (30*pickItem + 5),
      isSearch: false,
      pageNum: 1,
      pageSize: 10,
      postLists: [],
      keyword: ''
    })
    this.getPosts(0)
  },

  // 点击进入帖子详情
  toPassage: function(e) {
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    wx.navigateTo({
      url: 'passage/passage?title=' + e.currentTarget.dataset.title + '&id=' + e.currentTarget.dataset.id
    })
  },

  toSelect: function() {
    this.setData({
      isSelect: true
    })
  },

  // 趣闻、分享
  toNew: function(e) {
    this.setData({
      isSelect: false
    })
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    wx.navigateTo({
      url: 'new/new?postType=' + e.currentTarget.dataset.id,
    })
  },

  // 根据响应窗口类型关闭窗口
  closeWindow: function(e) {
    var modelid = e.currentTarget.dataset.modelid
    this.setData({
      [modelid]: false
    })
  },

  goLogin: function() {
    this.setData({
      isShowLogin: false
    })
    wx.navigateTo({
      url: '../login/login',
    })
  },

  getKeyword: function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  getSearchPosts: function() {
    this.setData({
      showLoading: true,
      isSearch: true,
      pageNum: 1,
      pageSize: 10,
      curItem: 0,
      distance: 5,
    })
    this.goSearch(0)
  },

  goSearch: function(e) {
    var that = this
    var action = e;
    var pageNum = this.data.pageNum
    if (action === 1 && pageNum >= this.data.pages + 1) {
      return
    }
    wx.request({
      url: app.globalData.baseUrl + "posts",
      method: "GET",
      data: {
        keyword: that.data.keyword,
        type: that.data.curItem,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      },
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        that.setData({
          showLoading: false
        })
        if (res.data.code==="0000") {
          if (action===0) {
            that.setData({
              postLists: res.data.data.list,
              pageNum: pageNum + 1,
              pages: res.data.data.pages
            })
          } else {
            console.log(pageNum <= that.data.pages + 1)
            if (pageNum <= that.data.pages + 1 && res.data.data.list.length != 0) {
              that.setData({
                postLists: that.data.postLists.concat(res.data.data.list),
                pageNum: pageNum + 1
              })
            }
          }
        } else {
          var e = ["刷新失败", res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        that.setData({
          showLoading: false,
        })
        var e = ["提示", "出了点儿错，稍后再试吧"]
        this.showNotify(e)
      }
    })
  }
})