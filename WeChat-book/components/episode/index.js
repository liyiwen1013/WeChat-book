// components/episode/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index:{
      type:String,
      observer:function(day, oldVal, changedPath){
        console.log("day",day)
        let val = day < 10 ? '0'+day : day
        console.log("设置后的日期",val)
        this.setData({
          day:val
        })
      }
    }
  },
  // wxs

  /**
   * 组件的初始数据
   */
  data: {
    months: [
      '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月',
      '十二月'
    ],
    year: 0,
    month: '',
    day:''
  },

  attached:function(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    console.log(day)
    console.log(this.data.months[month])

    this.setData({
      year:year,
      month:this.data.months[month],
      day:day,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
