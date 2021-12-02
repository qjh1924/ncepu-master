//mine.js
//获取应用实例
const app = getApp()

Page({
   data: {
  //   iflogin: false,
  //   userInfo: {},
  //   hasUserInfo: false,
  //   canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  
  onLoad: function () {
  },

  onShow: function () {
    var that = this
    wx.login({
      success: res => {
        var code = res.code
        wx.request({
          url: '' +  code,
          header: {
            'content-type': 'application/json'
          },
          success(e) {
            var openId = e.data.openid
            wx.setStorageSync("openid", openId)
            app.globalData.openid = openId
            that.testlogin()
          }
        })
      }
    })
  },
  testlogin: function() {
    var that = this
    wx.request({
      url: '' + app.globalData.openid,
      success: function (res) {
        if (res.data.ifsignup == "true"){
          app.globalData.iflogin = true
          app.globalData.username = res.data.nickname
          app.globalData.userphonenum = res.data.pnum
          app.globalData.useraddress = res.data.add
        }
      }
    })
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function() {
    return {
      title: '快来和我一起体验吧~',
      path: '/pages/shouye/shouye'
    }
  },
  onShareTimeline: function(){
    return {
      title: '发现了一个很好的小程序，一起来体验吧~'
    }
  }
})