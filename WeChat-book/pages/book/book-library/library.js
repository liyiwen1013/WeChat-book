// pages/book/library/library.js
const app = getApp();
Page({
  data: {
    categoryList: [], // 分类栏数据
    booksList: [], // 图书数据
    current: 0, // 当前选中的分类索引
    bookCategoryId: -1,
    isShowLogin: false,
    showLoading: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
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

  onLoad: function () {
    this.setData({
      showLoading: true,
    })
    this.getCategoryList().then((result) => {
      // 获取异步操作的结果并直接返回
      this.getBooksList(this.data.bookCategoryId,0)
    }).catch((err) => {
      // 在 error() 方法中处理 Promise 对象返回的错误
      console.error(err)
    })
  },
  // 获取分类数据 
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
          console.log("categoryList",res.data)
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
        current: index, // 将当前选中的分类索引存储到 data 中
        pageNum: 1,
        pageSize: 10,
        booksList: [],
        bookCategoryId: bookCategoryId,
      })
      this.getBooksList(bookCategoryId,0) // 根据选中的分类索引获取对应的书籍列表
    }
  },
   // 页面滚动到底部加载更多帖子
   onReachBottom: function () {
    //触底开始下一页
    console.log("this.data",this.data)
    if (this.data.isLoading == false && this.data.pageNum <= this.data.pages) {
      this.setData({
        isLoading: true,
      })
      this.getBooksList(this.data.bookCategoryId,1);//重新调用请求获取下一页数据
    }
  },
  // 根据分类索引获取列表
  getBooksList: function (bookCategoryId,action) {
    var that = this
    console.log(bookCategoryId,action)
    if (action === 1 && that.data.pageNum >= that.data.pages + 1) {
      return
    }
    wx.request({
      url: app.globalData.baseUrl + 'book', 
      method: 'GET',
      data: {
        bookCategoryId: bookCategoryId,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      },
      success: (res) => {
        console.log("res.data1",res.data)
        console.log("that.data1",that.data)
        if (res.data.code==="0000") {
          if (action === 0) {
            that.setData({
              booksList: res.data.data.list,
              pageNum: res.data.data.current + 1,
              pages: res.data.data.pages
            })
          } else {
            if (that.data.pageNum <= that.data.pages + 1 && res.data.data.list.length != 0) {
              that.setData({
                booksList: that.data.booksList.concat(res.data.data.list),
                pageNum: res.data.data.current + 1,
                bookCategoryId: bookCategoryId
              })
            }
          }
        }
      },
      fail: () => {
        console.log('请求数据失败')
      },
      complete: () => {
        this.setData({
          isLoading: false
        })
      }
    })
  },

  onBook: function(e) {
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    wx.navigateTo({
      url:'../book-detail/book-detail?id=' + e.currentTarget.dataset.bookId
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
      url: '../../login/login',
    })
  }
})
