//app.js
App({
  onLaunch: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，为了更好的为您服务，请点击确定重启应用',
              success: function (res) {
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，为了更好的为您服务，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
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
            console.log(e)
            var openId = e.data.openid
            wx.setStorageSync("openid", openId)
            that.globalData.openid = openId
            that.testlogin()
          }
        })
      }
    })
    
    wx.request({
      url: '',
      success (res) {
        that.globalData.deliveryfee = res.data.delivery_fee,
        that.globalData.deliverythreshold = res.data.delivery_threshold
      },
      fail() {
        wx.showToast({
          title: '网络故障，请您稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  testlogin: function() {
    var that = this
    wx.request({
      url: '' + that.globalData.openid,
      success: function (res) {
        if (res.data.ifsignup == "true"){
          that.globalData.iflogin = true
          that.globalData.loginfinished = true
          that.globalData.username = res.data.nickname
          that.globalData.userphonenum = res.data.pnum
          that.globalData.useraddress = res.data.add
        }
        if (that.loginfinishedCallback){
          that.loginfinishedCallback(that.globalData.loginfinished);
       }
      }
    })
  },
  globalData: {
    codername: "qiujianhui",
    openid: '',
    orderitem: [],
    ordernum:[],
    iflogin:false,
    loginfinished:false,
    username: '',
    userphonenum: '',
    useraddress: '',
    orderslist: [],
    deliveryfee: 0,
    deliverythreshold: 0
  }
})