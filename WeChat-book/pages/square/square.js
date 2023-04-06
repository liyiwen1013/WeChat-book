const app = getApp()
const innerAudioContext = wx.createInnerAudioContext({
  useWebAudioImplement: false
})
Page({
  data: {
    isNormal: false,
    navs: ["句子", "音乐", "电影"],
    curItem: 0, 
    curIndex: 0,
    type: 0,
    playing: false,
    ww: wx.getSystemInfoSync().windowWidth, // 获取当前设备屏幕的宽度
    distance: 7,
    isSelect: false,
    allItem: [],
    picH: 0.4555 * wx.getSystemInfoSync().windowWidth,
    cdate: [],
    scdate: [],
    showNotify: false,
    notifyTitle: "",
    notifyDetail: "",
    showLoading: false,
    zpostarray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    dpostarray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    pw: wx.getSystemInfoSync().windowWidth,
    ph: wx.getSystemInfoSync().windowHeight,
    voteDetail: [],
    isLogin: false
  },
  onShow() {
    // 初始化了一些页面所需的数据变量
    this.setData({
      isLogin: app.globalData.isLogin,
      isNormal: wx.getStorageSync('isNormal'),
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
    this.getAllPush(1)
    this.getEnDateStr(this.data.type) // 获取当前日期
  },

  // 把监听用户登陆的函数放到onshow里面来，保证能够实时更新用户的登录态
  // onShow() {
  //   this.setData({
  //     isLogin: app.globalData.isLogin,
  //     isNormal: wx.getStorageSync('isNormal')
  //   })
  //   this.getAllPush(1)
  //   this.getEnDateStr(this.data.type) // 获取当前日期
  // },
  // 图片切换时触发
  changeSentence(e) {
    this.setData({
      curIndex: e.detail.current,
    })
    if (this.data.type == 2) {
      this._recoverStatus()
      this._monitorSwitch()
    }
  },
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
  copySentence() {
    let that = this
    wx.setClipboardData({
      data: that.data.allItem[that.data.curIndex].content,
      success(res) {
        wx.showToast({
          title: '复制成功~',
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
      showLoading: true,
      type: curItem + 1
    })
    if (curItem===0) {
      this.getAllPush(1)
    } else if (curItem===1) {
      this.getAllPush(2)
    } else if (curItem===2) {
      this.getAllPush(3)
    }
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
  onPlay: function () {
    console.log("this.data",this.data)  
    if (!this.data.playing) {
      innerAudioContext.src = this.data.allItem[this.data.curIndex].content;
      innerAudioContext.play() // 播放
      // // 监听音频播放进度事件
      // audioContext.onTimeUpdate(() => {
      //   this.setData({
      //     duration: audioContext.duration,
      //     currentTime: audioContext.currentTime.toFixed(2)
      //   });
      // });
      this.setData({
        playing: true
      })
    } else {
      // 停止播放
      // innerAudioContext.stop() // 停止
      this.setData({
        playing: false,
      });
      innerAudioContext.pause() // 暂停
    }
  },
  _recoverStatus: function () {
    console.log("ddddd",innerAudioContext.src)
    console.log("aaaaa",this.data.allItem[this.data.curIndex].content)
    if (innerAudioContext.paused) {
      this.setData({
        playing: false
      })
      return
    }
    if (innerAudioContext.src === this.data.allItem[this.data.curIndex].content) {
      this.setData({
        playing: true
      })
    } else {
      this.setData({
        playing: false
      })
    }
  },
  _monitorSwitch: function () {
    innerAudioContext.onPlay(() => {
      this._recoverStatus()
    })
    innerAudioContext.onPause(() => {
      this._recoverStatus()
    })
    innerAudioContext.onStop(() => {
      this._recoverStatus()
    })
    innerAudioContext.onEnded(() => {
      this._recoverStatus()
    })
  },
  getAllPush(type) {
    let that = this
    console.log("type",type)
    wx.request({
      url: app.globalData.baseUrl + "push",
      method: "GET",
      data: {
        type: type,
        titlea: that.getDateStr(0),
        titleb: that.getDateStr(-1),
        titlec: that.getDateStr(-2),
        titled: that.getDateStr(-3),
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function(res) {
        that.setData({
          showLoading: false
        })
        if (res.data.code==="0000") {
          console.log(res.data)
          that.setData({
            allItem: res.data.data
          })
        } else {
          var e = ["刷新失败", res.data.msg]
          that.showNotify(e)
        }
      },
      error: function() {
        that.setData({
          showLoading: false,
        })
        var e = ["提示", "出了点儿错，稍后再试吧"]
        this.showNotify(e)
      }
    })
  },

  // 点击点赞按钮
  changeVoteState(e) {
    let that = this
    let idx = this.data.curIndex
    let allItem = this.data.allItem
    wx.request({
      url: app.globalData.baseUrl + "push/like",
      method: "POST",
      header: {
        'content-type': "application/json",
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        id: e.currentTarget.dataset.centenceId,
      },
      success(res) {
        console.log(res.data.code==="0000")
        if (res.data.code==="0000") {
          console.log(allItem)
          allItem[idx].isLike = res.data.data.isLike
          allItem[idx].likeCount = res.data.data.likeCount
          console.log(allItem)
          that.setData({
            allItem: allItem
          })
        }
      }
    })
  }
})