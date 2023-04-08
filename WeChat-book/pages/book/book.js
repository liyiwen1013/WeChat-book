// pages/book/book.js
// import { random } from '../../utils/common.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    searching: false,
    isLoading: false,
    isShowLogin: false,
    showLoading: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    bookCategoryId: 0,
    pageNum: 1,
    pageSize: 10,
    pages: 0,
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
    // 获取热门书籍(概要)
    this.setData({
      showLoading: true
    })
    this.getHotList(0)
  },
  // 监听用户下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      pageNum: 1,
      pageSize: 10,
      books: []
    })
    // 0:更新帖子
    this.getHotList(0);
  },
  // 页面滚动到底部加载更多帖子
  onReachBottom() {
    if (this.data.isLoading == false && this.data.pageNum <= this.data.pages) {
      this.setData({
        isLoading: true
      })
      // 加载更多帖子，1:加载
      this.getHotList(1)
    }
  },
  getHotList: function(e) {
    var that = this
    let action = e
    if (action === 1 && that.data.pageNum >= that.data.pages + 1) {
      return
    }
    wx.request({
      url: app.globalData.baseUrl + "book",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        bookCategoryId: that.data.bookCategoryId,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize,
      },
      success: function(res) {
        if (res.data.code==="0000") {
          // 下拉更新
          if (action === 0) {
            that.setData({
              books: res.data.data.list,
              pageNum: res.data.data.current + 1,
              pages: res.data.data.pages
            })
          } else if (action === 1){
            if (that.data.pageNum <= that.data.pages + 1 && res.data.data.list.length != 0) {
              that.setData({
                books: that.data.books.concat(res.data.data.list),
                pageNum: res.data.data.current + 1
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
  onSearching: function(){
    wx.navigateTo({
      url: 'search/search',
    })
  },
  toLibrary: function() {
    wx.navigateTo({
      url: 'book-library/library',
    })
  },
  onTap: function(e){
    wx.navigateTo({
      url:'book-detail/book-detail?id=' + e.currentTarget.dataset.bookId
    })
  },

  onCancel: function(){
    this.setData({
      searching: false
    }) 
  }
})