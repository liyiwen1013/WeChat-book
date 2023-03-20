// pages/book/book.js
import { BookModel } from '../../models/book.js'
import { random } from '../../utils/common.js'
const bookModel = new BookModel()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    searching: false,
    more: ''
  },

  toLibrary: function(e) {
    wx.navigateTo({
      url: '/pages/book/library/library',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(optins) {
    // 获取热门书籍(概要)
    const books = await bookModel.getHotList()
    this.setData({
      books
    })
  },

  onSearching(event){
    this.setData({
      searching: true
    })
  },

  onCancel(event){
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