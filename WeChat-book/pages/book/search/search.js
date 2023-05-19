// components/search/index.js
const app = getApp()
// 设置最大历史搜索记录数和过期时间（30天）
const MAX_HISTORY_SEARCH = 10;
const EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;
const MAX_HOT_SEARCH = 10;
const MIN_HOT_SEARCH_COUNT = 2;
Page({
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    keyword: '', //搜索内容,比如你想搜索python相关书籍,则输入python
    noneResult: false,
    isShowLogin: false,
    loading: false,
    loadingCenter: false,
    pages: 0,
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    historySearch: [],
    hotSearch: []
  },
  // 页面初始化时触发的事件
  onLoad() {
    // 页面初始化时从本地缓存中读取最近的历史搜索记录
    const historySearch = wx.getStorageSync('historySearch') || [];
    this.setData({
      historySearch: historySearch,
      showLoading: true
    });
    // 更新热门搜索列表
    this.updateHistorySearch()
    this.updateHotSearch()
    this.getHot()
  },

  // 搜索框输入事件处理
  onKeywordInput(e) {
    this.setData({
      keyword: e.detail.value.trim()
    })
  },

  // 点击搜索按钮时触发的事件
  // onSearch() {
  //   const keyword = this.data.keyword;
  //   if (!keyword) {
  //     wx.showToast({
  //       title: '请输入关键词',
  //       icon: 'none'
  //     });
  //     return;
  //   }
  //   // 将用户搜索的关键词保存到本地缓存中
  //   let historySearch = wx.getStorageSync('historySearch') || [];
  //   if (!historySearch.find(item => item.keyword === keyword)) {
  //     historySearch.unshift({
  //       keyword: keyword,
  //       time: new Date().getTime()
  //     });
  //     // 更新历史搜索列表
  //     this.updateHistorySearch();
  //   }
  //   wx.navigateTo({
  //     url: `/pages/searchResult/searchResult?keyword=${encodeURIComponent(keyword)}`
  //   });
  // },

  // 点击历史搜索或热门搜索时触发的搜索事件
  onSearchItemTap(e) {
    const keyword = e.detail.text;
    this.setData({
      keyword: keyword
    });
    this.onConfirm();
  },

  // 在搜索完成后更新历史搜索列表
  updateHistorySearch() {
    // 获取最近的历史搜索记录
    let historySearch = wx.getStorageSync('historySearch') || [];
    // 过滤出过期的历史搜索记录
    const now = new Date().getTime();
    historySearch = historySearch.filter(item => (now - item.time < EXPIRATION_TIME));
    // 只保留最近的历史搜索记录
    historySearch = historySearch.slice(0, MAX_HISTORY_SEARCH);
    wx.setStorageSync('historySearch', historySearch);
    // 更新历史搜索列表
    this.setData({
      historySearch: historySearch
    });
  },

  // 统计历史搜索记录中出现频率较高的关键词
  updateHotSearch() {
    const historySearch = wx.getStorageSync('historySearch') || [];
    const hotSearch = {};
    historySearch.forEach(item => {
      if (hotSearch[item.keyword]) {
        hotSearch[item.keyword].count++;
      } else {
        hotSearch[item.keyword] = {
          keyword: item.keyword,
          count: 1
        };
      }
    });
    let hotSearchList = Object.values(hotSearch);
    hotSearchList = hotSearchList.filter(item => (item.count >= MIN_HOT_SEARCH_COUNT));
    hotSearchList = hotSearchList.sort((a, b) => (b.count - a.count)).slice(0, MAX_HOT_SEARCH);
    this.setData({
      hotSearch: hotSearchList
    });
  },

  // 获取历史搜索词
  // getHistory(){
  //   console.log(".....") 
  //   const words = wx.getStorageSync(this.data.keyword)
  //   console.log(".....",words) 
  //   if(!words){
  //     return []
  //   }
  //   return words
  // },

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
  },

  // 点击搜索按钮时触发的事件
  onConfirm() {
    const keyword = this.data.keyword;
    if (!keyword) {
      wx.showToast({
        title: '请输入书籍名',
        icon: 'none'
      });
      return;
    }
    // 将用户搜索的关键词保存到本地缓存中
    let historySearch = wx.getStorageSync('historySearch') || [];
    console.log("historySearch",historySearch)
    if (!historySearch.find(item => item.keyword === keyword)) {
      historySearch.unshift({
        keyword: keyword,
        time: new Date().getTime()
      });
      // 更新历史搜索列表
      this.updateHistorySearch();
    }
    var that = this
    console.log("that.data",that.data)
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
        console.log(',,.,,',res.data)
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