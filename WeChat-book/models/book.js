import { HTTP } from '../utils/http-p.js'

class BookModel extends HTTP {
  data = null
  // 热评
  getHotList() {
    return this.request({
      url: 'book/hot_list'
    })
  }
  // 搜索
  search(start, q) {
    return this.request({
      url: 'book/search?summary=1',
      data: {
        q: q,
        start: start
      }
    })
  }
  // 获取喜爱的个数
  getMyBookCount() {
    return this.request({
      url: 'book/favor/count'
    })
  }
  // 详情
  getDetail(bid) {
    return this.request({
      url: `book/${bid}/detail`
    })
  }

  getLikeStatus(bid) {
    return this.request({
      url: `book/${bid}/favor`
    })
  }
  // 短评
  getComments(bid) {
    return this.request({
      url: `book/${bid}/short_comment`
    })
  }

  // 提交短评(书籍的ID号,提交的评论)
  postComment(bid, comment) {
    return this.request({
      url: 'book/short_comment',
      method: 'POST',
      data: {
        id: bid,
        content: comment
      }
    })
  }
}

export { BookModel }