var url = "http://localhost/"; // http://localhost/
var util = require("../../utils/util.js");
var page = 1;
var page_size = 3; 
var isMore=1;
var GetList = function (that) {
  that.setData({
    hidden: false
  });
  wx.showNavigationBarLoading();
  wx.request({
    url: url + 'get',
    data: {
      page: page,
      page_size: page_size
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      isMore = res.data.isMore;
      var whdthNum = res.data.items;
      if (whdthNum == 0) {
        that.setData({
          ShdthNum: whdthNum
        });
      }
      if(res.data != 0){
        var listData = wx.getStorageSync('infoList') || []
        for (var i = 0; i < res.data.items.length; i++) {
          listData.push(res.data.items[i]); 
        }
        wx.setStorageSync('infoList', listData)
        setTimeout(function () {
          that.setData({
            infoList: listData
          });
        }, 800)
        page++;
        setTimeout(function () {
          that.setData({
            hidden: true
          });
        }, 2000)
      }else{
        that.setData({
          hidden: true,
          display: false
        });
      }
      
    },
    complete: function () {
      wx.hideNavigationBarLoading(); 
      wx.stopPullDownRefresh();
    }
  })
}
// -------------------------------
Page({
  data: {
    picUrl: "", //服务器地址 用于显示图片
    infoList:[],
    hidden: true,
    display: true,
    ShdthNum: 1
  },
  onLoad: function () {
    try {
      wx.removeStorageSync('infoList')
    } catch (e) {
    }
  },
  //当小程序进入前台页面进行触发，用来再次进入时显示上次分享进入的页面
  onShow: function () {
    var that = this;
    var ShdthNum = that.data.ShdthNum;
    if (ShdthNum == 1) {
     GetList(that);
    }else{
      setTimeout(function () {
        try {
          var value = wx.getStorageSync('infoList')
          if (value) {
            that.setData({
              infoList: value,
            })
          }
        } catch (e) {
          console.log('error');
        }
      }, 1000) 
    }
  },
//下拉重新加载
  onPullDownRefresh: function () {
    page = 1;
    this.setData({
      display: true,
      infoList: []
    })
    wx.removeStorageSync('infoList')
    GetList(this)
  },
  //下滑翻页
  onReachBottom: function () {
    console.log(isMore);
    var that = this;  
    if(isMore==1){
      setTimeout(function () {
        GetList(that)
      }, 1000)
    }else{
      this.setData({
        display: false,
      })
    }
  },
// 点击按钮进行分享的方法
  onShareAppMessage: function () {
    var that = this;
    var picUrl = that.data.picUrl;
    return {
      title: '对自己喜欢的人表白',
      path: '/pages/index/index'
    }
  }
})
