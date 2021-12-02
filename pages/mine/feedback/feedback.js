
var app = getApp();
var util = require('../../../utils/util.js')
Page({
  data: {
    title:'',
    content:'',
    showtip: false
  },
  
  listenerTitle: function(e){
    this.setData({
      title:e.detail.value
    })
  },
  listenerTextarea: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit: function () {
    var that = this
    if (that.data.title == ''){
      wx.showModal({
        title: '提示',
        content: '您还未输入标题',
      })
    }
    else if (that.data.content == ''){
      wx.showModal({
        title: '提示',
        content: '反馈内容为空！',
      })
    }
    else if (app.globalData.openid == null){
      wx.showModal({
        title: '提示',
        content: '您还未登录，请返回"我的"页面进行微信登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '确认提交反馈信息',
        success(res) {
          if (res.confirm) {
            var dayTime = util.formatTime(new Date())
            wx.request({
              url: '',
              data: {
                openid: app.globalData.openid,
                timestamp: dayTime,
                title: that.data.title,
                content: that.data.content,
              },
              success: function(){
                wx.showModal({
                  title: '反馈成功',
                  content: '我们已收到并会尽快处理'
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '网络存在问题',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          }
        }
      })
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'showtip': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'showtip': false
    });
  }
})