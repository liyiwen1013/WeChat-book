// pages/book/library/library.js
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    searching: false,
    more: '',
    cateName: ['精选','小说','文学','传记','历史','军事','文化','计算机'],
    cateItems: [
      {
        cate_id: 0,
        cate_name: "精选",
        ishaveChild: true,
        children: []
      },
      {
        cate_id: 2,
        cate_name: "彩妆",
        ishaveChild: true,
        children:
        []
      },
      {
        cate_id: 3,
        cate_name: "香水",
        ishaveChild: true,
        children:
        [
          {
            child_id: 1,
            name: '淡香水EDT',
            image: "https://tse3-mm.cn.bing.net/th/id/OIP-C.L22gqjdMg1THBTMcvnv8TAHaHa?w=198&h=197&c=7&r=0&o=5&dpr=1.25&pid=1.7"
          },
          {
            child_id: 2,
            name: '浓香水EDP',
            image: "https://tse3-mm.cn.bing.net/th/id/OIP-C.mawe6N3JwRaNlkkHdzxIewHaHa?w=211&h=211&c=7&r=0&o=5&dpr=1.25&pid=1.7"
          }
        ]
      },
      {
        cate_id: 4,
        cate_name: "女装",
        ishaveChild: false,
        children: []
      },
      {
          cate_id: 5,
          cate_name: "男装",
          ishaveChild: false,
          children: []
        },
        {
          cate_id: 6,
          cate_name: "女鞋",
          ishaveChild: false,
          children: []
        },
        {
          cate_id: 7,
          cate_name: "男鞋",
          ishaveChild: false,
          children: []
        },
        {
          cate_id: 8,
          cate_name: "母婴",
          ishaveChild: false,
          children: []
        }
    ],
    curNav: 1,
    curIndex: 0
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl, 
      data: {
        id: '1',
        position: '2',
        class_id: '3'
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          cateItems: res.data.data
        })
        console.log(res.data.data);
        console.log(res.data.data['0'].list);
      }
    })
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
    index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  }
})