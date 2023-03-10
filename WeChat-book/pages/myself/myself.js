// pages/myself/index.js
// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {

//   },

//   /**
//    * 组件的初始数据
//    */
//   data: {

//   },

//   /**
//    * 组件的方法列表
//    */
//   methods: {

//   }
// })

Page({
  data:{
  //用户信息开始为空
     userInfo:''
  },
  onLoad(){
      //获取本地缓存
      let user=wx.getStorageSync('user')
      console.log("进入小程序的index页面获取缓存",user)
      this.setData({
          userInfo:user
      })
  },
  
  //授权登录
  login(){
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    }),
      wx.getUserProfile({
          desc:'必须授权后才能继续使用',
          success:res=>{
              let user=res.userInfo
              //设置本地缓存,把用户信息缓存到本地
              wx.setStorageSync('user',user)
              console.log('用户信息',user)
              this.setData({
                  userInfo:user
              })
          }
      })
  },
  //退出登录
  loginOut(){
      this.setData({
          userInfo:''
      })
      wx.setStorageSync('user',null)
  }
})

