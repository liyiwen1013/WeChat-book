// components/search/index.js
const app = getApp()
Page({
  data: {
    searching: false,
    noneResult: false,
    isShowLogin: false,
    loading: false,
    pages: 0,
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    history: [],
    hotWords: [],
    showDel: false,
  },
  // 页面初始化时触发的事件
  onLoad: function() {
    // 从本地存储中读取历史记录
    const history = wx.getStorageSync('history') || [];
    this.setData({ 
      history: history,
      showLoading: true
    })
    this.getHot()
  },

  // 搜索框输入事件处理
  onKeywordInput: function(e) {
    // 更新搜索框中的关键字
    this.setData({
      keyword: e.detail.value
    })
  },

  // 点击历史搜索或热门搜索时触发的搜索事件
  onItemClick: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword }, () => this.onConfirm());
  },
  onHotSearch: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword }, () => this.onConfirm());
  },

  // 获取热门关键字
  getHot(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'book/hot',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code==="0000") {
          that.setData({
            hotWords: res.data.data
          })
        } else {
          // 显示通知窗口
          var e = ["获取失败", res.data.msg]
          that.showNotify(e)
        }
      }
    })
  },

  // 点击取消
  onCancel: function() {
    wx.switchTab({
      url: '/pages/book/book'
    })
  },

  // 点击清除搜索内容
  onDelete() {
    this.setData({
      keyword: '',
      searching: false
    })
  },
  // 清除搜索记录
  onClearHistory: function () {
    this.setData({
      showDel: true,
    });
  },
  toDeleteHistory: function () {
    wx.removeStorageSync('history');
    this.setData({
      history: [],
      showDel: false,
    })
  },

  onBook: function(e){
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
      [modelid]: false,
      showDel: false
    })
  },
  goLogin: function() {
    this.setData({
      isShowLogin: false
    })
    wx.navigateTo({
      url: '../../login/login',
    })
  },

  // 点击搜索按钮时触发的事件
  onConfirm() {
    let { keyword, history } = this.data;
    if (!keyword) {
      wx.showToast({
        title: '请输入书籍名',
        icon: 'none'
      });
      return;
    }
    // 去除历史记录中的重复项
    history = history.filter(item => item !== keyword);
    // 将新的关键字添加到历史记录中并保存到本地存储中
    history.unshift(keyword);
    wx.setStorageSync('history', history);
    console.log(history)
    // 跳转到搜索结果页面
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "book/search",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        keyword: that.data.keyword,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize,
      },
      success: function(res) {
        if (res.data.code==="0000") {
          if (res.data.data.list.length !== 0) {
            console.log(".")
            that.setData({
              books: res.data.data.list,
              searching: true,
              noneResult: false
            })
          } else {
            that.setData({
              noneResult: true,
              searching: true
            })
          }
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
  }
})