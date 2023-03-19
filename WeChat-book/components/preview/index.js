// components/preview/index.js
Component({
    /**
   * 组件的初始数据
   */
  data: {
    typeText:''
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    classic: {
      type: Object,
      observer(newVal) {
        if (newVal) {
          var typeText = {
            1: "电影",
            2: "音乐",
            3: "句子"
          }[newVal.type]
        }
        this.setData({
          typeText
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event){
      this.triggerEvent('tapping', {
        cid: this.properties.classic.id,
        type: this.properties.classic.type
      },{})
    }
  }
})