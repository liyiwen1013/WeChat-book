// components/search/index.js
const app = getApp()
Page({
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    keyword: '', //搜索内容,比如你想搜索python相关书籍,则输入python
    noneResult: false,
    loading: false,
    loadingCenter: false,
    pages: 0,
    pageNum: 1,
    pageSize: 10
  },
  onLoad: function () {
    // 获取搜索界面
    this.setData({
      showLoading: true
    })
    this.getAllSelete()
  },
  attached() {
    // this.setData({
    //   historyWords: getHistory()
    // })
    // getHot().then(res => {
    //   this.setData({
    //     hotWords: res.data
    //   })
    // })
  },
  // 获取历史搜索词
  getHistory(){
    const words = wx.getStorageSync(this.data.q)
    if(!words){
      return []
    }
    return words
  },
  // 获取热门关键字
  getHot(){
    return this.request({
      url: 'book/hot_keyword'
    }) 
  },
  // 获取所有信息
  getAllSelete(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "book/search",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        keyword: that.data.q,
        // pageNum:,
        // pageSize:,
      },
      success: function(res) {
        console.log(',,.,,',res.data)
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

  // 点击取消
  onCancel: function(e) {
    console.log("e",e)
    this.setData({
      showModal: false
    });
  },

  // 点击清除搜索内容
  onDelete(e) {
    console.log("e",e)
    console.log("...........")
    console.log("this.data",this.data)
    this.setData({
      keyword: '',
      searching: false
    })
    wx.navigateTo({
      url: '/pages/book/book'
    })
  },

  getKeyword: function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  // 搜索
  onConfirm() {
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
              searching: true
            })
          } else {
            console.log("........")
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