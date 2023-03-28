const app = getApp()
const bgMusic = wx.getBackgroundAudioManager()
Page({
  data: {
    isNormal: false,
    navs: ["书籍", "音乐", "电影"],
    curItem: 0, 
    curIndex: 0,
    curUIndex: 0, // 音乐
    curMIndex: 0, // 电影
    playing: false,
    aniBar: "",
    ww: wx.getSystemInfoSync().windowWidth, // 获取当前设备屏幕的宽度
    distance: 7,
    isSelect: false,
    bitem: [
      {
        "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
        "content": "前路不明，但愿有星光引路，把我从黑暗中带出来，让我看到点亮的希望。",
        "note": "探索这个宇宙的真正意义，在于我们从中汲取的文明和智慧，从而让我们的未来更加美好。",
        "bookName": "《三体》",
      },
      {
        "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
        "content": "这里填写昨天的句子内容",
        "note": "这里填写昨天句子的来源"
      },
      {
        "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
        "content": "这里填写前天的句子内容",
        "note": "这里填写前天句子的来源"
      },
      {
        "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
        "content": "这里填写前三天的句子内容",
        "note": "这里填写前三天句子的来源"
      }
    ], // 书籍
    uitem: [{
      "mu-picture": "https://cdn.pixabay.com/photo/2023/01/01/23/37/woman-7691013__340.jpg",
      "music": "http://music.163.com/song/media/outer/url?id=393926.mp3",
      "musicName": "林",
      "musicNote": "你陪我步入蝉夏,越过城市喧嚣",
    },{
      "mu-picture": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
      "music": "http://music.163.com/song/media/outer/url?id=393926.mp3",
      "musicName": "林",
      "musicNote": "你陪我步入蝉夏,越过城市喧嚣~~~~",
    },{
      "mu-picture": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
      "music": "http://music.163.com/song/media/outer/url?id=393926.mp3",
      "musicName": "林",
      "musicNote": "你陪我步入蝉夏,越过城市喧嚣",
    },{
      "mu-picture": "http://bl.talelin.com/images/music.8.png",
      "music": "http://music.163.com/song/media/outer/url?id=393926.mp3",
      "musicName": "林",
      "musicNote": "你陪我步入蝉夏,越过城市喧嚣",
    }], // 音乐
    mitem: [{
      "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
      "movieName": "深海",
      "note": ["这里填写今天句子的来源","这里填写今天句子的来源","这里填写今天句子的来源"],
    },{
      "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
      "movieName": "深海哈",
      "note": ["这里填写今天句子的来源","这里填写今天句子的来源","这里填写今天句子的来源"],
    },
    {
      "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
      "movieName": "深海案件",
      "note": ["这里填写今天句子的来源","这里填写今天句子的来源","这里填写今天句子的来源"],
    },
    {
      "picture2": "https://cdn.pixabay.com/photo/2022/12/01/00/13/antique-7627999__340.jpg",
      "movieName": "深海hai",
      "note": ["这里填写今天句子的来源","这里填写今天句子的来源","这里填写今天句子的来源"],
    }], // 电影
    picH: 0.4555 * wx.getSystemInfoSync().windowWidth,
    cdate: [],
    scdate: [],
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    showLoading: false,
    canvas: null,
    _context: null,
    zpostarray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    dpostarray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    pw: wx.getSystemInfoSync().windowWidth,
    ph: wx.getSystemInfoSync().windowHeight,
    postword: '',
    voteDetail: [],
    isLogin: false
  },
  onLoad() {
    // 初始化了一些页面所需的数据变量
    this.setData({
      isLogin: app.globalData.isLogin,
      showLoading: true,
      'cdate[0]': this.getEnDateStr(0),
      'cdate[1]': this.getEnDateStr(-1),
      'cdate[2]': this.getEnDateStr(-2),
      'cdate[3]': this.getEnDateStr(-3),
    })
    // 四个日期字符串的数组
    let cdate = this.data.cdate
    // 日期字符串简化后的数组
    this.setData({
      'scdate[0][1]': cdate[0][1].substr(0, cdate[0][1].length - 2),
      'scdate[1][1]': cdate[1][1].substr(0, cdate[1][1].length - 2),
      'scdate[2][1]': cdate[2][1].substr(0, cdate[2][1].length - 2),
      'scdate[3][1]': cdate[3][1].substr(0, cdate[3][1].length - 2),
    })
    this.getSentence() // 获取当日格言
    this.getEnDateStr(0) // 获取当前日期
    this.getVoteDetail() // 获取当日投票详情
  },

  // 把监听用户登陆的函数放到onshow里面来，保证能够实时更新用户的登录态
  onShow() {
    this.setData({
      isLogin: app.globalData.isLogin,
      isNormal: wx.getStorageSync('isNormal')
    })
  },

  // 图片切换时触发
  changeSentence(e) {
    this.setData({
      curIndex: e.detail.current,
      curUIndex: e.detail.current,
      curMIndex: e.detail.current,
    })
    this.getVoteDetail()
    this._recoverStatus()
    this._monitorSwitch()
  },

  // 改变句子
  // changeDSentence(e) {
  //   this.setData({
  //     curMIndex: e.detail.current,
  //     curIndex: e.detail.current
  //   })
  //   this.getVoteDetail()
  // },

  //图片方法预览
  picPreview: function(e) {
    var picUrl = []
    picUrl.push(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: picUrl
    })
  },

  // 弹窗
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

  // 复制文字
  copySentence(e) {
    let type = e.currentTarget.dataset.type
    console.log(type)
    let that = this
    wx.setClipboardData({
      data: type==='0'?that.data.bitem[that.data.curIndex].content:that.data.bitem[that.data.curIndex].note,
      success(res) {
        wx.showToast({
          title: '复制成功~',
        })
      }
    })
  },

  // 多个句子点击复制一个
  copydSentence(e) {
    let dindex = e.currentTarget.dataset.dindex
    let that = this
    wx.setClipboardData({
      data: that.data.ditem[that.data.curMIndex][dindex],
      success(res) {
        wx.showToast({
          title: '内容已复制',
        })
      }
    })
  },

  // 当日格言
  getSentence() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "",
      method: "GET",
      data: {
        type: 0,
        titlea: that.getDateStr(0),
        titleb: that.getDateStr(-1),
        titlec: that.getDateStr(-2),
        titled: that.getDateStr(-3),
      },
      success(res) {
        that.setData({
          showLoading: false,
          bitem: res.data.data
        })
      }
    })
  },

  // 点击上方导航栏
  changeNav: function(e) {
    let curItem = e.currentTarget.dataset.id
    console.log(curItem)  // 0 或 1 或 2
    this.setData({
      curItem: curItem,
      distance: 33*curItem + 7,
      showLoading: true
    })
    if (curItem===0) {
      this.getSentence()
    } else if (curItem===1) {
      this.getMuSentence()
    }else if (curItem===1) {
      this.getMoSentence()
    }
    this.getVoteDetail()
  },

  // 获取当前日期
  getDateStr(addDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate() + addDayCount); // 获取AddDayCount天后的日期 
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1; // 获取当前月份的日期 
    let d = dd.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },

  // 获取当前日期
  getEnDateStr(addDayCount) {
    var dt = new Date();
    dt.setDate(dt.getDate() + addDayCount); // 获取AddDayCount天后的日期
    let m = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
    let w = new Array("Monday","Tuseday","Wednesday","Thursday","Friday","Saturday","Sunday");
    let d = new Array("st","nd","rd","th");
    let mn = dt.getMonth();
    let wn = dt.getDay();
    let dn = dt.getDate();
    var dns;
    if(((dn%10)<1) ||((dn%10)>3)){
      dns=d[3];
    } else {
      dns=d[(dn%10)-1];
      if((dn==11)||(dn==12)){
        dns=d[3];
      }
    }
    let res = []
    res[0] = m[mn];
    res[1] = dn + dns;
    if (wn===0) {
      res[2] = w[6]
    } else {
      res[2] = w[wn-1]
    }
    return res
  },

  // 获取音乐数组
  getMuSentence() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "",
      method: "GET",
      data: {
        type: 1,
        titlea: that.getDateStr(0),
        titleb: that.getDateStr(-1),
        titlec: that.getDateStr(-2),
        titled: that.getDateStr(-3),
      },
      success(res) {
        that.setData({
          showLoading: false,
          uitem: res.data.data
        })
      }
    })
  },
  onPlay: function (e) {
    if (!this.data.playing) {
      this.setData({
        playing: true
      })
      bgMusic.title = '此时此刻';
      // bgMusic.coverImgUrl = this.data.uitem[curUIndex].mu-picture;
      bgMusic.src = 'music/M500001VfvsJ21xFqb.mp3';
      bgMusic.play();
    } else {
      this.setData({
        playing: false
      })
      bgMusic.pause()
    }
  },
  _recoverStatus: function () {
    if (bgMusic.paused) {
      this.setData({
        playing: false
      })
      return
    }
    if (bgMusic.src == this.data.uitem[curUIndex].music) {
      this.setData({
        playing: true
      })
    }
  },
  _monitorSwitch: function () {
    bgMusic.onPlay(() => {
      this._recoverStatus()
    })
    bgMusic.onPause(() => {
      this._recoverStatus()
    })
    bgMusic.onStop(() => {
      this._recoverStatus()
    })
    bgMusic.onEnded(() => {
      this._recoverStatus()
    })
  },

  // 获取电影数组
  getMoSentence() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "getDailySentence",
      method: "GET",
      data: {
        type: 2,
        titlea: that.getDateStr(0),
        titleb: that.getDateStr(-1),
        titlec: that.getDateStr(-2),
        titled: that.getDateStr(-3),
      },
      success(res) {
        that.setData({
          showLoading: false,
          mitem: res.data.data
        })
      }
    })
  },

  // 获取正能量上面的相关投票数据，包含对句子的投票和使用者是否对这个点赞了
  // 获取当日投票详情
  getVoteDetail() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "getVoteDetail",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        type: that.data.curItem,
        date: that.data.curItem == 0 ? that.getDateStr(-that.data.curIndex) : that.getDateStr(-that.data.curMIndex)
      },
      success(res) {
        if (res.data.code==="0000") {
          that.setData({
            voteDetail: res.data.data
          })
        }
      },
    })
  },
  // 点击点赞按钮人数的变化
  changeVoteState() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "changeVoteState",
      header: {
        'content-type': "application/json",
      },
      data: {
        type: that.data.curItem,
        date: that.data.curItem == 0 ? that.getDateStr(-that.data.curIndex) : that.getDateStr(-that.data.curMIndex)
      },
      success(res) {
        if (res.data.code==="0000") {
          that.setData({
            voteDetail: res.data.data
          })
        }
      }
    })
  }
})