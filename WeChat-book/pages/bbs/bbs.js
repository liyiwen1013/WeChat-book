const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    curItem: 0,
    navs: ["热点", "趣闻", "分享"],
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
    isNormal: false,
    pageSize: 10,
    pageNum: 1
  },

  onShow: function() {
    this.setData({
      isNormal: wx.getStorageSync('isNormal')
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

  onLoad: function() {
    // 如果用户之前登陆过，自动登录
    if (app.globalData.name && !app.globalData.isLogin) {
      this.goLogin()
    }
    this.setData({
      showLoading: true
    })
   // 获取所有的帖子，0 代表更新操作而不是加载。
    this.getPosts(0);
  },

  // 监听用户下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      isSearch: false
    })
    this.getPosts(0);
  },
  // 页面滚动到底部加载更多帖子
  onReachBottom() {
    this.setData({
      isLoading: true
    })
    // 加载更多帖子，1 代表加载操作而不是更新
    this.data.isSearch ? this.getSearchPosts(1) : this.getPosts(1)
  },

  //下面是一个包含操作的数组 e 的主要函数
  getPosts: function(e) {
    var that = this
    var postlen = this.data.postLists.length
    var resPosts = this.data.postLists
    var currentDate = util.formatTime(new Date)  // 获取当前时间，并赋值给currentDate变量
    var action = e // 0
    wx.request({
      url: app.globalData.baseUrl + "posts",
      method: "GET",
      data: {
        type: that.data.curItem,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      },
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        console.log(".....",res.data.data.list)
        console.log(".....,,,",res.data)
        console.log(".....,,,...",action)
        if (res.data.code==="0000") {
          // 当更新时，直接替换原始帖子数组
          if (action===0) {
            that.setData({
              postLists: res.data.data.list,
            })
          } else {
            // 当加载更多时
            if (!res.data===null) {
              resPosts.push(res.data.data.list)
              console.list(resPosts)
              that.setData({
                postLists: resPosts
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
    console.log(".....,,")
    console.log(e.currentTarget.dataset.id)
    this.setData({
      curItem: pickItem,
      distance: (30*pickItem + 5),
      isSearch: false
    })
    this.getPosts(0)
  },

  // 点击新建
  toPassage: function(e) {
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    wx.navigateTo({
      url: 'passage/passage?title='+e.currentTarget.dataset.title+'&postid='+e.currentTarget.dataset.id,
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
      showLoading: true
    })
    this.goSearch(0)
  },

  goSearch: function(e) {
    var that = this
    var resPosts = this.data.postLists
    var currentDate = util.formatTime(new Date())
    var postlen = this.data.postLists.length
    var action = e
    wx.request({
      url: app.globalData.baseUrl+"getSearchPosts",
      method: "POST",
      data: {
        keyword: that.data.keyword,
        lastdate: action===0?currentDate:that.data.postLists[postlen - 1].date
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'JSESSIONID=' + app.globalData.SESSIONID
      },
      success: function(res) {
        that.setData({
          showLoading: false
        })
        if (res.data.code===0) {
          if (action===0) {
            that.setData({
              postLists: res.data.data
            })
          } else {
            resPosts.push(resPosts)
            that.setData({
              postLists: resPosts
            })
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