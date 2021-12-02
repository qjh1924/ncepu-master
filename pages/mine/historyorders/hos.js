const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifcheckoderinfo: true,
    perorder: {},
    ordersinfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: '',
      method: 'GET',
      data:{
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          ordersinfo: res.data
        })
      }
    })
  },
/*
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  showtip: function(e){
    var that = this
    this.setData({
      perorder: that.data.ordersinfo[e.currentTarget.dataset.val],
      ifcheckoderinfo: false
    })
  },
  confirmOrder: function(){
    this.setData({
      ifcheckoderinfo: true
    })
  }
})