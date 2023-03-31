// components/search/index.js
import { KeywordModel } from '../../../models/keyword.js'
import { BookModel } from '../../../models/book.js'
import { paginationBev } from '../../../components/behaviors/pagination.js'

const keywordModel = new KeywordModel()
const bookModel = new BookModel()

Component({
  /**
   * 组件的属性列表
   */
  // behaviors: [ paginationBev ],
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
    const pages = getCurrentPages()
    console.log('当前页面信息为：', pages)
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
  // 获取热门搜索词
  getHot(){
    return this.request({
      url: 'book/hot_keyword'
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

    onCancel: function() {
      wx.navigateBack({
        delta: 1 // 返回上一页，delta 为 1
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