// pages/book/library/library.js
const app = getApp();
Page({
  data: {
    categoryList: [{
      "caName": "文学",
      "id": 0
    },
    {
      "caName": "历史",
      "id": 1
    },
    {
      "caName": "科技",
      "id": 2
    }], // 分类栏数据
    booksList: [{
      "bookId":"1",
      "image":"https://img3.doubanio.com/view/subject/l/public/s2768378.jpg",
      "name":"三体",
      "author":"刘慈欣",
      "favNums":"5",
      "category": 2
    },
    {
      "name": "追风筝的人",
      "author": "张嘉佳",
      "image": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 2
    },
    {
      "name": "梨子",
      "author": "张嘉佳",
      "image": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 0
    },
    {
      "name": "土豆",
      "price": 2.2,
      "author": "张嘉佳",
      "image": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 1
    },
    {
      "name": "白菜",
      "price": 1.5,
      "image": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 1
    },
    {
      "name": "西红柿",
      "price": 3.0,
      "image": "https://img1.doubanio.com/view/subject/l/public/s27264181.jpg",
      "category": 1
    }], // 图书数据
    current: 0, // 当前选中的分类索引
    isLoading: false,
    isShowLogin: false,
    showLoading: false,
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
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
    // 发起 post 请求获取分类列表数据
    wx.request({
      url: app.globalData.baseUrl + '',
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
  onCategoryTap: function (e) {
    const {index} = e.currentTarget.dataset
    console.log("index",index)
    this.setData({
      current: index // 将当前选中的分类索引存储到 data 中
    })
    this.getBooksList(index) // 根据选中的分类索引获取对应的书籍列表
  },
  // 根据分类索引获取列表
  getBooksList: function (index) {
    wx.request({
      url: app.globalData.baseUrl + '', 
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

  onBook: function() {
    if (!app.globalData.isLogin) {
      this.setData({
        isShowLogin: true
      })
      return
    }
    wx.navigateTo({
      url:'../book-detail/book-detail?bid=' + this.properties.bookId
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
})
