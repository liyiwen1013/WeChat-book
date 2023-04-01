// pages/book/book.js
import { random } from '../../utils/common.js'
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
    more: '',
    bookCategoryId: 0
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
    this.getHotList()
  },
  getHotList: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "book",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        bookCategoryId: that.data.bookCategoryId
      },
      success: function(res) {
        console.log(',,..,,',res.data)
        if (res.data.code==="0000") {
          that.setData({
            books: res.data.data
          })
        } else {
          // 显示通知窗口
          var e = ["获取失败", res.data.msg]
          that.showNotify(e)
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
  onSearching: function(e){
    this.setData({
      searching: true
    })
  },

  toLibrary: function(e) {
    console.log("e",e)
    wx.navigateTo({
      url: 'book-library/library',
    })
  },
  onTap: function(e){
    wx.navigateTo({
      url:'book-detail/book-detail?id=' + e.currentTarget.dataset.bookId
    })
  },

  onCancel: function(e){
    this.setData({
      searching: false
    }) 
  },

  onReachBottom(){
    this.setData({
      more: random(16)
    })
  }
})