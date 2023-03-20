// models/classic.js
import { HTTP } from '../utils/http.js'

class ClassicModel extends HTTP {
  // 获取最新一期
  getLatest(sCallback) {
    this.request({
      url: 'classic/latest',
      success: (res) => {
        sCallback(res)
        this._setLatestIndex(res.index)
        let key = this._getKey(res.index)
        console.log("获取最新一期的key",key)
        wx.setStorageSync(key, res)
      }
    })
  }
  // 获取当前一期的下一期 next下一期Previous上一期
  getClassic(index, nextOrPrevious, sCallback) {
    // 缓存中寻找 or API 写入到缓存中
    // key 确定key
    let key = nextOrPrevious == 'next' ? this._getKey(index + 1) : this._getKey(index - 1)
    console.log("key是next+1否则-1",key)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      this.request({
        url: `classic/${index}/${nextOrPrevious}`,
        success: (res) => {
          wx.setStorageSync(this._getKey(res.index), res)
          sCallback(res)
        }
      })
    } else {
      sCallback(classic)
    }
  }
  // 第一期 index：期号
  isFirst(index) {
    return index == 1 ? true : false
  }
  // 最后一期
  isLatest(index) {
    let latestIndex = this._getLatestIndex()
    return latestIndex == index ? true : false
  }

  // 喜欢列表内容
  getMyFavor(success) {
    const params = {
      url: 'classic/favor',
      success: success
    }
    this.request(params)
  }

  getById(cid, type, success) {
    let params = {
      url: `classic/${type}/${cid}`,
      success: success
    }
    this.request(params)
  }

  _setLatestIndex(index) {
     wx.setStorageSync('latest', index)
  }

  _getLatestIndex() {
    const index = wx.getStorageSync('latest')
    console.log("_getLatestIndex"+index)
    return index
  }

  _getKey(index) {
    const key = 'classic-' + index
    console.log("_getKey中key", key)
    return key
  }
}

export { ClassicModel }