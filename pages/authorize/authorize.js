const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: app.globalData.urlPath + 'GetOpenid/code/' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            app.globalData.openid = res.data.openid
            console.log(res);
          }
        })
      }
    })

    var that = this;
    // 查看是否授权
    console.log('授权页面 onload的方法');
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.openid = res.data.openid
              console.log(app.globalData.openid );
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      app.globalData.userInfo = e.detail.userInfo;
      console.log('点击允许授权的按钮');
      console.log(e.detail.userInfo);
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: app.globalData.urlPath + 'user/add',
        data: {
          openid: app.globalData.openid,
          nickname: e.detail.userInfo.nickName,
          avatarurl: e.detail.userInfo.avatarUrl,
          province: e.detail.userInfo.province,
          city: e.detail.userInfo.city,
          gender: e.detail.userInfo.gender
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //从数据库获取用户信息
          // that.queryUsreInfo();
          console.log("插入小程序登录用户信息成功！");
        }
      });
      //授权成功后，跳转进入小程序首页
      console.log("授权成功后，跳转进入小程序首页");   
      wx.switchTab({
        url: '/pages/index/index'
      })
      console.log("授权成功后，跳转进入小程序首页");
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: app.globalData.urlPath + 'user/userInfo',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.userInfo = res.data;
      }
    }) ;
  },

})
