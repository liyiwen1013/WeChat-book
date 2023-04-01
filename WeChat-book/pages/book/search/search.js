// components/search/index.js
import { KeywordModel } from '../../../models/keyword.js'
import { BookModel } from '../../../models/book.js'
import { paginationBev } from '../../../components/behaviors/pagination.js'

const keywordModel = new KeywordModel()
const bookModel = new BookModel()

Component({
  behaviors: [ paginationBev ],
  properties: {
    more: {
      type: String,
      observer: 'loadMore'
    }
  },
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    q: '', //搜索内容,比如你想搜索python相关书籍,则输入python
    loading: false,
    loadingCenter: false
  },
  onLoad: function () {
    // 获取热门书籍(概要)
    this.setData({
      showLoading: true
    })
    this.getAllSelete()
  },


  attached() {
    this.setData({
      historyWords: getHistory()
    })
    getHot().then(res => {
      this.setData({
        hotWords: res.data
      })
    })
  },
  // 获取历史搜索词
  getHistory(){
    const words = wx.getStorageSync(this.data.q)
    if(!words){
      return []
    }
    return words
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
  
  loadMore() {
    if (!this.data.q) {
      return
    }
    if (this.isLocked()) {
      return
    }
    if (this.hasMore()) {
      this.locked()
      bookModel.search(this.getCurrentStart(), this.data.q)
        .then(res => {
          this.setMoreData(res.data.list)
          this.unLocked()
        }, () => {
          this.unLocked()
        })
    }
  },

    onCancel: function(e) {
      this.setData({
        searching: false,
        q: ''
      })
    },

    onDelete(event) {
      this.initialize()
      this._closeResult()
    },

    onConfirm(event) {
      this._showResult()
      this._showLoadingCenter()
      // this.initialize() 
      const q = event.detail.value || event.detail.text
      this.setData({
        q
      })
      bookModel.search(0, q)
        .then(res => {
          this.setMoreData(res.data.list)
          this.setTotal(res.data.total)
          keywordModel.addToHistory(q)
          this._hideLoadingCenter()
        })
    },

    _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },

    _hideLoadingCenter() {
      this.setData({
        loadingCenter: false
      })
    },

    _showResult() {
      this.setData({
        searching: true
      })
    },

    _closeResult() {
      this.setData({
        searching: false,
        q: ''
      })
    },

    onReachBottom(){
      console.log(123123)
    }
    // scroll-view | Page onReachBottom
  }
)