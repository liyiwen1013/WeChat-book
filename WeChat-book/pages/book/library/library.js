// pages/book/library/library.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [{
      "name": "文学",
      "id": 0
    },
    {
      "name": "历史",
      "id": 1
    },
    {
      "name": "科技",
      "id": 2
    }], // 分类栏数据
    booksList: [{
      "name": "了不起的盖茨比",
      "author": "刘慈欣",
      "imgUrl": "https://img3.doubanio.com/view/subject/l/public/s2768378.jpg",
      "category": 0
    },
    {
      "name": "追风筝的人",
      "author": "张嘉佳",
      "imgUrl": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 2
    },
    {
      "name": "梨子",
      "author": "张嘉佳",
      "imgUrl": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 0
    },
    {
      "name": "土豆",
      "price": 2.2,
      "author": "张嘉佳",
      "imgUrl": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 1
    },
    {
      "name": "白菜",
      "price": 1.5,
      "imgUrl": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 1
    },
    {
      "name": "西红柿",
      "price": 3.0,
      "imgUrl": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 1
    }], // 图书数据
    current: 0 // 当前选中的分类索引
  },
  onLoad: function (options) {
    // 发起 post 请求获取分类列表数据
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      success: (res) => {
        this.setData({
          categoryList: res.data.categoryList, // 解析返回的分类数据
          booksList: res.data.booksList // 解析返回的书籍列表数据
        })
      },
      fail: (error) => {
        console.log('请求数据失败', error)
      }
    })
  },
  // 点击每个分类触发的事件
  onCategoryTap: function (event) {
    const { index } = event.currentTarget.dataset
    console.log("index",index)
    this.setData({
      current: index // 将当前选中的分类索引存储到 data 中
    })
    this.getBooksList(index) // 根据选中的分类索引获取对应的书籍列表
  },
  // 根据分类索引获取商品列表
  getBooksList: function (index) {
    wx.request({
      url: app.globalData.baseUrl, 
      method: 'POST',
      data: {
        categoryIndex: index
      },
      success: (res) => {
        this.setData({
          booksList: res.data.booksList
        })
      },
      fail: () => {
        console.log('请求数据失败')
      }
    })
  },
  onNextBook: function() {
    wx.navigateTo({
      url: '/pages/book/book-detail/book-detail',
    })
  }
})
