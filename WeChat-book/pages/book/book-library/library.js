// pages/book/library/library.js
const app = getApp();
Page({
  data: {
    categoryList: [], // 分类栏数据
    booksList: [], // 图书数据
    current: 0, // 当前选中的分类索引
    bookCategoryId: -1,
    showLoading: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: ""
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

  onLoad: function () {
    this.setData({
      showLoading: true,
    })
    this.getCategoryList().then((result) => {
      // 获取异步操作的结果并直接返回
      this.getBooksList(this.data.bookCategoryId)
    }).catch((err) => {
      // 在 error() 方法中处理 Promise 对象返回的错误
      console.error(error)
    })
  },
  getCategoryList: function (){
    var that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.baseUrl + "book/category",
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.code==="0000") {
            if (res.data.data.length != 0) {
              that.setData({
                categoryList: res.data.data,
                bookCategoryId: res.data.data[0].id
              })
            }
          } else {
            var e = ['书籍类型获取失败', res.data.msg]
            that.showNotify(e)
          }
          resolve(res)
        },
        error() {
          var e = ['提示', '出了点儿错，稍后再试吧']
          that.showNotify(e)
        },
        complete() {
          that.setData({
            showLoading: false,
            loadingTxt: ""
          })
        }
      })
    })
  },

  // 点击每个分类触发的事件
  onCategoryTap: function (e) {
    let index = e.currentTarget.dataset.index
    let bookCategoryId = e.currentTarget.dataset.categoryId
    if (this.data.current != index) {
      this.setData({
        current: index // 将当前选中的分类索引存储到 data 中
      })
      this.getBooksList(bookCategoryId) // 根据选中的分类索引获取对应的书籍列表
    }
  },

  // 根据分类索引获取列表
  getBooksList: function (bookCategoryId) {
    wx.request({
      url: app.globalData.baseUrl + 'book', 
      method: 'GET',
      data: {
        bookCategoryId: bookCategoryId
      },
      success: (res) => {
        if (res.data.code==="0000") {
          this.setData({
            booksList: res.data.data
          })
        }
      },
      fail: () => {
        console.log('请求数据失败')
      }
    })
  },

  onBook: function(e) {
    wx.navigateTo({
      url:'../book-detail/book-detail?id=' + e.currentTarget.dataset.bookId
    })
  }
})
