import { ClassicModel } from '../../models/classic.js'
import { LikeModel } from '../../models/like.js'

const classicModel = new ClassicModel()
const likeModel = new LikeModel()

Component({
  /**
   * 页面的初始数据
   */
  properties: {
    cid: Number, //点赞数
    type: Number //期刊类型
  },

  data: {
    classic: null,
    latest: true,
    first: false,
    likeCount: 0,
    likeStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached: function (options) {
    const cid = this.properties.cid
    const type = this.properties.type
    if (!cid) {
      classicModel.getLatest((res) => {
        this.setData({
          classic: res.data,
          likeCount: res.favNums,
          likeStatus: res.likeStatus
        })
      })
    }
    else{
      classicModel.getById(cid, type,res=>{
        this._getLikeStatus(res.id, res.type)
        this.setData({
          classic: res,
          latest: classicModel.isLatest(res.index),
          first: classicModel.isFirst(res.index)
        }) 
      })
    }
  },

  methods: {
    onLike: function (event) {
      const behavior = event.detail.behavior
      likeModel.like(behavior, this.data.classic.id, this.data.classic.type)
    },

    // 获取当前一期的下一期
    onNext: function (event) {
      this._updateClassic('next')
    },
    
    // 获取当前一期的上一期
    onPrevious: function (event) {
      this._updateClassic('previous')
    },

    _updateClassic(nextOrPrevious) {
      const index = this.data.classic.id
      console.log("index", index)
      classicModel.getClassic(index, nextOrPrevious, (res) => {
        this._getLikeStatus(res.data.id)
        this.setData({
          classic: res.data,
          latest: classicModel.isLatest(res.id),
          first: classicModel.isFirst(res.id)
        })
      })
    },

    _getLikeStatus(id) {
      // 获取点赞信息
      likeModel.getClassicLikeStatus(id,
        (res) => {
          this.setData({
            likeCount: res.favNums, //点赞次数
            likeStatus: res.likeStatus, //是否点赞
          })
        })
    },
  }
})