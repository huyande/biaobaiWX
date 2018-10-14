//app.js
App({

  //监听小程序初始化，当小程序初始化完成时会触发发，且全局只触发一次
  onLaunch: function() {
    //console.log('app----------------执行');
    //调用API从本地缓存中获取数据
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(111111111);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  //用户自定义的全局数据，可以通过var app = getApp()获取app实例，再通过app.globalData.userInfo获取数据
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {  
    //调用登录接口
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        that.globalData.userInfo = res.userInfo
        typeof cb == "function" && cb(that.globalData.userInfo)
      }
    })
   }
  },

  globalData: {
    userInfo: null,
    urlPath: "http://localhost/", //http://localhost/
    openid: ''
  }
})
